const mapping: Record<string, string> = {
    'RLRabinowitz': 'Arel Rabinowitz',
    'roni-frantchi': 'Roni',
    'yanai': 'yanai'
}

export const getSlackUser = (githubUser: string) => mapping[githubUser];
