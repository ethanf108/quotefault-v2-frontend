export interface CSHUser {
    cn: string,
    uid: string
}

export const formatUser = (u: CSHUser) => `${u.cn} (${u.uid})`;

export interface QuoteShard {
    body: string,
    speaker: CSHUser,
}

export type Vote = "upvote" | "downvote" | null;

export interface Quote {
    id: number,
    shards: QuoteShard[],
    submitter: CSHUser,
    timestamp: Date,
    score: number,
    vote: Vote,
    hidden: boolean | null,
}

export interface Report {
    quote_id: number,
    reports: [{
        reason: string,
        timestamp: Date,
    }]
}

export interface GitData {
    revision: string,
    url: string,
}
