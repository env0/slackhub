import * as aws from '@pulumi/aws';

export const slackThreadGithubDiscussionTable = new aws.dynamodb.Table('slackThreadGithubDiscussion', {
  attributes: [
    { name: 'id', type: 'S' },
    { name: 'slackThreadId', type: 'S' },
    { name: 'githubDiscussionId', type: 'S' }
  ],
  hashKey: 'id',
  billingMode: 'PAY_PER_REQUEST',
  globalSecondaryIndexes: [
    { name: 'slackThreadIndex', hashKey: 'slackThreadId', projectionType: 'ALL' },
    { name: 'githubDiscussionIndex', hashKey: 'githubDiscussionId', projectionType: 'ALL' }
  ]
});
