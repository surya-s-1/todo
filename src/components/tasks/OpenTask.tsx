import { useState } from 'react'
import Switch from 'react-switch'

interface OpenTaskArguments {
    _title: string;
    _description: string;
    _deadline: Date | null;
    _completed: boolean;
    _color_code: string;
    _button_name: string,
    onSubmit: (title: string, description: string, deadline: Date | null, completed: boolean, color_code: string) => void;
}

export default function OpenTask({ _title, _description, _deadline, _completed, _color_code, _button_name, onSubmit }: OpenTaskArguments) {
    const [title, setTitle] = useState<string>(_title)
    const [description, setDescription] = useState<string>(_description)
    const [deadline, setDeadline] = useState<Date | null>(_deadline)
    const [completed, setCompleted] = useState<boolean>(_completed)
    const [color_code, setColorCode] = useState<string>(_color_code)

    return(
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
            <div className='flex flex-row items-center justify-evenly gap-2'>
                <button
                    onClick={() => onSubmit(title, description, deadline, completed, color_code)}
                >
                    {_button_name}
                </button>
            </div>
        </div>
    )
}