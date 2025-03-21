import Header from "@/components/tasks/Header";
import { useAuth } from "@/components/wrappers/AuthWrapper";
import { useNotifications } from "@/components/wrappers/NotificationWrapper";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const { setNotification } = useNotifications()

  async function fetchTasks() {
    const response =  await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()

      if (result?.length === 0) {
        setNotification('info', "Looks like there are'nt any tasks in your list yet. Start now :-)", 3)
      }
      
      setTasks(result)

    } else {
      setNotification('error', 'Unable to fetch your tasks', 3)

    }
  }

  useEffect(()=>{
    fetchTasks()    
  }, [])

  return (
    <div>
      <Header username={user.username} />
    </div>
  )
}
