import * as aws from '@pulumi/aws';

export const bySlackThread = 'slackThreadIndex';
export const byGitHubDiscussion = 'githubDiscussionIndex';
export const slackThreadGithubDiscussionTable = new aws.dynamodb.Table('slackThreadGithubDiscussion', {
  attributes: [
    { name: 'id', type: 'S' },
    { name: 'slackThreadId', type: 'S' },
    { name: 'githubDiscussionId', type: 'S' }
  ],
  hashKey: 'id',
  billingMode: 'PAY_PER_REQUEST',
  globalSecondaryIndexes: [
    { name: bySlackThread, hashKey: 'slackThreadId', projectionType: 'ALL' },
    { name: byGitHubDiscussion, hashKey: 'githubDiscussionId', projectionType: 'ALL' }
  ]
});
