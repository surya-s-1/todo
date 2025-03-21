import React, { useState } from 'react'

const LoginPage = () => {
    React.useEffect(() => {
        document.title = 'Register | To-Do App'
    }, [])

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Username:', username)
        console.log('Password:', password)
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div>
                <h2 className='text-2xl mb-4'>Register</h2>
                <form onSubmit={handleSubmit} className='flex flex-col items-start gap-4'>
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
                        Register Now
                    </button>
                    <span className='text-sm'>
                        Already have an account? <a href='/login' className='text-blue-500'>Login</a>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default LoginPage