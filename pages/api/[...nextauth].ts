import bcrypt from 'bcrypt'
import type EmailCredentials from 'features/auth/types/EmailCredentials'
import type ExtendedSession from 'features/auth/types/ExtendedSession'
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from 'modules/prisma'
import { JWT } from 'next-auth/jwt'

const createOptions = (req: any) => ({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: {
					label: 'Username',
					type: 'text',
					placeholder: 'username',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},

			// @ts-ignore
			async authorize(credentials: EmailCredentials) {
				try {
					const user = await prisma.account.findUnique({
						where: {
							email: credentials.email,
						},
					})

					if (user && user.password) {
						const result = await new Promise((resolve, reject) => {
							bcrypt.compare(
								credentials.password,
								// @ts-ignore
								user.password,
								function (err: any, result: any) {
									if (err) {
										reject(err)
									}
									resolve(result)
								}
							)
						})

						if (result) {
							return {
								id: true,
								name: true,
								country: true,
								createdAt: true,
								profilePic: true,
								emailVerified: true,
							}
						}
					}
				} catch (error) {
					console.error(error)
					return { error }
				}
			},
		}),
	],
	callbacks: {
		async jwt(value: any) {
			const { token, user } = value
			const { id, update } = req.query

			if (update && id) {
				const user = await prisma.account.findUnique({
					where: { id },
					select: {
						id: true,
						name: true,
						country: true,
						createdAt: true,
						profilePic: true,
					},
				})
				if (user) {
					token.id = id
					token.user = user
					return token
				}
			}

			if (user) {
				token.id = user.id
				token.user = user
			}
			return token
		},
		async session({
			session,
			token,
		}: {
			session: Session
			user: User
			token: JWT
		}) {
			if (token) {
				//@ts-ignore
				session = { ...token.user, accessToken: token.id }
			}
			return session as ExtendedSession
		},
	},
	secret: 'test',
	jwt: {
		secret: 'test',
		encryption: true,
	},
	pages: {
		signIn: '/login',
	},
})

// @ts-ignore
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
	return NextAuth(req, res, createOptions(req) as NextAuthOptions)
}
