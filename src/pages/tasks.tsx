import { useAuth } from "@/components/AuthWrapper";

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      Hello {user ? user.username : "Guest"}!
    </div>
  )
}
