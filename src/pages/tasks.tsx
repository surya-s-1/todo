import ClosedTask from '@/components/tasks/ClosedTask'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import OpenTask from '@/components/tasks/OpenTask'
import { useAuth } from '@/wrappers/AuthWrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { BsSortAlphaDown, BsSortAlphaDownAlt } from 'react-icons/bs'
import useTasks from '@/hooks/useTasks'
import { ExistingTask } from '@/components/tasks/types'
import { getNewTask } from '@/components/utility'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const { tasks, deleteTask, markCompleteTask, updateTask, createTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<ExistingTask | null>(null)
  const [newTask, setNewTask] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('ongoing')
  const [sort, setSort] = useState<'asc' | 'desc' | null>(null)
  const [showTasks, setShowTasks] = useState<Array<ExistingTask>>([])

  useEffect(() => {
    if (tasks.length > 0 && router.asPath.includes('#')) {
      const hashId = router.asPath.split('#')[1]
      const task = tasks.find((t) => t.id === hashId)
      if (task) {
        setSelected(task)
        setModalOpen(true)
        document.title = `${task.title} | To-Do List`
      }
    }
  }, [tasks, router.asPath])
  
  useEffect(() => {
    let filteredTasks = tasks.filter((task) => {
      if (filter === 'all') return true
      if (filter === 'ongoing') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })
    
    if (sort === 'asc' || sort === 'desc') {
      filteredTasks = filteredTasks.sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : 0
        const dateB = b.deadline ? new Date(b.deadline).getTime() : 0
        return sort === 'desc' ? dateB - dateA : dateA - dateB
      })
    }

    setShowTasks(filteredTasks)
  }, [tasks, filter, sort])

  function handleModalClose() {
    setNewTask(false)
    setSelected(null)
    setDeleteId('')
    setModalOpen(false)
    router.push('/tasks', undefined, { shallow: true })
  }

  function handleSortClick() {
    if (sort === 'asc') {
      setSort('desc')
      return
    }

    if (sort === 'desc') {
      setSort(null)
      return
    }

    if (!sort) {
      setSort('asc')
      return
    }
  }

  return (
    <div>
      <Header username={user.username} />
      <div className='flex gap-4 m-4 mx-8'>
        <button
          className={`filter-button ${filter === 'all' && 'filter-button-selected'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'ongoing' && 'filter-button-selected'}`}
          onClick={() => setFilter('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`filter-button ${filter === 'completed' && 'filter-button-selected'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`filter-button ${sort && 'filter-button-selected'}`}
          onClick={handleSortClick}
        >
          Sort By Deadline
          {sort === 'asc' ? <BsSortAlphaDown size={20} /> : 
          sort === 'desc' ? <BsSortAlphaDownAlt size={20} /> : null}
        </button>
        <button
          className={`filter-button`}
          onClick={() => {}}
        >
          Filter By Deadline
        </button>
      </div>
      <div className='grid grid-cols-5 gap-4 px-8 py-2 auto-rows-fr'>
        {showTasks.map((task: ExistingTask) => (
          <ClosedTask
            key={task.id}
            task={task}
            updateComplete={markCompleteTask}
            onDelete={(id: string) => {
              setModalOpen(true)
              setDeleteId(id)
            }}
          />
        ))}
        <div
          className='border-2 border-dashed border-gray-300 flex items-center justify-center py-16 cursor-pointer'
          onClick={() => {
            setNewTask(true)
            setModalOpen(true)
          }}
        >
          <FaPlus color='#d1d5dc' size={60} />
        </div>
      </div>

      {selected && (
        <Modal isOpen={modalOpen} onClose={() => handleModalClose()}>
          <OpenTask
            task={selected}
            button_name='Update'
            onSubmit={async (title, desc, deadline, completed, color_code) => {
              const success = await updateTask(selected.id, title, desc, deadline, completed, color_code)
              if (success) handleModalClose()
            }
            }
            onDelete={(id: string) => {
              setModalOpen(true)
              setDeleteId(id)
            }}
          />
        </Modal>
      )}
      
      {newTask && (
        <Modal isOpen={modalOpen} onClose={() => handleModalClose()}>
          <OpenTask
            task={getNewTask()}
            button_name='Create'
            onSubmit={async (...props) => {
              const success = await createTask(...props)
              if (success) handleModalClose()
            }}
          />
        </Modal>
      )}

      {deleteId && (
        <Modal isOpen={modalOpen} onClose={() => handleModalClose()}>
          <div className='bg-white p-6 rounded-lg shadow-md w-80 text-center'>
            <p className='text-lg font-semibold mb-4'>Are you sure you want to delete?</p>
            <div className='flex justify-evenly'>
              <button 
                className='custom-button custom-button-alert' 
                onClick={async () => {
                  const success = await deleteTask(deleteId)
                  if (success) {
                    setDeleteId('')
                    handleModalClose()
                  }
                }}
              >
                Yes
              </button>
              <button className='custom-button' onClick={() => handleModalClose()}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
