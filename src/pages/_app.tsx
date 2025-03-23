import AuthWrapper from "@/components/wrappers/AuthWrapper";
import NotificationWrapper from "@/components/wrappers/NotificationWrapper";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps, router }: AppProps) {
	const publicRoutes = ['/login', '/register']
	const isProtectedRoute = !publicRoutes.includes(router.pathname)

	return (
		<>
			<Head>
				<title>To-Do List</title>
				<meta name="description" content="An app to list your tasks to be done" />
			</Head>
			{isProtectedRoute ? (
				<AuthWrapper>
					<NotificationWrapper>
						<Component {...pageProps} />
					</NotificationWrapper>
				</AuthWrapper>
			) : (
				<Component {...pageProps} />
			)}
		</>
	)
}
