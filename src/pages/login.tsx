import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

const LoginPage = () => {
    useEffect(() => {
        document.title = 'Login | To-Do App'
    }, [])

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()

            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/login` || '', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            if (!response.ok) {
                console.error('Failed to login', response)
                const result = await response.json()
                setMessage(result?.message || 'Failed to login')
                return
            }
            
            const result = await response.json()

            localStorage.setItem('access_token', result.access_token)
            localStorage.setItem('refresh_token', result.refresh_token)
            router.push('/tasks')

        } catch (error) {
            console.error('Failed to login', error)
            setMessage('Failed to login')
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div>
                <h2 className='text-2xl mb-2'>Login</h2>
                <span className='text-red-500'>{message}</span>
                <form onSubmit={handleSubmit} className='flex flex-col items-start gap-4 mt-2'>
                    <input
                        type='input'
                        value={username}
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className='m-0 p-2 border border-gray-300 rounded'
                    />
                    <input
                        type='password'
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='m-0 p-2 border border-gray-300 rounded'
                    />
                    <button type='submit' className='m-0 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer'>
                        Submit
                    </button>
                    <span className='text-sm'>
                        Don't have an account? <a href='/register' className='text-blue-500'>Register</a>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default LoginPage