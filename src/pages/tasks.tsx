import ClosedTask from "@/components/tasks/ClosedTask";
import Header from "@/components/tasks/Header";
import { useAuth } from "@/components/wrappers/AuthWrapper";
import { useNotifications } from "@/components/wrappers/NotificationWrapper";
import { useEffect, useState } from "react";

interface TaskValues {
  id: string
  title: string
  description: string | null
  deadline: Date | null
  completed: boolean
  color_code: string
}

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

      console.log(result)

      setTasks(result)
    } else {
      setNotification('error', 'Unable to fetch your tasks', 3)
    }
  }

  async function deleteTask(id: string) {
    const response =  await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    if (response.ok) {
      setNotification('success', "Deleted the task", 3)
      await fetchTasks()
    } else {
      setNotification('error', 'Unable to delete the task', 3)
    }
  }

  async function markCompleteTask(id: string, complete: boolean) {
    const response =  await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/mark-complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({
        task_id: id,
        completed: complete
      })
    })
    
    if (response.ok) {
      setNotification('success', "Updated the task", 3)
      await fetchTasks()
    } else {
      setNotification('error', 'Unable to update the task', 3)
    }
  }

  useEffect(()=>{
    fetchTasks()    
  }, [])

  return (
    <div>
      <Header username={user.username} />
      <div className='flex flex-row gap-4 p-4'>
        {tasks.map((task: TaskValues) => (
          <ClosedTask
            key={task.id}
            _id={task.id}
            _title={task.title}
            _description={task.description || ''}
            _completed={task.completed}
            _color_code={task.color_code}
            _deadline={task.deadline}
            updateComplete={markCompleteTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  )
}
