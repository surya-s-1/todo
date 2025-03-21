import { createContext, useContext, ReactNode, useState } from "react"

interface WrappedComponent {
    children: ReactNode
}

type NotificationType = 'success' | 'warning' | 'error' | 'info'

interface Alert {
    id: number,
    type: NotificationType,
    message: string
}

type NotificationContextType = {
    setNotification: (type: NotificationType, message: string, timeout: number) => void
}

const NotificationContext = createContext<NotificationContextType>({ setNotification: () => {}})

export const useNotifications = () => {
    return useContext(NotificationContext)
}

export default function NotificationWrapper({ children }: WrappedComponent) {
    const [notifications, setNotifications] = useState(Array<Alert>)

    const setNotification = (type: NotificationType, message: string, timeout: number) => {
        const id = Date.now()

        setNotifications((prev) => (prev.some(el => el.message === message) ? prev : [...prev, { id, type, message }]))

        setTimeout(()=>{
            setNotifications((prev) => (prev.filter(obj => obj.id !== id)))
        }, timeout * 1000)
    }

    return(
        <NotificationContext.Provider value={{setNotification}}>
            <div className="fixed top-0 right-0 z-20">
                {notifications.map((el) => {
                    return(
                        <div
                            key={el.id}
                            className={ 
                                `${el.type === 'error' ? 'bg-red-200 text-red-500' :
                                el.type === 'warning' ? 'bg-amber-200 text-amber-500' :
                                el.type === 'success' ? 'bg-green-200 text-green-500' :
                                'bg-blue-200 text-blue-500'} m-2 p-4 rounded shadow-md w-fit animate-notification`
                            }
                        >
                            {el.message}
                        </div>
                    )
                })}
            </div>
            {children}
        </NotificationContext.Provider>
    )
}