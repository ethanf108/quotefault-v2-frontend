export interface CSHUser {
    cn: string,
    uid: string
}

export interface QuoteShard {
    body: string,
    speaker: string,
}

export interface Quote {
    id: number,
    shards: QuoteShard[],
    submitter: string,
    timestamp: Date,
}
