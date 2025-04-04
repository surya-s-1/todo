import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { CgProfile } from "react-icons/cg"
import { CiSquarePlus, CiLight, CiDark } from "react-icons/ci"
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5"

interface HeaderProps {
    username: string
    startNewTask: () => void
}

export default function Header({ username, startNewTask }: HeaderProps) {
    const [profileOpen, setProfileOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme")
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark")
            setDarkMode(true)
        }
    }, [])

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        } else {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        }
        setDarkMode(!darkMode)
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token'),
            localStorage.removeItem('refresh_token')
        router.push('/login')
    }

    return (
        <div className="flex flex-row items-center justify-between shadow-md py-4 sticky top-0 z-20 bg-white/50 backdrop-blur-sm dark:bg-black/50 dark:text-white/80 overflow-auto">
            <div className="flex flex-row items-center gap-4 ml-8 text-nowrap">
                <IoCheckmarkDoneCircleOutline size={48} />
                <h2>To-Do List</h2>
            </div>
            <div className="flex flex-row items-center gap-4 px-4">
                <div className="relative">
                    <button className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => startNewTask()}>
                        <CiSquarePlus size={36} />
                        <span className="hidden lg:block">New Task</span>
                    </button>
                </div>
                <div className="relative">
                    <button className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => toggleDarkMode()}>
                        <span className="block">
                            {darkMode ? <CiLight size={30} /> : <CiDark size={30} />}
                        </span>
                        <span className="hidden lg:block">{darkMode ? "Dark Mode" : "Light Mode"}</span>
                    </button>
                </div>
                <div className="relative">
                    <CgProfile
                        onClick={() => setProfileOpen(!profileOpen)}
                        size={36}
                        className="cursor-pointer"
                    />
                    {profileOpen && (
                        <div className="absolute right-0 mt-6 w-fit bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md">
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
    )
}