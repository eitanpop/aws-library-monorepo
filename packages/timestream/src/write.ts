import {
  TimestreamWriteClient,
  WriteRecordsRequest,
  WriteRecordsCommand,
  Dimension,
  RejectedRecordsException,
  RejectedRecord,
} from '@aws-sdk/client-timestream-write';
import { IRecord } from '@aws-lib/types';

const writeClient = new TimestreamWriteClient({ region: 'us-east-1' });

const send = async (command: WriteRecordsCommand) => {
  try {
    return await writeClient.send(command);
  } catch (error: unknown) {
    if (error instanceof RejectedRecordsException && error.RejectedRecords?.length) {
      throw Error(
        `(${command.input.Records?.length}) Error record(s): ` +
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
    const command = new WriteRecordsCommand(newParams);
    writes.push(send(command));
  }

  return Promise.all(writes);
};

const getWriteClient = (databaseName: string, tableName: string) => ({
  write: async (commonDimensions: Dimension[], records: IRecord[]) => {
    if (!records.length) {
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

    return batchWrite(params);
  },
});

export default getWriteClient;
