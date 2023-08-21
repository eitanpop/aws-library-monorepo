import { DynamoDBClient, QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall, NativeAttributeValue } from '@aws-sdk/util-dynamodb';

// create a fluent API interface for dyanamo queries.
interface IQueryObject {
  addKeyConditionExpression: (keyConditionExpression: string) => IQueryObject;
  addIndex: (indexName: string) => IQueryObject;
  addFilterExpression: (filterExpression: string) => IQueryObject;
  addExpressionAttributeValues: (expressionAttributeValues: Record<string, NativeAttributeValue>) => IQueryObject;
  debug: () => IQueryObject;
  send: () => Promise<Record<string, NativeAttributeValue>[]>;
}

/// update the native QueryCommandInput with the new parameter
const addParameterToQueryCommandInput = (
  queryCommandInput: QueryCommandInput,
  name: keyof QueryCommandInput,
  value: (typeof queryCommandInput)[keyof QueryCommandInput],
): QueryCommandInput => {
  return {
    ...queryCommandInput,
    [name]: value,
  };
};

// The query object holds the functions to add parameters to the query.
// each function in the query object returns the query object itself, so that the functions can be chained.

// closure for the query API
const getQueryObjectWithOptions = (region: string) => {
  // encapsulate the native QueryCommandInput
  const getQueryObject = (input: QueryCommandInput): IQueryObject => {
    return {
      addKeyConditionExpression: (keyConditionExpression: string) =>
        getQueryObject(addParameterToQueryCommandInput(input, 'KeyConditionExpression', keyConditionExpression)),

      addIndex: (indexName: string) => getQueryObject(addParameterToQueryCommandInput(input, 'IndexName', indexName)),

      addFilterExpression: (filterExpression: string) =>
        getQueryObject(addParameterToQueryCommandInput(input, 'FilterExpression', filterExpression)),

      addExpressionAttributeValues: (expressionAttributeValues: Record<string, NativeAttributeValue>) =>
        getQueryObject(
          addParameterToQueryCommandInput(
            input,
            'ExpressionAttributeValues',
            marshall(
              Object.keys(expressionAttributeValues).reduce(
                (prev, current) => ({ ...prev, [`:${current}`]: expressionAttributeValues[current] }),
                {},
              ),
            ),
          ),
        ),

      debug: () => {
        return getQueryObject(input);
      },

      send: async (): Promise<Record<string, NativeAttributeValue>[]> => {
        const client = new DynamoDBClient({ region });
        const response = await client.send(new QueryCommand(input));
        return response.Items?.map((item) => unmarshall(item)) || [];
      },
    };
  };
  return getQueryObject;
};

const query = (region: string, tableName: string) => {
  const input: QueryCommandInput = {
    TableName: tableName,
  };

  return getQueryObjectWithOptions(region)(input);
};

export default query;
