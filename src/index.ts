import * as awsx from '@pulumi/awsx';
import { githubEvents } from './routes/github-events';

// Create an API endpoint.
let endpoint = new awsx.apigateway.API('api', {
  routes: [githubEvents, /* slackEvents should go here */]
});

exports.endpoint = endpoint.url;
