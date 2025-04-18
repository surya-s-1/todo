import React, { useEffect, useState } from 'react'

interface ModalArguments {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalArguments) {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            setTimeout(() => setVisible(true), 100)
        } else {
            setVisible(false);
            setTimeout(() => setShow(false), 200)
        }
    }, [isOpen])

    if (!show) return null

    return (
        <div
            onClick={() => {
                setVisible(false);
                setTimeout(() => onClose(), 200)
            }}
            className={`fixed z-20 inset-0 w-full h-full max-w-screen max-h-screen bg-black/50 flex items-center justify-center transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                onClick={e => e.stopPropagation()}
                className={`min-w-fit min-h-fit w-full sm:w-7/12 h-fit max-w-screen max-h-screen p-0 rounded-xl transform transition-transform duration-200 ${visible ? 'scale-100' : 'scale-95'} flex items-center justify-center`}
            >
                {children}
            </div>
        </div>
    )
}