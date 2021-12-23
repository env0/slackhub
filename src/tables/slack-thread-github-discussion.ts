import * as aws from '@pulumi/aws';

export const bySlackThread = 'slackThreadIndex';
export const byGitHubComment = 'githubCommentIndex';
export const slackThreadGithubDiscussionTable = new aws.dynamodb.Table('slackThreadGithubDiscussion', {
  attributes: [
    { name: 'id', type: 'S' },
    { name: 'slackThreadId', type: 'S' },
    { name: 'githubCommentId', type: 'S' }
  ],
  hashKey: 'id',
  billingMode: 'PAY_PER_REQUEST',
  globalSecondaryIndexes: [
    { name: bySlackThread, hashKey: 'slackThreadId', projectionType: 'ALL' },
    { name: byGitHubComment, hashKey: 'githubCommentId', projectionType: 'ALL' }
  ]
});
