export const pullRequestToChannelName = (pullRequest: any) => {
  return `pr-${pullRequest.number}`;
}