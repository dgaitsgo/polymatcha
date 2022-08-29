import SessionData from 'features/auth/types/SessionData'
import { Session } from 'next-auth'

interface ExtendedSession extends Session {
	data: { userData: SessionData }
}

export default ExtendedSession
