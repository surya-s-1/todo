import { useState, useEffect } from 'react'
import { DeadlineFilterValues, ExistingTask, FilterValues, SortValues } from '@/components/tasks/types'

export function useFilterSort(tasks: ExistingTask[]) {
  const [filter, setFilter] = useState<FilterValues>('ongoing')
  const [sort, setSort] = useState<SortValues>(null)
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilterValues>('none')
  const [customDate, setCustomDate] = useState<Date | null>(null)
  const [filteredTasks, setFilteredTasks] = useState<ExistingTask[]>([])

  useEffect(() => {
    let result = tasks.filter(task => {
      if (filter === 'all') return true
      if (filter === 'ongoing') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })
    
    if (deadlineFilter !== 'none') {
      const now = new Date()
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59)

      if (deadlineFilter === 'past') {
        result = result.filter(task => {
          if (!task.deadline) return false
          if (new Date(task.deadline) <= yesterday) return true
        })
      }

      if (deadlineFilter === 'today') {
        result = result.filter(task => {
          if (!task.deadline) return false
          if (new Date(task.deadline) <= today) return true
        })
      }

      if (deadlineFilter === 'tomorrow') {
        result = result.filter(task => {
          if (!task.deadline) return false
          if (new Date(task.deadline) <= tomorrow) return true
        })
      }

      if (deadlineFilter === 'custom' && customDate) {
        result = result.filter(task => {
          if (!task.deadline) return false
          if (new Date(task.deadline) <= new Date(customDate.getFullYear(), customDate.getMonth(), customDate.getDate(), 23, 59, 59)) return true
        })
      }
    }

    if (sort === 'asc' || sort === 'desc') {
      result = result.sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : 0
        const dateB = b.deadline ? new Date(b.deadline).getTime() : 0
        return sort === 'asc' ? dateA - dateB : dateB - dateA
      })
    }

    setFilteredTasks(result)
  }, [tasks, filter, sort, deadlineFilter, customDate])

  function toggleSort() {
    if (sort === 'asc') setSort('desc')
    else if (sort === 'desc') setSort(null)
    else setSort('asc')
  }

  return { filteredTasks, filter, setFilter, sort, toggleSort, deadlineFilter, setDeadlineFilter, customDate, setCustomDate }
}