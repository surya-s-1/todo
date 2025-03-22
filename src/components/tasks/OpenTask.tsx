import { useState } from 'react'

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
            <input
                placeholder='Enter Title...'
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <textarea
                placeholder='Enter Description...'
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <button onClick={() => onSubmit(title, description, deadline, completed, color_code)}>{_button_name}</button>
        </div>
    )
}