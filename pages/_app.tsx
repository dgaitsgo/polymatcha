import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Toaster />
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
