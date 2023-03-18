import { REST } from './rest.js'
import { expect } from 'chai'
import { z } from 'zod'

export const rankObjectSchema = z.object({
    name: z.string(),
    color: z.string(),
    score: z.number()
})

export const ranksSchema = z.object({
    overall: rankObjectSchema,
    languages: z.any()
})

export const completedChallengeSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    completedAt: z.string(),
    completedLanguages: z.string()
})

export const authoredChallengeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    rank: z.number().optional(),
    rankName: z.string().optional(),
    tags: z.array(z.string()),
    languages: z.string()
})

export const userIdentifierSchema = z.object({
    username: z.string(),
    url: z.any()
})

export const userSchema = z.object({
    username: z.string(),
    name: z.string(),
    honor: z.number(),
    clan: z.string(),
    leaderboardPosition: z.number(),
    skills: z.array(z.string()),
    ranks: ranksSchema,
    codeChallenges: z.object({
        totalAuthored: z.number(),
        totalCompleted: z.number()
    })
})

export const completedChallengesSchema = z.object({
    totalPages: z.number(),
    totalItems: z.number(),
    data: z.array(completedChallengeSchema)
})

export const authoredChallengesSchema = z.object({
    data: z.array(authoredChallengeSchema)
})

export const codeChallengeSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    url: z.any(),
    category: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    languages: z.array(z.string()),
    rank: z.object({
        id: z.number(),
        name: z.string(),
        color: z.string()
    }),
    createdBy: userIdentifierSchema,
    publishedAt: z.string(),
    approvedBy: userIdentifierSchema.optional(),
    approvedAt: z.string(),
    totalCompleted: z.number(),
    totalAttempts: z.number(),
    totalStars: z.number(),
    voteScore: z.number(),
    contributorsWanted: z.boolean(),
    unresolved: z.object({
        issues: z.number(),
        suggestions: z.number()
    })
})

describe('REST v1', () => {
    const rest = new REST({ version: 1 })

    describe('user', () => {
        it('should match zod schema validation of a user JSON', async () => {
            expect(userSchema.safeParse(await rest.user('Upsided')).success).to.be.equal(true)
        })
    })

    describe('completedChallenges', () => {
        it('should match zod schema validation of a completed Challenges JSON', async () => {
            expect(completedChallengesSchema.safeParse(await rest.completedChallenges('Upsided', 1)).success).to.be.equal(true)
        })
    })

    describe('authoredChallenges', () => {
        it('should match zod schema validation of a authored Challenges JSON', async () => {
            expect(authoredChallengesSchema.safeParse(await rest.authoredChallenges('Upsided')).success).to.be.equal(true)
        })
    })

    describe('codeChallenge', () => {
        it('should match zod schema validation of a code Challenge JSON', async () => {
            expect(codeChallengeSchema.safeParse(await rest.codeChallenge('binary-addition')).success).to.be.equal(true)
        })
    })
})
