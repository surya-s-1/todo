import { useRouter } from 'next/router'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import 'react-calendar/dist/Calendar.css'
import Checkbox from './Checkbox'
import { ExistingTask } from './types'
import { formatDeadline } from '../utility'

interface ClosedTask {
    task: ExistingTask
    updateComplete: (id: string, complete: boolean) => void
    onDelete: (id: string) => void
}

export default function ClosedTask({ task, updateComplete, onDelete }: ClosedTask) {
    const router = useRouter()
    const deadlineOver = task.deadline ? new Date(task.deadline) < new Date() : false

    return (
        <div 
            className={`flex flex-col rounded-md p-2 w-full h-full gap-1 border border-gray-300 cursor-pointer`} style={{ backgroundColor: task.color_code || '#FFFFFF' }}
            onClick={() => router.push(`/tasks/#${task.id}`)}
        >
            <div className='flex items-center justify-between gap-2'>
                <span className='text-lg font-semibold p-1 w-full text-ellipsis overflow-hidden whitespace-nowrap'>
                    {task.title}
                </span>
                <div title='Mark Completed' onClick={e => e.stopPropagation()}>
                    <Checkbox 
                        checked={task.completed} 
                        onChange={(e: boolean) => updateComplete(task.id, e)}
                        size='small'
                    />
                </div>
            </div>

            <p className='text-sm text-gray-600 p-1 resize-none overflow-hidden h-30 line-clamp-5'>
                {task.description}
            </p>

            <div className='flex items-center justify-between'>
                <button className={`custom-button custom-button-small ${task.deadline ? (deadlineOver ? 'custom-button-alert': 'custom-button-info'): ''} ${task.completed && 'custom-button-success'}`}>
                    <FaRegCalendarAlt size={12} />
                    {formatDeadline(task.deadline, 'short')}
                </button>
                <button
                    onClick={(e) => {
                        onDelete(task.id)
                        e.stopPropagation()
                    }}
                    className='custom-button custom-button-alert custom-button-small'
                >
                    <MdDelete size={16} />
                </button>
            </div>
        </div>
    )
}
