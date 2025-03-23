import Switch from 'react-switch'
import { FaRegCalendarAlt } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import 'react-calendar/dist/Calendar.css'
import { useRouter } from 'next/router'

interface ClosedTask {
    _id: string
    _title: string
    _description: string
    _deadline: Date | null
    _completed: boolean
    _color_code: string
    updateComplete: (id: string, complete: boolean) => void
    onDelete: (id: string) => void
}

export default function ClosedTask({ _id, _title, _description, _deadline, _completed, _color_code, updateComplete, onDelete }: ClosedTask) {
    const router = useRouter()
    const passedDeadline = _deadline ? new Date(_deadline).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) : false

    return (
        <div 
            className={`flex flex-col rounded-md p-2 w-full h-full gap-1 border border-gray-300 cursor-pointer`} style={{ backgroundColor: _color_code }}
            onClick={() => router.push(`/tasks/#${_id}`)}
        >
            <div className='flex items-center justify-between gap-2'>
                <span className='text-md p-1 w-full text-ellipsis overflow-hidden whitespace-nowrap'>
                    {_title}
                </span>
                <div onClick={e => e.stopPropagation()}>
                    <Switch
                        className='z-0'
                        onChange={(val) => updateComplete(_id, val)}
                        checked={_completed}
                        width={36}
                        height={16}
                    />
                </div>
            </div>

            <p className='text-sm text-gray-600 p-1 resize-none overflow-hidden h-30 line-clamp-5'>
                {_description}
            </p>

            <div className='flex items-center justify-between'>
                <button className={`custom-button custom-button-small ${_deadline && 'custom-button-info'} ${passedDeadline ? 'custom-button-alert' : ''}`}>
                    <div className='flex items-center gap-2 text-xs'>
                        <FaRegCalendarAlt size={12} />
                        {_deadline ? new Date(_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Deadline'}
                    </div>
                </button>
                <button
                    onClick={(e) => {
                        onDelete(_id)
                        e.stopPropagation()
                    }}
                    className="flex items-center gap-1 text-sm custom-button custom-button-alert custom-button-small"
                >
                    <MdDelete size={16} />
                </button>
            </div>
        </div>
    )
}
