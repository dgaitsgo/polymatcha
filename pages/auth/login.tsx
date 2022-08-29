import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoginLayout from "features/auth/layouts/Login"

interface LoginProps {
	csrfToken: string
}

function Login({ csrfToken }: LoginProps) {

	const { status } = useSession()

	const router = useRouter()
	const { error } = router.query

	if (status === 'authenticated') {
		router.push('/')
	}

	const onSignInSuccess = () => {
		router.push('/')
	}

	return (
		<LoginLayout
			onSignInSuccess={onSignInSuccess}
			error={error}
			csrfToken={csrfToken} />
	)
}

export default Login