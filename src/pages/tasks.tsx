import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaPlus } from 'react-icons/fa'

import { useAuth } from '@/wrappers/AuthWrapper'

import useTasks from '@/hooks/useTasks'
import { useFilterSort } from '@/hooks/useFilterSort'

import Header from '@/components/Header'
import Modal from '@/components/Modal'
import { ExistingTask } from '@/components/tasks/types'
import ClosedTask from '@/components/tasks/ClosedTask'
import OpenTask from '@/components/tasks/OpenTask'
import FilterSortButtons from '@/components/tasks/FilterSortButtons'
import { getNewTask } from '@/components/utility'
import { useSystemTheme } from '@/wrappers/DarkModeWrapper'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<ExistingTask | null>(null)
  const [newTask, setNewTask] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState('')
  const [darkMode, setDarkMode] = useState<boolean>(false)

  const { theme } = useSystemTheme()

  useEffect(() => {
    setDarkMode(theme === 'dark')
  }, [theme])

  const { tasks, deleteTask, markCompleteTask, updateTask, createTask } = useTasks()
  const { 
    filteredTasks, 
    filter, setFilter, 
    sort, toggleSort,
    deadlineFilter, setDeadlineFilter,
    customDate, setCustomDate
  } = useFilterSort(tasks)

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

  function startNewTask() {
    setNewTask(true)
    setModalOpen(true)
  }

  function handleModalClose() {
    setNewTask(false)
    setSelected(null)
    setDeleteId('')
    setModalOpen(false)
    router.push('/tasks', undefined, { shallow: true })
  }

  return (
    <div className='bg-white dark:bg-gray-700 min-h-screen'>
      <Header 
        username={user.username} 
        startNewTask={startNewTask}
      />

      <FilterSortButtons 
        filter={filter} 
        setFilter={setFilter} 
        sort={sort} 
        toggleSort={toggleSort} 
        deadlineFilter={deadlineFilter}
        setDeadlineFilter={setDeadlineFilter}
        customDate={customDate}
        setCustomDate={setCustomDate}
      />

      <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 px-4 sm:px-8 py-2 auto-rows-fr'>

        {filteredTasks.map((task: ExistingTask) => (
          <ClosedTask
            key={task.id}
            darkMode={darkMode}
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
          onClick={() => startNewTask()}
        >
          <FaPlus color='#d1d5dc' size={60} />
        </div>

      </div>

      {selected && (

        <Modal isOpen={modalOpen} onClose={() => handleModalClose()}>
          <OpenTask
            task={selected}
            darkMode={darkMode}
            button_name='Update'
            onSubmit={async (title, desc, deadline, completed, color_code) => {
              const success = await updateTask(selected.id, title, desc, deadline, completed, color_code)
              if (success) handleModalClose()
            }}
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
            darkMode={darkMode}
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