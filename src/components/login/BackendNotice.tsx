import { useEffect, useState } from 'react'
import Notice, { NoticeProps } from '../Notice'

const successNotice: NoticeProps = {
    type: 'success',
    message: 'The backend systems are up. You can now use the platform.'
}

const warningNotice: NoticeProps = {
    type: 'warning',
    message: "It might take a couple of minutes for the backend services to start if they have been inactive for a while. If login doesn't work right away, just give it a moment and try again."
}

const errorNotice: NoticeProps = {
    type: 'error',
    message: 'The backend systems are not reachable. Please try again later or contact the owner of this site.'
}

export default function BackendNotice() {
    const [notice, setNotice] = useState<NoticeProps | null>(null)

    useEffect(() => {
        let intervalId: NodeJS.Timeout

        const checkBackend = async () => {
            let didTimeout = false
        
            const fallbackTimeout = setTimeout(() => {
                didTimeout = true
                setNotice(warningNotice)
            }, 2000)
        
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_HEALETH_ENDPOINT}`)
        
                clearTimeout(fallbackTimeout)
        
                if (response.status === 200) {
                    setNotice(successNotice)
                    clearInterval(intervalId)
                } else {
                    setNotice(errorNotice)
                }
            } catch (error) {
                clearTimeout(fallbackTimeout)
                setNotice(errorNotice)
            }
        }

        checkBackend()

        intervalId = setInterval(checkBackend, 5000)

        return () => clearInterval(intervalId)
    }, [])

    if (!notice) return null

    return <Notice type={notice.type} message={notice.message} />
}
