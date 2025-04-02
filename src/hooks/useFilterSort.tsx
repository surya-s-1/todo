import { useState, useEffect } from 'react'
import { ExistingTask, FilterValues, SortValues } from '@/components/tasks/types'

export function useFilterSort(tasks: ExistingTask[]) {
  const [filter, setFilter] = useState<FilterValues>('ongoing')
  const [sort, setSort] = useState<SortValues>(null)
  const [filteredTasks, setFilteredTasks] = useState<ExistingTask[]>([])

  useEffect(() => {
    let result = tasks.filter(task => {
      if (filter === 'all') return true
      if (filter === 'ongoing') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })

    if (sort === 'asc' || sort === 'desc') {
      result = result.sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : 0
        const dateB = b.deadline ? new Date(b.deadline).getTime() : 0
        return sort === 'asc' ? dateA - dateB : dateB - dateA
      })
    }

    setFilteredTasks(result)
  }, [tasks, filter, sort])

  function toggleSort() {
    if (sort === 'asc') setSort('desc')
    else if (sort === 'desc') setSort(null)
    else setSort('asc')
  }

  return { filteredTasks, filter, setFilter, sort, toggleSort }
}