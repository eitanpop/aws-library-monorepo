import { ColumnInfo, Datum, QueryCommand, Row, TimestreamQueryClient } from '@aws-sdk/client-timestream-query';

type TimeSeriesValueParsed = { time: string | undefined; value: ParsedValue | undefined };

type ParsedValue = string | ParsedValue[] | ParsedValueObject | null | TimeSeriesValueParsed[];

interface ParsedValueObject {
  [key: string]: ParsedValue;
}

const parseValue = (datum: Datum | undefined): ParsedValue => {
  if (!datum) return null;

  if (datum.ScalarValue !== undefined) {
    return datum.ScalarValue;
  }

  if (datum.ArrayValue !== undefined) {
    return datum.ArrayValue.map(parseValue);
  }

  if (datum.TimeSeriesValue !== undefined) {
    return datum.TimeSeriesValue.map((dataPoint) => ({
      time: dataPoint.Time,
      value: parseValue(dataPoint.Value),
    }));
  }

  if (datum.RowValue !== undefined) {
    const rowData = datum.RowValue.Data;
    if (!rowData) return null;
    return rowData.map(parseValue);
  }

  if (datum.NullValue === true) {
    return null;
  }

  throw new Error('Unexpected Datum type');
};

const rowToJsonObject = (row: Row, columnInfo: ColumnInfo[]): ParsedValueObject => {
  return columnInfo.reduce((acc: ParsedValueObject, info, i) => {
    const data = row.Data?.[i];
    return info.Name && data ? { ...acc, [info.Name]: parseValue(data) } : acc;
  }, {});
};

export const read = async (query: string, region = 'us-east-1') => {
  const client = new TimestreamQueryClient({ region });
  const command: QueryCommand = new QueryCommand({
    QueryString: query,
  });
  const data = await client.send(command);

  if (!data.ColumnInfo) {
    throw new Error('ColumnInfo is undefined');
  }

  if (data.Rows?.length === 0) {
    return [];
  }
  return data.Rows?.map((row) => rowToJsonObject(row, data.ColumnInfo!));
};

export default read;
