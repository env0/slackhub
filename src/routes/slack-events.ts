import { Route } from '@pulumi/awsx/apigateway/api';
import * as aws from '@pulumi/aws';

export const slackEvents: Route = {
  path: 'slack/events',
  method: 'POST',
  eventHandler: async (event) => {
    // const slackbotAuthToken = event.pathParameters!['slackbotAuthToken'];
    const client = new aws.sdk.DynamoDB.DocumentClient();

    // Get previous value and increment our table entry.
    // let tableData = await client
    //   .get({
    //     TableName: counterTable.name.get(),
    //     Key: { id: route },
    //     ConsistentRead: true
    //   })
    //   .promise();
    //
    // let value = tableData.Item;
    // let count = (value && value.count) || 0;
    // await client
    //   .put({
    //     TableName: counterTable.name.get(),
    //     Item: { id: route, count: ++count }
    //   })
    //   .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ /* route, count */ })
    };
  }
};
