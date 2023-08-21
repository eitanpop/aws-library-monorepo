import {
  TimestreamWriteClient,
  WriteRecordsRequest,
  WriteRecordsCommand,
  Dimension,
  RejectedRecordsException,
  RejectedRecord,
} from '@aws-sdk/client-timestream-write';
import { IRecord } from '@claritycare/types';
import logger from '../logger';

const writeClient = new TimestreamWriteClient({ region: 'us-east-1' });

const send = async (command: WriteRecordsCommand) => {
  try {
    return await writeClient.send(command);
  } catch (error: unknown) {
    logger.info('error', JSON.stringify(error));
    if (error instanceof RejectedRecordsException && error.RejectedRecords?.length) {
      logger.error(
        `(${command.input.Records?.length}) Error record(s):`,
        error?.RejectedRecords?.map((rejectedRecord: RejectedRecord) => {
          if (rejectedRecord.RecordIndex && command.input.Records)
            return command.input.Records[rejectedRecord.RecordIndex];
          return null;
        }),
      );
    }
    return null;
  }
};

const batchWrite = async (params: WriteRecordsRequest, batchSize = 100) => {
  const records = params.Records;
  if (!records?.length) throw Error('fatal exception');

  const writes = [];

  for (let i = 0; i < records.length; i += batchSize) {
    const newParams = { ...params, Records: records.slice(i, i + batchSize) };
    logger.info(`writing chunk: ${i} - ${i + newParams.Records.length}`, newParams.Records);
    const command = new WriteRecordsCommand(newParams);
    writes.push(send(command));
  }

  return Promise.all(writes);
};

const getWriteClient = (databaseName: string, tableName: string) => ({
  write: async (commonDimensions: Dimension[], records: IRecord[]) => {
    if (!records.length) {
      logger.info('no records to write');
      return [];
    }
    const params: WriteRecordsRequest = {
      DatabaseName: databaseName,
      TableName: tableName,
      Records: records.map((record: IRecord) => ({
        ...record,
        Dimensions: Object.entries(record.Dimensions).map(([name, value]: [string, string]) => ({
          Name: name,
          Value: value,
        })),
      })),
      CommonAttributes: { Dimensions: commonDimensions },
    };
    logger.info('writing', JSON.stringify(params));

    return batchWrite(params);
  },
});

export default getWriteClient;
