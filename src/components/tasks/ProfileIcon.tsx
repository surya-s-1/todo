import { useState } from "react"
import { CgProfile } from "react-icons/cg"

export default function ProfileIcon({ username }: { username: string}) {
    const [open, setOpen] = useState(false)

    return(
        <div className="fixed top-4 right-4 flex flex-col items-end z-0">
            <CgProfile 
                onClick={() => setOpen(!open)} 
                size={36}
                className="cursor-pointer"
            />
            {open && 
            <div className="flex flex-col bg-gray-100 mt-1 rounded-2xl shadow-md">
                <span className="px-6 py-3">Hi, {username}!</span>
                <button className="px-6 py-3 text-red-500 cursor-pointer hover:shadow-sm">Logout</button>
            </div>}
        </div>
    )
}