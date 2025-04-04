import { useRouter } from "next/router"
import { useState } from "react"
import { CgProfile } from "react-icons/cg"
import { CiSquarePlus } from "react-icons/ci"
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5"

interface HeaderProps { 
    username: string
    startNewTask: () => void 
}

export default function Header({ username, startNewTask }: HeaderProps) {
    const [profileOpen, setProfileOpen] = useState(false)
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('access_token'),
        localStorage.removeItem('refresh_token')
        router.push('/login')
    }

    return (
        <>
            <div className="flex flex-row items-center justify-between shadow-md py-4 sticky top-0 z-20 bg-white/50 backdrop-blur-sm">
                <div className="flex flex-row items-center gap-4 ml-8">
                    <IoCheckmarkDoneCircleOutline size={48} />
                    <h2>To-Do List</h2>
                </div>
                <div className="flex flex-row items-start gap-4 px-4">
                    <div className="relative">
                        <button className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => startNewTask()}>
                            <CiSquarePlus size={36} />
                            <span className="hidden lg:block">New Task</span>
                        </button>
                    </div>
                    <div className="relative">
                        <CgProfile
                            onClick={() => setProfileOpen(!profileOpen)}
                            size={36}
                            className="cursor-pointer"
                        />
                        {profileOpen && (
                            <div className="absolute right-0 mt-6 w-fit bg-gray-100 rounded-2xl shadow-md">
                                <span className="block px-6 py-3">{username}</span>
                                <button 
                                    className="px-6 py-3 text-red-500 cursor-pointer"
                                    onClick={() => handleLogout()}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}