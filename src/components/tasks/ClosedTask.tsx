import { useState } from 'react'
import Switch from 'react-switch'
import { FaRegCalendarAlt } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import 'react-calendar/dist/Calendar.css'

interface ClosedTask {
    _id: string
    _title: string
    _description: string
    _deadline: Date | null
    _completed: boolean
    _color_code: string
    onDelete: (id: string) => void
}

export default function ClosedTask({ _id, _title, _description, _deadline, _completed, _color_code, onDelete }: ClosedTask) {
    const [completed, setCompleted] = useState<boolean>(_completed)
    const [deadline, setDeadline] = useState<Date | null>(_deadline ? new Date(_deadline) : null)

    const passedDeadline = deadline ? new Date(deadline).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) : false

    return (
        <div className={`flex flex-col rounded-md p-2 w-48 h-48 border border-gray-300`} style={{ backgroundColor: _color_code }}>
            {/* Title & Switch */}
            <div className='flex items-center justify-between gap-2'>
                <span className='text-md p-1 w-full border-0 outline-0 bg-transparent text-ellipsis overflow-hidden whitespace-nowrap'>
                    {_title}
                </span>
                <div className="shrink-0">
                    <Switch
                        onChange={setCompleted}
                        checked={completed}
                        width={36}
                        height={16}
                    />
                </div>
            </div>

            {/* Description */}
            <p className='text-xs p-1 border-0 outline-0 h-24 resize-none overflow-hidden bg-transparent line-clamp-3'>
                {_description}
            </p>

            {/* Bottom Buttons */}
            <div className='flex items-center justify-between gap-2 px-2'>
                {deadline && (
                    <button className={`custom-button ${passedDeadline ? 'custom-button-alert' : ''}`}>
                        <div className='flex items-center gap-2 text-xs'>
                            <FaRegCalendarAlt size={12} />
                            {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <span
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                setDeadline(null)
                            }}
                        >
                            <IoMdCloseCircle size={16} />
                        </span>
                    </button>
                )}
                <button
                    onClick={() => onDelete(_id)}
                    className="flex items-center gap-1 text-sm custom-button custom-button-alert"
                >
                    <MdDelete size={16} />
                </button>
            </div>
        </div>
    )
}
