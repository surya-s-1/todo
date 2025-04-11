import { AiOutlineInfoCircle, AiOutlineWarning, AiOutlineCloseCircle } from 'react-icons/ai'
import { GrStatusGood } from 'react-icons/gr'

export interface NoticeProps {
    type: 'info' | 'warning' | 'success' | 'error';
    message: string;
}

const iconMap = {
    info: <AiOutlineInfoCircle className="text-blue-500 text-xl shrink-0" />,
    warning: <AiOutlineWarning className="text-yellow-500 text-xl shrink-0" />,
    error: <AiOutlineCloseCircle className="text-red-500 text-xl shrink-0" />,
    success: <GrStatusGood className="text-green-500 text-xl shrink-0" />,
};

const bgMap = {
    info: 'bg-blue-50 border-blue-300',
    warning: 'bg-yellow-50 border-yellow-300',
    error: 'bg-red-50 border-red-300',
    success: 'bg-green-50 border-green-300',
};

const textMap = {
    info: 'text-blue-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
    success: 'text-green-800',
};

export default function Notice({ type, message }: NoticeProps) {
    const icon = iconMap[type]
    const bg = bgMap[type]
    const text = textMap[type]

    return (
        <div className={`flex items-start gap-3 p-4 border rounded-lg ${bg}`}>
            <div className="pt-0.5">{icon}</div>
            <p className={`text-sm ${text}`}>
                {message}
            </p>
        </div>
    )
}