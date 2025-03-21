import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Custom404() {
    const redirectTimeout = 3
    const router = useRouter()
    const [counter, setCounter] = useState(redirectTimeout)

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prevCounter) => prevCounter - 1)
        }, 1000)

        const timeout = setTimeout(() => {
            router.push("/tasks")
        }, redirectTimeout * 1000)

        return () => {
            clearInterval(timer)
            clearTimeout(timeout)
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">404</h1>
            <p className="text-lg text-gray-600">
                Oops! Page not found. Redirecting to <a href='/tasks' className='text-blue-600'>home</a> in {counter} seconds...
            </p>
        </div>
    )
}