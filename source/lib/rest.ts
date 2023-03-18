import { request } from 'undici'
import type { User, CompletedChallenges, CodeChallenge, AuthoredChallenges } from 'codewars-api-types/v1'

export type APIVersion = 1
export interface RESTOptions {
    /**
     * @defaultValue `1`
     */
    version?: APIVersion
    /**
     * @defaultValue `'https://www.codewars.com/api'`
     */
    api?: string
}
export class REST {
    public readonly version: APIVersion
    public readonly api: string
    public readonly url: string

    constructor (opts: RESTOptions) {
        [this.version, this.api] = [
            opts.version ?? 1,
            opts.api ?? 'https://www.codewars.com/api'
        ]
        this.url = `${this.api}/v${this.version}`
    }

    private async request (path: string): Promise<unknown> {
        return (await (await request(`${this.url}/${path}`)).body.json())
    }

    public async user (user: string): Promise<User> {
        return (await this.request(`/users/${user}`)) as User
    }

    public async completedChallenges (user: string, page: number): Promise<CompletedChallenges> {
        if (!Number.isInteger(page)) {
            throw new TypeError('page must an integer!')
        }

        return (await this.request(`/users/${user}/code-challenges/completed?page=${page}`)) as CompletedChallenges
    }

    public async authoredChallenges (user: string): Promise<AuthoredChallenges> {
        return (await this.request(`/users/${user}/code-challenges/authored`)) as AuthoredChallenges
    }

    public async codeChallenge (challenge: string): Promise<CodeChallenge> {
        return (await this.request(`/code-challenges/${challenge}`)) as CodeChallenge
    }
}
