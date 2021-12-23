import * as aws from '@pulumi/aws';
import { byGitHubDiscussion, slackThreadGithubDiscussionTable } from '../../tables/slack-thread-github-discussion';
import { pullRequestToChannelName } from '../../commons/github/pull-request-to-channel-name';
import axios from 'axios';
import { getSlackUser } from '../../commons/user-map/get-slack-user'

export const prComment = async (slackbotAuthToken: string, body: any) => {
  console.log('pr comment event')

  // Create top-level comment
  const slackChannel = pullRequestToChannelName(body.pull_request);
  const slackName = getSlackUser(body.sender.login);
  const response = await axios.post('https://slack.com/api/chat.postMessage', { token: slackbotAuthToken, channel: slackChannel, text: body.comment.body, username: slackName });
  const slackThreadId = response.data.ts;

  // Store comment in Dynamo
  const client = new aws.sdk.DynamoDB.DocumentClient();
  await client.put({
    TableName: slackThreadGithubDiscussionTable.name.get(),
    Item: { "slackThreadId": { "S": slackThreadId }, "githubDiscussionId": { "S": `${body.comment.id}` }}
  }).promise();
}
