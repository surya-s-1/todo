import { useState } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoMdCloseCircle } from 'react-icons/io'
import { MdDone, MdDelete } from 'react-icons/md'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { COLORS, formatDeadline } from '../utility'
import Checkbox from './Checkbox'
import { ExistingTask, NewTask } from './types'

interface OpenTaskArguments {
    task: NewTask | ExistingTask
    button_name: string
    onSubmit: (title: string, description: string, deadline: Date | null, completed: boolean, color_code: string) => void
    onDelete?: (id: string) => void
}

export default function OpenTask({ task, button_name, onSubmit, onDelete }: OpenTaskArguments) {
    const [title, setTitle] = useState<string>(task.title)
    const [description, setDescription] = useState<string>(task.description || '')
    const [deadline, setDeadline] = useState<Date | null>(task.deadline)
    const [completed, setCompleted] = useState<boolean>(task.completed)
    const [color_code, setColorCode] = useState<string>(task.color_code || '#FFFFFF')
    const [showCalendar, setShowCalendar] = useState<boolean>(false)
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)

    const deadlineOver = deadline ? new Date(deadline) < new Date() : false

    const handleDateChange = (date: Date | null) => {
        setDeadline(date)
        setShowCalendar(false)
    }

    return (
        <div className={`flex flex-col rounded-xl p-2 w-full h-full`} style={{ backgroundColor: color_code }}>
            <div className='flex flex-row items-center justify-between gap-2'>
                <input
                    className='text-2xl p-2 w-2xl border-0 outline-0'
                    placeholder='Title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                {task.id && <Checkbox
                    checked={completed}
                    onChange={(e: boolean) => setCompleted(e)}
                    label='Mark Completed'
                    size='normal'
                />}
            </div>
            <textarea
                className='p-2 border-0 outline-0 h-full resize-none overflow-auto'
                placeholder='Enter Description...'
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <div className='flex flex-row items-center justify-between gap-2 px-2'>
                <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`custom-button ${deadline ? (deadlineOver ? 'custom-button-alert' : 'custom-button-info') : ''} ${completed && 'custom-button-success'}`}
                >
                    <FaRegCalendarAlt size={16} />
                    {formatDeadline(deadline)}
                    {deadline && (
                        <span
                            className='cursor-pointer'
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
                    <div className='absolute z-10 mb-30 -mx-1'>
                        <Calendar
                            onChange={e => handleDateChange(e ? new Date(e.toString()) : null)}
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
                    {button_name}
                </button>
                {task.id &&
                <div className='flex flex-row items-center gap-5'>
                    <div className='flex flex-row relative items-center'>
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className='w-6 h-6 rounded-full border border-black shadow-2xl cursor-pointer'
                            style={{ backgroundColor: color_code }}
                        >
                        </button>
                        {showColorPicker && (
                            <div className='absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white shadow-lg rounded-lg'>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className='w-6 h-6 rounded-full border-1 border-gray-300 cursor-pointer'
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            setColorCode(color)
                                            setShowColorPicker(false)
                                        }}
                                    ></button>
                                ))}
                            </div>)}
                    </div>
                    <button
                        onClick={() => onDelete?.(task.id || '')}
                        className={`flex flex-row items-center gap-1 text-sm custom-button custom-button-alert`}
                    >
                        <MdDelete size={16} />
                        <span>Delete</span>
                    </button>
                </div>}
            </div>
            {task.created_at && 
            <span
                className='text-xs text-gray-700 opacity-50 mt-2 mx-2'
            >
                Created on {new Date(task.created_at).toDateString()}
            </span>}
        </div>
    )
}