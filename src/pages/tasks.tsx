import ClosedTask from "@/components/tasks/ClosedTask"
import Header from "@/components/Header"
import Modal from "@/components/Modal"
import OpenTask from "@/components/tasks/OpenTask"
import { useAuth } from "@/wrappers/AuthWrapper"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import useTasks, { TaskValues } from "@/hooks/useTasks"
import { COLORS } from "@/components/utility"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const { tasks, deleteTask, markCompleteTask, updateTask, createTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<TaskValues | null>(null)
  const [newTask, setNewTask] = useState(false)
  const [deleteId, setDeleteId] = useState("")

  function handleModalClose() {
    setNewTask(false)
    setSelected(null)
    setDeleteId("")
    setModalOpen(false)
    router.push("/tasks", undefined, { shallow: true })
  }

  useEffect(() => {
    if (tasks.length > 0 && router.asPath.includes("#")) {
      const hashId = router.asPath.split("#")[1]
      const task = tasks.find((t) => t.id === hashId)
      if (task) {
        setSelected(task)
        setModalOpen(true)
        document.title = `${task.title} | To-Do List`
      }
    }
  }, [tasks, router.asPath])

  return (
    <div>
      <Header username={user.username} />
      <div className="grid grid-cols-5 gap-4 p-8 auto-rows-fr">
        {tasks.map((task: TaskValues) => (
          <ClosedTask
            key={task.id}
            _id={task.id}
            _title={task.title}
            _description={task.description || ""}
            _completed={task.completed}
            _color_code={task.color_code || "#FFFFFF"}
            _deadline={task.deadline}
            updateComplete={markCompleteTask}
            onDelete={(id: string) => {
              setModalOpen(true)
              setDeleteId(id)
            }}
          />
        ))}
        <div
          className="border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
          onClick={() => {
            setNewTask(true)
            setModalOpen(true)
          }}
        >
          <FaPlus color="#d1d5dc" size={60} />
        </div>
      </div>

      {selected && (
        <Modal isOpen={modalOpen} onClose={() => handleModalClose()}>
          <OpenTask
            _id={selected.id}
            _title={selected.title}
            _description={selected.description || ""}
            _completed={selected.completed}
            _color_code={selected.color_code || "#FFFFFF"}
            _deadline={selected.deadline}
            _button_name="Update"
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
            _title={""}
            _description={""}
            _deadline={null}
            _color_code={COLORS[Math.floor(Math.random() * COLORS.length)]}
            _completed={false}
            _button_name="Create"
            onSubmit={async (...props) => {
              const success = await createTask(...props)
              if (success) handleModalClose()
            }}
          />
        </Modal>
      )}

      {deleteId && (
        <Modal isOpen={modalOpen} onClose={() => handleModalClose()}>
          <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete?</p>
            <div className="flex justify-evenly">
              <button 
                className="custom-button custom-button-alert" 
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
              <button className="custom-button" onClick={() => handleModalClose()}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
