import type { User, CompletedChallenges, CodeChallenge, AuthoredChallenges, AuthoredChallenge, ClanMembers } from 'codewars-api-types/v1'

export type APIVersion = 1
export interface RESTOptions {
    /**
     * @defaultValue `'https://www.codewars.com/api'`
     */
    api?: string,
    /**
     * @defaultValue `1`
     */
    version?: APIVersion
}
export class REST {
    public readonly version: APIVersion

    public readonly api: string

    public readonly url: string

    public constructor (opts: RESTOptions) {
        [this.version, this.api] = [
            opts.version ?? 1,
            opts.api ?? 'https://www.codewars.com/api'
        ]
        this.url = `${this.api}/v${this.version}`
    }

    private async request (path: string): Promise<unknown> {
        return (await fetch(`${this.url}/${path}`)).json()
    }

    public async user (user: string): Promise<User> {
        return (await this.request(`/users/${user}`)) as User
    }

    public async completedChallenges (user: string, page: number): Promise<CompletedChallenges> {
        if (!(Number.isInteger(page) && page > -1)) {
            throw new TypeError('page must a positive integer!')
        }

        return (await this.request(`/users/${encodeURIComponent(user)}/code-challenges/completed?page=${page}`)) as CompletedChallenges
    }

    public async authoredChallenges (user: string): Promise<AuthoredChallenge[]> {
        return ((await this.request(`/users/${encodeURIComponent(user)}/code-challenges/authored`)) as AuthoredChallenges).data
    }

    public async codeChallenge (challenge: string): Promise<CodeChallenge> {
        return (await this.request(`/code-challenges/${encodeURIComponent(challenge)}`)) as CodeChallenge
    }

    /**
     * Retrieves members of a clan of a certain page
     *
     * @param clanName - The name of the clan
     * @param page - The page number to retrieve 
     */
    public async clanMembers(clanName: string, page: number): Promise<ClanMembers> {
        if (!(Number.isInteger(page) && page > -1)) {
            throw new TypeError('page must a positive integer!')
        }

        return (await this.request(`/clans/${encodeURIComponent(clanName)}/members?page=${page}`)) as ClanMembers
    }

    /**
     * Retrieves every member of a clan
     *
     * @param clanName - The name of the clan
     * @returns Every member of the clan, of each page
     */
    public async clanMembersAll(clanName: string): Promise<User[]> {
        let page = 0
        const data: User[] = []
        const get = async () => {
            const members = (await this.request(`/clans/${encodeURIComponent(clanName)}/members?page=${page}`)) as ClanMembers
            data.push(...members.data)
            if (page === members.totalPages - 1) return
            page++
            await get()
        }

        return data
    }
}
