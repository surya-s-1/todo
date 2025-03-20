import AuthWrapper from "@/components/AuthWrapper";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps, router }: AppProps) {
	const publicRoutes = ['/login', '/register']
	const isProtectedRoute = !publicRoutes.includes(router.pathname)

	return (
		<>
			<Head>
				<title>To-Do App</title>
				<meta name="description" content="An app to list your tasks to be done" />
			</Head>
			{isProtectedRoute ? (
				<AuthWrapper>
					<Component {...pageProps} />
				</AuthWrapper>
			) : (
				<Component {...pageProps} />
			)}
		</>
	)
}
