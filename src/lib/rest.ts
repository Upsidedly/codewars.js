import type { User, CompletedChallenges, CodeChallenge, AuthoredChallenges, AuthoredChallenge, ClanMembers, CompletedChallenge } from 'codewars-api-types/v1'

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

    private async request (path: string): Promise<unknown | undefined> {
        const result = (await fetch(`${this.url}/${path}`)).json()
        if ("success" in result && result.success === false) return
        return result
    }

    /**
     * Retireves a user, or undefined if the user does not exist
     *
     * @param user - The name of the user
     * @returns The user
     */
    public async user (user: string): Promise<User | undefined> {
        return await this.request(`/users/${user}`) as User | undefined
    }

    /**
     * Retrieves the completed challenges of a user, or undefined if the user does not exist
     *
     * @param user - The user to get the completed challenges of
     * @param page - The page number of completed challenges to get
     * @returns The completed challenges of the user
     */
    public async completedChallenges (user: string, page: number): Promise<CompletedChallenges | undefined> {
        if (!(Number.isInteger(page) && page > -1)) {
            throw new TypeError('page must a positive integer!')
        }

        return await this.request(`/users/${encodeURIComponent(user)}/code-challenges/completed?page=${page}`) as CompletedChallenges | undefined
    }

    /**
     * Retrieves every completed challenge of a user, or undefined if the user does not exist
     *
     * @param user - The user to get the completed challenges of
     * @returns Every completed challenge of the user, of each page
     */
    public async allCompletedChallenges(user: string): Promise<CompletedChallenge[] | undefined> {
        let page = 0
        const data: CompletedChallenge[] = []
        const get = async () => {
            const members = await this.request(`/users/${encodeURIComponent(user)}/code-challenges/completed?page=${page}`) as CompletedChallenges
            if (!members) return false
            data.push(...members.data)
            if (page === members.totalPages - 1) return true
            page++
            await get()
        }

        const result = await get()
        if (!result) return
        return data
    }

    /**
     * Retrieves the authored challenges of a user, or undefined if the user does not exist
     *
     * @param user - The user to get the authored challenges of
     * @returns The authored challenges of the user
     */
    public async authoredChallenges (user: string): Promise<AuthoredChallenge[] | undefined> {
        const res = await this.request(`/users/${encodeURIComponent(user)}/code-challenges/authored`) as AuthoredChallenges | undefined
        return res?.data
    }

    /**
     * Retrieves a code challenge, or undefined if it does not exist
     *
     * @param challenge - The slug or id of the challenge
     * @returns The challenge
     */
    public async codeChallenge (challenge: string): Promise<CodeChallenge | undefined> {
        return await this.request(`/code-challenges/${encodeURIComponent(challenge)}`) as CodeChallenge | undefined
    }

    /**
     * Retrieves members of a clan of a certain page, or undefined if the clan does not exist
     *
     * @param clanName - The name of the clan
     * @param page - The page number to retrieve 
     */
    public async clanMembers(clanName: string, page: number): Promise<ClanMembers | undefined> {
        if (!(Number.isInteger(page) && page > -1)) {
            throw new TypeError('page must a positive integer!')
        }

        return await this.request(`/clans/${encodeURIComponent(clanName)}/members?page=${page}`) as ClanMembers | undefined
    }

    /**
     * Retrieves every member of a clan, or undefined if the clan does not exist
     *
     * @param clanName - The name of the clan
     * @returns Every member of the clan, of each page
     */
    public async allClanMembers(clanName: string): Promise<User[] | undefined> {
        let page = 0
        const data: User[] = []
        const get = async () => {
            const members = await this.request(`/clans/${encodeURIComponent(clanName)}/members?page=${page}`) as ClanMembers
            if (!members) return false
            data.push(...members.data)
            if (page === members.totalPages - 1) return true
            page++
            await get()
        }

        const result = await get()
        if (!result) return
        return data
    }
}
