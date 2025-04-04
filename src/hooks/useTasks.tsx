import { useState, useEffect } from 'react'
import { useNotifications } from '@/wrappers/NotificationWrapper'
import { ExistingTask } from '@/components/tasks/types'

export default function useTasks() {
  const [tasks, setTasks] = useState<Array<ExistingTask>>([])
  const { setNotification } = useNotifications()

  async function fetchTasks() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    if (response.ok) {
      const result: Array<ExistingTask> = await response.json()

      if (result?.length === 0) {
        setNotification('info', 'No tasks found. Start now :-)', 3)
      }

      setTasks(result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()))
    } else {
      setNotification('error', 'Unable to fetch your tasks', 3)
    }
  }

  async function createTask(
    title: string,
    description: string,
    deadline: Date | null,
    completed: boolean,
    color_code: string
  ) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ title: title.trim(), description: description.trim(), deadline, completed, color_code }),
    })
    if (response.ok) {
      setNotification('success', 'Created the task successfully', 3)
      fetchTasks()

      return true
    } else {
      const result = await response.json()
      
      if (result?.statusCode === 400) {
        setNotification('error', result?.message?.[0], 3)
      } else {
        setNotification('error', 'Unable to create the task', 3)
      }

      return false
    }
  }

  async function updateTask(
    id: string,
    title: string,
    description: string,
    deadline: Date | null,
    completed: boolean,
    color_code: string
  ) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        task_id: id,
        title: title.trim(),
        description: description.trim(),
        deadline,
        completed,
        color_code,
      }),
    })
    if (response.ok) {
      setNotification('success', 'Updated the task', 3)
      fetchTasks()

      return true
    } else {
      const result = await response.json()

      if (result?.message) {
        setNotification('error', typeof result?.message === 'string' ? result?.message : result?.message?.[0], 3)
      } else {
        setNotification('error', 'Unable to update the task', 3)
      }
      
      return false
    }
  }

  async function markCompleteTask(id: string, complete: boolean) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/mark-complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        task_id: id,
        completed: complete,
      }),
    })
    if (response.ok) {

      if (complete) {
        setNotification('success', 'Marked the task completed', 3)
      } else {
        setNotification('warning', 'Marked the task incomplete', 3)
      }
      
      fetchTasks()

      return true
    } else {
      setNotification('error', 'Unable to update the task', 3)

      return false
    }
  }

  async function deleteTask(id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    if (response.ok) {
      setNotification('success', 'Deleted the task', 3)
      fetchTasks()

      return true
    } else {
      setNotification('error', 'Unable to delete the task', 3)

      return false
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    markCompleteTask,
    deleteTask,
  }
}