interface CheckboxAttributes {
    checked: boolean
    onChange: (e: boolean) => void
    label?: string
    size?: 'small' | 'normal'
}

export default function Checkbox({ checked, onChange, label, size = 'normal' }: CheckboxAttributes) {
    return (
        <div className="flex items-center w-fit">
            <input 
                type="checkbox"
                id="green-checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className={`accent-green-600 ${size === 'normal' ? 'w-6 h-6' : 'w-5 h-5'}`}
            />
            {label &&
            <label
                htmlFor="green-checkbox"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
                {label}
            </label>}
        </div>
    )
}  