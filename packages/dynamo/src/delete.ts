import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, NativeAttributeValue } from '@aws-sdk/util-dynamodb';

type Options = {
  region: string;
  tableName: string;
};

type DeleteParameters = {
  keys: Record<string, NativeAttributeValue>;
  conditionExpression?: string;
  expressionAttributeValues?: Record<string, NativeAttributeValue>;
};

const deleteItem = (deleteParameters: DeleteParameters, options: Options) => {
  const { region, tableName } = options;
  const { keys, conditionExpression, expressionAttributeValues } = deleteParameters;
  const client = new DynamoDBClient({ region });
  const input: DeleteItemCommandInput = {
    TableName: tableName,
    Key: marshall(keys),
    ConditionExpression: conditionExpression,
    ExpressionAttributeValues:
      expressionAttributeValues &&
      marshall(
        Object.keys(expressionAttributeValues).reduce(
          (prev, current) => ({ ...prev, [`:${current}`]: expressionAttributeValues[current] }),
          {},
        ),
        { removeUndefinedValues: true },
      ),
  };

  return client.send(new DeleteItemCommand(input));
};

export default deleteItem;
