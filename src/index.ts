import * as awsx from '@pulumi/awsx';
import { githubEvents } from './routes/github-events';
import { slackEvents } from './routes/slack-events';

// Create an API endpoint.
let endpoint = new awsx.apigateway.API('api', {
  routes: [githubEvents, slackEvents]
});

exports.endpoint = endpoint.url;
