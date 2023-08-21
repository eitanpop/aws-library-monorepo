import { DynamoDBStreamEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import logger from '../../logger';

export type UnmarshalledEvent = {
  eventName: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined;
  keys: {
    [key: string]: any;
  };
  oldImage:
    | {
        [key: string]: any;
      }
    | undefined;
  newImage:
    | {
        [key: string]: any;
      }
    | undefined;
};

export const unmarshallEvent = (event: DynamoDBStreamEvent): UnmarshalledEvent[] | object => {
  return event.Records.map((record) => {
    const { dynamodb, eventName } = record;
    if (!dynamodb?.Keys) {
      return {};
    }
    const keys = DynamoDB.Converter.unmarshall(dynamodb.Keys);
    logger.info('keys', keys);
    const oldImage = dynamodb?.OldImage && DynamoDB.Converter.unmarshall(dynamodb.OldImage);
    const newImage = dynamodb?.NewImage && DynamoDB.Converter.unmarshall(dynamodb.NewImage);
    return {
      eventName,
      keys,
      oldImage,
      newImage,
    };
  });
};

export default unmarshallEvent;
