# DynamoDB Fluent API Wrapper

This AWS wrapper provides a monadic or chained API for querying DynamoDB, turning the traditional API calls into a more expressive and fluent interface. It offers built-in support for common query operations and also handles `PUT`, `UPDATE`, and `DELETE` functionality. With this wrapper, developers can efficiently and fluently compose their DynamoDB queries.

## Features

- **Fluent/Chained API:** Enables you to chain methods together to build a query.
- **Built-in Support for Common Query Operations:** Such as adding a Key Condition Expression, Filter Expression, Indexes, and Expression Attribute Values.
- **Utility Methods:** Includes a `debug` method for debugging purposes and a `send` method to execute the query.
- **Data Marshalling and Unmarshalling:** Handles the marshalling and unmarshalling of DynamoDB attribute values.

## Installation

Before using this wrapper, ensure that you have the AWS SDK installed.

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb
```

## Making a Query

```bash
const result = await query('us-west-2', 'YourTableName')
  .addKeyConditionExpression('KeyConditionExpressionString')
  .addIndex('YourIndexName')
  .addFilterExpression('FilterExpressionString')
  .addExpressionAttributeValues({
    attributeName: 'AttributeValue'
  })
  .send();
```

## Debugging a Query

```bash
query('us-west-2', 'YourTableName')
  .addKeyConditionExpression('KeyConditionExpressionString')
  .debug();
```


## Future Development


## Contribution
If you would like to contribute to the development of this wrapper, please fork the repository and submit a pull request. Feedback and suggestions are always welcome!

## License
This project is licensed under the MIT License.