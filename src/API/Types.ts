export interface CSHUser {
    cn: string,
    uid: string
}

export const formatUser = (u: CSHUser) => `${u.cn} (${u.uid})`;

export interface QuoteShard {
    body: string,
    speaker: CSHUser,
}

export interface Quote {
    id: number,
    shards: QuoteShard[],
    submitter: CSHUser,
    timestamp: Date,
}
