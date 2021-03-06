import * as aws from '@pulumi/aws';
import axios from 'axios';
import { byGitHubDiscussion, slackThreadGithubDiscussionTable } from '../../tables/slack-thread-github-discussion';
import { pullRequestToChannelName } from '../../commons/github/pull-request-to-channel-name';
import { getSlackUser } from '../../commons/user-map/get-slack-user';

export const prCommentReply = async (slackbotAuthToken: string, body: any) => {
  console.log('pr comment reply event');

  const client = new aws.sdk.DynamoDB.DocumentClient();
  const items = await client
    .query({
      TableName: slackThreadGithubDiscussionTable.name.get(),
      IndexName: byGitHubDiscussion,
      KeyConditionExpression: 'githubDiscussionId = :v_githubDiscussionId',
      ExpressionAttributeValues: {
        ':v_githubDiscussionId': `${body.comment.in_reply_to_id}`
      }
    })
    .promise();

  const slackThreadId = items.Items?.[0]?.slackThreadId;

  const slackChannel = pullRequestToChannelName(body.pull_request);
  const { name, image } = getSlackUser(body.sender.login);
  await axios.post(`https://slack.com/api/chat.postMessage?channel=${slackChannel}&text=${body.comment.body}&thread_ts=${slackThreadId}&username=${name}&icon_url=${image}`,null, { headers: { 'Authorization': `Bearer ${slackbotAuthToken}` } });
};
