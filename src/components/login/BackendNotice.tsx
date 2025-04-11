import { useEffect, useState } from 'react'
import Notice, { NoticeProps } from '../Notice'

export default function BackendNotice() {
    const [notice, setNotice] = useState<NoticeProps | null>(null)

    useEffect(() => {
        let intervalId: NodeJS.Timeout

        const checkBackend = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_HEALETH_ENDPOINT}`)

                if (response.status === 200) {
                    setNotice({
                        type: 'success',
                        message: 'The backend systems are up. You can now use the platform.',
                    })

                    clearInterval(intervalId)
                } else {
                    setNotice({
                        type: 'warning',
                        message: "Please note: it might take a couple of minutes for the backend services to start if they have been inactive for a while. If login doesn't work right away, just give it a moment and try again.",
                    })
                }
            } catch (error) {
                setNotice({
                    type: 'warning',
                    message: "Please note: it might take a couple of minutes for the backend services to start if they have been inactive for a while. If login doesn't work right away, just give it a moment and try again.",
                })
            }
        }

        checkBackend()

        intervalId = setInterval(checkBackend, 5000)

        return () => clearInterval(intervalId)
    }, [])

    if (!notice) return null

    return <Notice type={notice.type} message={notice.message} />
}
