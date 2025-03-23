import { useNotifications } from '../wrappers/NotificationWrapper'
import OpenTask from './OpenTask'

export default function NewTask() {
    const { setNotification } = useNotifications()

    async function createTask(title: string, description: string, deadline: Date | null, completed: boolean, color_code: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ title, description, deadline, completed, color_code })
        })

        if (response.ok) {
            const result = await response.text()
            setNotification('success', "Created the task successfully", 3)
            console.log(result)
        } else {
            const result = await response.json()

            if (result?.statusCode === 400) {
                setNotification('error', result?.message?.[0], 3)
            } else {
                setNotification('error', 'Unable to create the task', 3)
            }
        }
    }

    return (
        <OpenTask
            _title={''}
            _description={''}
            _deadline={null}
            _color_code={'#FFFFFF'}
            _completed={false}
            _button_name='Create'
            onSubmit={createTask}
        />
    )
}