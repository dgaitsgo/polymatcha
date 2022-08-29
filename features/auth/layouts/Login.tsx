import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Loader from 'components/Loader'
import { useState } from 'react'

interface LoginProps {
	csrfToken: string,
	error: string | string[] | undefined
	onSignInSuccess: Function
}

function Login({ csrfToken, error, onSignInSuccess }: LoginProps) {
	const [loading, setLoading] = useState(false)
	const [view, setView] = useState('login')

	async function onSubmit(form: any) {

		setLoading(true)

		try {

			const signedInRes = await signIn('credentials', {
				email: form.email,
				password: form.password,
				redirect: false,
			}) as any

			if (!signedInRes?.ok) {
				throw `That combination of email and password did not work.`
			} else {
				setLoading(false)
				onSignInSuccess()
			}

		} catch (error) {
			console.error(error)
			toast.error(typeof (error) === 'string' ? error : 'Could not log you in at this time')
			setLoading(false)
		}
	}

	const onClickSignUp = () => {

	}

	function LoginForm() {
		const { register, handleSubmit, formState: { errors } } = useForm()
		const onClickForgotPassword = () => setView('forgotpassword')

		return (
			<div>
				<span>Don&apos;t have an account yet?&nbsp;<a onClick={onClickSignUp}>Sign Up</a></span>
				<form onSubmit={handleSubmit(onSubmit)}>
					<label>
						Email
					</label>
					<input type="text" placeholder="Email" {...register("Email", { required: true, pattern: /^\S+@\S+$/i })} />
					<label>
						Password
					</label>
					<input type="password" placeholder="Password" {...register("Password", { required: true })} />
					<input type="submit" value="Sign In" />
				</form>
				<a onClick={onClickForgotPassword as React.MouseEventHandler}>Forgot your password?</a>
			</div>
		)
	}

	function ForgotPasswordForm() {

		const { register, handleSubmit, formState: { errors } } = useForm();

		return (
			<div>
				<h1>Reset Password</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<input type="text" placeholder="Email" {...register("Email", { required: true, pattern: /^\S+@\S+$/i })} />
					<input type="submit" value="Reset Password" />
				</form>
				<a onClick={() => setView('login')}>Sign in</a>
			</div>
		)
	}

	return (
		<div>
			{loading && <Loader />}
			{view === 'login'
				? <LoginForm />
				: view === 'forgotpassword'
					? <ForgotPasswordForm />
					: null
			}
		</div>
	)
}

export default Login