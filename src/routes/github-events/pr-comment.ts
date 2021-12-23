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
  const { name, image } = getSlackUser(body.sender.login);
  const text =
    `
\`\`\`
${body.comment.diff_hunk}
\`\`\`

${body.comment.body}    
`
  console.log(`trying to post ${body.comment.body}`)
  const response = await axios.post(`https://slack.com/api/chat.postMessage?channel=${slackChannel}&text=${text}&username=${name}&icon_url=${image}`,null, { headers: { 'Authorization': `Bearer ${slackbotAuthToken}` } });
  const slackThreadId = response.data.ts;

  // Store comment in Dynamo
  const client = new aws.sdk.DynamoDB.DocumentClient();
  await client.put({
    TableName: slackThreadGithubDiscussionTable.name.get(),
    Item: {
      'id': crypto.randomBytes(16).toString("hex"),
      'slackThreadId': slackThreadId ,
      'githubDiscussionId':  `${body.comment.id}`
    }
  }).promise();
};
