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
            setTimeout(() => setVisible(true), 100) // Small delay to allow transition
        } else {
            setVisible(false);
            setTimeout(() => setShow(false), 200) // Wait for transition before unmounting
        }
    }, [isOpen])

    if (!show) return null

    return (
        <div
            onClick={() => onClose()}
            className={`fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                onClick={e => e.stopPropagation()}
                className={`bg-white h-fit w-fit p-2 rounded-xl shadow-md transform transition-transform duration-200 ${visible ? 'scale-100' : 'scale-95'}`}
            >
                {children}
            </div>
        </div>
    )
}