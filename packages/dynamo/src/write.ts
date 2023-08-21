import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, NativeAttributeValue } from '@aws-sdk/util-dynamodb';

const getDynamoDbUpdateInputs = (item: Record<string, NativeAttributeValue>) => {
  let UpdateExpression = 'set ';
  const ExpressionAttributeNames: Record<string, string> = {};
  let ExpressionAttributeValues: Record<string, NativeAttributeValue> = {};

  const keys = Object.keys(item);
  // eslint-disable-next-line github/array-foreach
  keys.forEach((key, index) => {
    const attrName = `#${key}`;
    const attrValue = `:${key}`;
    ExpressionAttributeNames[attrName] = key;
    ExpressionAttributeValues[attrValue] = item[key];
    UpdateExpression += `${attrName} = ${attrValue}${index < keys.length - 1 ? ', ' : ''}`;
  });

  // Use marshall to convert JavaScript types to DynamoDB AttributeValues
  ExpressionAttributeValues = marshall(ExpressionAttributeValues);

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};

export const put = (region: string, tableName: string, items: Record<string, NativeAttributeValue>) => {
  const client = new DynamoDBClient({ region });

  const input: PutItemCommandInput = {
    TableName: tableName,
    Item: marshall(items, { removeUndefinedValues: true }),
  };

  return client.send(new PutItemCommand(input));
};

export const update = (
  region: string,
  tableName: string,
  key: Record<string, NativeAttributeValue>,
  item: Record<string, NativeAttributeValue>,
) => {
  const client = new DynamoDBClient({ region });

  const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = getDynamoDbUpdateInputs(item);

  const input: UpdateItemCommandInput = {
    TableName: tableName,
    Key: marshall(key),
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };

  return client.send(new UpdateItemCommand(input));
};
