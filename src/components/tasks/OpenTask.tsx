import { useState } from 'react'
import Switch from 'react-switch'
import { FaRegCalendarAlt } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"
import { MdDone , MdDelete } from "react-icons/md"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface OpenTaskArguments {
    _id?: string
    _title: string
    _description: string
    _deadline: Date | null
    _completed: boolean
    _color_code: string
    _button_name: string
    onSubmit: (title: string, description: string, deadline: Date | null, completed: boolean, color_code: string) => void
    onDelete?: (id: string) => void
}

export default function OpenTask({ _id, _title, _description, _deadline, _completed, _color_code, _button_name, onSubmit, onDelete }: OpenTaskArguments) {
    const [title, setTitle] = useState<string>(_title)
    const [description, setDescription] = useState<string>(_description)
    const [deadline, setDeadline] = useState<Date | null>(_deadline)
    const [completed, setCompleted] = useState<boolean>(_completed)
    const [color_code, setColorCode] = useState<string>(_color_code)
    const [showCalendar, setShowCalendar] = useState<boolean>(false)

    const passedDeadline = deadline ? new Date(deadline).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) : false

    const handleDateChange = (date: Date | null) => {
        console.log('DATE:', date)
        setDeadline(date)
        setShowCalendar(false)
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-between gap-2'>
                <input
                    className='text-2xl p-2 w-2xl border-0 outline-0'
                    placeholder='Title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <div className='flex flex-row-reverse items-center gap-2 mx-1'>
                    <span className='text-sm text-gray-400'>
                        Mark Complete
                    </span>
                    <Switch
                        onChange={setCompleted}
                        checked={completed}
                        width={45}
                        height={20}
                    />
                </div>
            </div>
            <textarea
                className='p-2 border-0 outline-0 h-52 resize-none overflow-auto'
                placeholder='Enter Description...'
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <div className='flex flex-row items-center justify-between gap-2 px-4'>
                <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`custom-button ${deadline && passedDeadline && 'custom-button-alert'}`}
                >
                    <div
                        className='flex flex-row items-center gap-2 text-sm'
                    >
                        <FaRegCalendarAlt size={16} />
                        {deadline ? deadline.toDateString() : 'Deadline'}
                    </div>
                    {deadline && (
                        <span
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                setDeadline(null)
                            }}
                        >
                            <IoMdCloseCircle size={20} />
                        </span>
                    )}
                </button>
                {showCalendar && (
                    <div className="absolute z-10 mb-30 -mx-1">
                        <Calendar
                            onChange={handleDateChange}
                            value={deadline}
                            className='scale-75 mb-40 -mx-8'
                        />
                    </div>
                )}
                <button
                    className='custom-button custom-button-info'
                    onClick={() => onSubmit(title, description, deadline, completed, color_code)}
                >
                    <MdDone size={20} />
                    {_button_name}
                </button>
                {_id &&
                <button
                    onClick={() => onDelete(_id)}
                    className={`custom-button custom-button-alert`}
                >
                    <div
                        className='flex flex-row items-center gap-1 text-sm'
                    >
                        <MdDelete size={16} />
                        <span>Delete</span>
                    </div>
                </button>}
            </div>
        </div>
    )
}