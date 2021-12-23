import { pullRequestToChannelName } from '../../commons/github/pull-request-to-channel-name';
import axios from 'axios';

export const prOpen = async (slackbotAuthToken: string, body: any) => {
  console.log('pr open event');
  const slackChannel = pullRequestToChannelName(body.pull_request);

  const requestData = { token: slackbotAuthToken, name: slackChannel };
  console.log(JSON.stringify({ axiosData: requestData }));
  const {status, data} = await axios.post(`https://slack.com/api/conversations.create?name=${slackChannel}`, null, {headers: {'Authorization': `Bearer ${slackbotAuthToken}`}});
  JSON.stringify({status, data})
};
