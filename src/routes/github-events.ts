import { Route } from '@pulumi/awsx/apigateway/api';
import * as aws from '@pulumi/aws';
import { byGitHubComment, slackThreadGithubDiscussionTable } from '../tables/slack-thread-github-discussion';
import { prOpen } from './github-events/pr-open';
import { prCommentReply } from './github-events/pr-comment-reply';
import { prComment } from './github-events/pr-comment';

export const githubEvents: Route = {
  path: 'github/events/{slackbotAuthToken}',
  method: 'POST',
  eventHandler: async event => {
    const slackbotAuthToken = event.pathParameters!['slackbotAuthToken']!;

    const eventName = event.headers['x-github-event'];
    const body = JSON.parse(event.body!);

    if(eventName === 'pull_request' && body.action === 'opened') {
      prOpen(slackbotAuthToken, body);
    }

    if(eventName === 'pull_request_review_comment') {
        prCommentReply(slackbotAuthToken, body);
      if(body.comment.in_reply_to_id) {
      } else {
        prComment(slackbotAuthToken, body);
      }
    }
    //
    // const client = new aws.sdk.DynamoDB.DocumentClient();
    //
    // // Get previous value and increment our table entry.
    // let tableData = await client
    //   .query({
    //     TableName: slackThreadGithubDiscussionTable.name.get(),
    //     IndexName: byGitHubDiscussion,
    //     KeyConditionExpression: 'githubDiscussionId = :v_githubDiscussionId',
    //     ExpressionAttributeValues: {
    //       ':v_githubDiscussionId': { S: discussionId }
    //     },
    //   })
    //   .promise();
    //
    // let value = tableData.Items;
    // let count = (value && value.count) || 0;
    // await client
    //   .put({
    //     TableName: counterTable.name.get(),
    //     Item: { id: route, count: ++count }
    //   })
    //   .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        /* route, count */
      })
    };
  }
};
