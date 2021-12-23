import * as aws from '@pulumi/aws';
import { byGitHubDiscussion, slackThreadGithubDiscussionTable } from '../../tables/slack-thread-github-discussion';
import { pullRequestToChannelName } from '../../commons/github/pull-request-to-channel-name';
import axios from 'axios';
import { getSlackUser } from '../../commons/user-map/get-slack-user';
import crypto from 'crypto'

export const prComment = async (slackbotAuthToken: string, body: any) => {
  console.log('pr comment event');

  // Create top-level comment
  const slackChannel = pullRequestToChannelName(body.pull_request);
  // const slackName = getSlackUser(body.sender.login);
  console.log(`trying to post ${body.comment.body}`)
  const response = await axios.post(`https://slack.com/api/chat.postMessage?channel=${slackChannel}&text=${body.comment.body}`,null, { headers: { 'Authorization': `Bearer ${slackbotAuthToken}` } });
  const slackThreadId = response.data.ts;

  // Store comment in Dynamo
  const client = new aws.sdk.DynamoDB.DocumentClient();
  await client.put({
    TableName: slackThreadGithubDiscussionTable.name.get(),
    Item: {
      'id': crypto.randomBytes(16).toString("hex"),
      'slackThreadId': { 'S': slackThreadId },
      'githubDiscussionId': { 'S': `${body.comment.id}` }
    }
  }).promise();
};
