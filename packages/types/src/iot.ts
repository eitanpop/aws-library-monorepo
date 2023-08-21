export declare enum MeasureValueType {
  BIGINT = 'BIGINT',
  BOOLEAN = 'BOOLEAN',
  DOUBLE = 'DOUBLE',
  MULTI = 'MULTI',
  TIMESTAMP = 'TIMESTAMP',
  VARCHAR = 'VARCHAR',
}

export interface MeasureValue {
  Name: string | undefined;
  Value: string | undefined;
  Type: MeasureValueType | string | undefined;
}

export interface IRecord {
  Dimensions: Record<string, string>;
  MeasureName: string;
  MeasureValue?: string;
  MeasureValues?: MeasureValue[];
  MeasureValueType: string;
  Time: string;
  TimeUnit?: string;
}
