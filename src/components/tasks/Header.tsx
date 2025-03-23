import { useRouter } from "next/router";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";

export default function Header({ username }: { username: string }) {
    const [profileOpen, setProfileOpen] = useState(false)
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('access_token'),
        localStorage.removeItem('refresh_token')
        router.push('/login')
    }

    return (
        <>
            <div className="flex flex-row items-baseline justify-between py-2">
                <h2 className="ml-8">Hello, {username}!</h2>
                <div className="flex flex-row items-start gap-4 px-4">
                    <div className="relative">
                        <CgProfile
                            onClick={() => setProfileOpen(!profileOpen)}
                            size={36}
                            className="cursor-pointer"
                        />
                        {profileOpen && (
                            <div className="absolute right-0 mt-4 w-fit bg-gray-100 rounded-2xl shadow-md">
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