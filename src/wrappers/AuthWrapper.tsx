import { useRouter } from 'next/router'
import { useEffect, useState, createContext, useContext, ReactNode } from 'react'

export const AuthContext = createContext({ user: { username: '', id: '' } })

interface WrappedComponent {
    children: ReactNode
}

export default function AuthWrapper({ children }: WrappedComponent) {
    const router = useRouter()
    const [user, setUser] = useState({ username: '', id: '' })
    const [expirationTime, setExpirationTime] = useState(0)
    const [loading, setLoading] = useState(true)

    function checkTokens() {
        try {
            const access_token = localStorage.getItem('access_token')
            const refresh_token = localStorage.getItem('refresh_token')

            if (!access_token || !refresh_token) {
                router.push('/login')
                return
            }

            const payload = JSON.parse(atob(access_token.split('.')[1]))
            const expTime = payload.exp * 1000
            const currentTime = Date.now()

            if (expTime < currentTime) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                router.push('/login')
                return
            }

            setUser({ username: payload.username, id: payload.sub })
            setExpirationTime(expTime)
            setLoading(false)
        } catch (error) {
            console.error(error)
            router.push('/login')
        }
    }

    useEffect(() => {
        checkTokens()
    }, [])

    async function extendSession() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT || '', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
                }
            })

            if (!response.ok) {
                console.error('Failed to extend session')
                return
            }

            const result = await response.json()
            localStorage.setItem('access_token', result.access_token)
            checkTokens()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!expirationTime) return

        const buffer = 5 * 60 * 1000
        const timeToPrompt = expirationTime - Date.now() - buffer

        if (timeToPrompt < 0) return

        const timeout = setTimeout(() => {
            const shouldExtend = confirm('Do you want to extend your session?')
            if (shouldExtend) {
                extendSession()
            }
        }, timeToPrompt)

        const interval = setInterval(() => {
            const currentTime = Date.now()
            if (expirationTime < currentTime) {
                clearInterval(interval)
                router.push('/login')
            }
        }, 1000)

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [expirationTime, router])

    if (loading) {
        return <div>Loading...</div>
    }

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}
