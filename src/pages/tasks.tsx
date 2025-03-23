import ClosedTask from "@/components/tasks/ClosedTask";
import Header from "@/components/tasks/Header";
import Modal from "@/components/tasks/Modal";
import OpenTask from "@/components/tasks/OpenTask";
import { COLORS } from "@/components/utility";
import { useAuth } from "@/components/wrappers/AuthWrapper";
import { useNotifications } from "@/components/wrappers/NotificationWrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa"

interface TaskValues {
  id: string
  title: string
  description: string | null
  deadline: Date | null
  completed: boolean
  color_code: string | null
  created_at: Date
}

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Array<TaskValues>>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<TaskValues | null>(null)
  const [newTask, setNewTask] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const { setNotification } = useNotifications()

  async function fetchTasks() {
    const response =  await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    
    if (response.ok) {
      const result: Array<TaskValues> = await response.json()

      if (result?.length === 0) {
        setNotification('info', "Looks like there are'nt any tasks in your list yet. Start now :-)", 3)
      }

      console.log(result.sort((a, b) => (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())))

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
      handleModalClose()
      fetchTasks()
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

  async function updateTask(title: string, description: string, deadline: Date | null, completed: boolean, color_code: string) {
    const response =  await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({
        task_id: selected?.id,
        title,
        description,
        deadline,
        completed,
        color_code
      })
    })
    
    if (response.ok) {
      setNotification('success', "Updated the task", 3)
      handleModalClose()
      fetchTasks()
    } else {
      setNotification('error', 'Unable to update the task', 3)
    }
  }

  async function createTask(title: string, description: string, deadline: Date | null, completed: boolean, color_code: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_TODO_ENDPOINT}/create`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ title, description, deadline, completed, color_code })
      })

      if (response.ok) {
          setNotification('success', "Created the task successfully", 3)
          handleModalClose()
          fetchTasks()
      } else {
          const result = await response.json()

          if (result?.statusCode === 400) {
              setNotification('error', result?.message?.[0], 3)
          } else {
              setNotification('error', 'Unable to create the task', 3)
          }
      }
  }

  function confirmDelete(id: string) {
    setModalOpen(true)
    setDeleteId(id)
  }

  function handleModalClose() {
    setNewTask(false)
    setSelected(null)
    setDeleteId('')
    setModalOpen(false)
    router.push('/tasks', undefined, { shallow: true })
  }

  useEffect(()=>{
    document.title = 'Your Tasklist | To-Do App'
    fetchTasks()
  }, [])

  useEffect(()=>{
    if (tasks.length > 0 && router.asPath.includes('#')) {
      const hashId = router.asPath.split("#")[1]
      const task = tasks.find(el => el.id === hashId)
      if (task) {
        setSelected(task)
        setModalOpen(true)
        document.title = task.title
      }
    }
  }, [tasks, router.asPath])

  return (
    <div>
      <Header username={user.username} />
      <div className='grid grid-cols-5 gap-4 p-8 auto-rows-fr'>
        {tasks.map((task: TaskValues) => (
          <ClosedTask
            key={task.id}
            _id={task.id}
            _title={task.title}
            _description={task.description || ''}
            _completed={task.completed}
            _color_code={task.color_code || '#FFFFFF'}
            _deadline={task.deadline}
            updateComplete={markCompleteTask}
            onDelete={confirmDelete}
          />
        ))}
        <div 
          className="border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
          onClick={() => {
            setNewTask(true)
            setModalOpen(true)
          }}
        >
          <FaPlus 
            color="#d1d5dc"
            size={60}
          />
        </div>
      </div>
      {selected &&
      <Modal isOpen={modalOpen} onClose={()=>handleModalClose()}>
        <OpenTask
          _id={selected.id}
          _title={selected.title}
          _description={selected.description || ''}
          _completed={selected.completed}
          _color_code={selected.color_code || '#FFFFFF'}
          _deadline={selected.deadline}
          _button_name="Update"
          onSubmit={updateTask}
          onDelete={confirmDelete}
        />
      </Modal>}
      {newTask &&
      <Modal isOpen={modalOpen} onClose={()=>handleModalClose()}>
          <OpenTask
            _title={''}
            _description={''}
            _deadline={null}
            _color_code={COLORS[Math.floor(Math.random() * COLORS.length)]}
            _completed={false}
            _button_name='Create'
            onSubmit={createTask}
        />
      </Modal>}
      {deleteId &&
      <Modal isOpen={modalOpen} onClose={()=>handleModalClose()}>
        <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
          <p className="text-lg font-semibold mb-4">Are you sure you want to delete?</p>
          <div className="flex justify-evenly">
            <button 
              className="custom-button custom-button-alert"
              onClick={() => deleteTask(deleteId)}
            >
              Yes
            </button>
            <button 
              className="custom-button"
              onClick={() => handleModalClose()}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      }
    </div>
  )
}
