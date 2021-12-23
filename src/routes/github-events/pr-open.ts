import { pullRequestToChannelName } from '../../commons/github/pull-request-to-channel-name';
import axios from 'axios';

export const prOpen = async (slackbotAuthToken: string, body: any) => {
  const slackChannel = pullRequestToChannelName(body.pull_request);

  await axios.post('https://slack.com/api/conversations.create', {token: slackbotAuthToken, name: slackChannel});
}
