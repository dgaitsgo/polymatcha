import { Session } from 'next-auth'

interface SessionData extends Session {
	name: string
	country?: string
	createdAt?: Date
	profilePic?: string
	id?: string
	emailVerified: boolean
}

export default SessionData