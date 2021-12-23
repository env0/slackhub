import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

// Create a mapping from 'route' to a count.
let counterTable = new aws.dynamodb.Table('counterTable', {
  attributes: [{ name: 'id', type: 'S' }],
  hashKey: 'id',
  readCapacity: 5,
  writeCapacity: 5
});

// Create an API endpoint.
let endpoint = new awsx.apigateway.API('hello-world', {
  routes: [
    {
      path: '/{route+}',
      method: 'GET',
      eventHandler: async (event) => {
        let route = event.pathParameters!['route'];
        let client = new aws.sdk.DynamoDB.DocumentClient();

        // Get previous value and increment our table entry.
        let tableData = await client
          .get({
            TableName: counterTable.name.get(),
            Key: { id: route },
            ConsistentRead: true
          })
          .promise();

        let value = tableData.Item;
        let count = (value && value.count) || 0;
        await client
          .put({
            TableName: counterTable.name.get(),
            Item: { id: route, count: ++count }
          })
          .promise();

        return {
          statusCode: 200,
          body: JSON.stringify({ route, count })
        };
      }
    }
  ]
});

exports.endpoint = endpoint.url;
