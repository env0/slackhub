const mapping: Record<string, { name:string, image:string }> = {
    'roni-frantchi': {
        name: 'Roni',
        image:'https://ca.slack-edge.com/TD88A7L00-UH9MDL99V-1fc129c19064-512'
    },
    'yanai': {
        name: 'yanai',
        image: 'https://ca.slack-edge.com/T02A1ARR8-U0KCQB7C0-224f07fed054-512'
    }
}

export const getSlackUser = (githubUser: string) => mapping[githubUser];
