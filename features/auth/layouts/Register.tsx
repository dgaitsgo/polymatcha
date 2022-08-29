import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
// import { PasswordInput } from 'components/InputPassword'

// validation
// [ ] password strength
// [ ] password is not same as email

function Register() {

	const [formHelp, setFormHelp] = useState('')
	const [passwordHelp, setPasswordHelp] = useState(false)
	const [passwordStrength, setPasswordStrength] = useState(undefined)
	const [loading, setLoading] = useState(false)

	function updatePasswordStrength(e: any) {
		setPasswordStrength(e.score)
		if (e.score > 2) {
			setPasswordHelp(false)
		}
	}

	function onSubmit(formData: any) {
		setLoading(true)
		if (passwordStrength !== undefined && passwordStrength < 3) {
			setPasswordHelp(true)
			setLoading(false)
		} else {
			fetch('/auth/register', formData)
				.then((res) => {
					if (res.ok) {
						signIn('credentials', {
							email: formData.email,
							password: formData.password,
							callbackUrl: '/'
						})
					} else {
						res.json().then(body => {
							setFormHelp(JSON.stringify(body.error))
							setLoading(false)
						})
					}
				})
				.catch(e => {
					setLoading(false)
					toast.error(e.response.data.error)
				})
		}
	}

	const { register, handleSubmit, formState: { errors } } = useForm();

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<label>Email</label>
			<input type="text" placeholder="Email" {...register("Email", { required: true, pattern: /^\S+@\S+$/i })} />
			<label>Password</label>
			<input type="password" placeholder="Password" {...register("Password", {})} />
			<span>Do you accept the Terms and Conditions?</span>
			<input type="checkbox" placeholder="Do you accept the Terms and Conditions?" {...register("Do you accept the Terms and Conditions?", {})} />
			<input type="submit" value="Sign Up" />
		</form>
		// <Form.Item
		// 	label='Password'
		// 	name='password'
		// 	rules={[{ required: true, message: 'Please choose a password!' }, () => ({
		// 		validator() {
		// 			if (passwordStrength != undefined && passwordStrength < 3) {
		// 				return Promise.reject(new Error('Please choose a more secure password'))
		// 			}
		// 			return Promise.resolve()
		// 		},
		// 	}),
		// 	]}>
		// 	<PasswordInput onChange={updatePasswordStrength} />
		// </Form.Item>
	)
}

export default Register