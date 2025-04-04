import React, { useEffect, useRef, useState } from 'react'
import { BsSortAlphaDown, BsSortAlphaDownAlt } from 'react-icons/bs'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { DeadlineFilterValues, FilterValues, SortValues } from './types'
import DeadlineFilterDropdown from './DeadlineFilterDropdown'

interface FilterSortButtonsProps {
  filter: FilterValues
  setFilter: (filter: FilterValues) => void
  sort: SortValues
  toggleSort: () => void
  deadlineFilter: DeadlineFilterValues
  setDeadlineFilter: (filter: DeadlineFilterValues) => void
  customDate: Date | null
  setCustomDate: (d: Date | null) => void
}

export default function FilterSortButtons({ 
  filter, setFilter, 
  sort, toggleSort,
  deadlineFilter, setDeadlineFilter,
  customDate, setCustomDate
}: FilterSortButtonsProps) {

  const [showCalendar, setShowCalendar] = useState(false)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkForOverflow = () => {
    const container = scrollContainerRef.current
    if (!container) return
    setShowLeft(container.scrollLeft > 0)
    setShowRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    checkForOverflow()
    container.addEventListener('scroll', checkForOverflow)
    window.addEventListener('resize', checkForOverflow)
    return () => {
      container.removeEventListener('scroll', checkForOverflow)
      window.removeEventListener('resize', checkForOverflow)
    }
  }, [])

  return (
    <div className="relative">
      {showLeft && (
        <button 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow"
          onClick={() => scrollContainerRef.current?.scrollBy({ left: -100, behavior: 'smooth' })}
        >
          <FaChevronLeft size={20} />
        </button>
      )}
      <div className="flex gap-4 m-4 mx-8 scrollbar-hide overflow-x-auto" ref={scrollContainerRef}>
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
          className={`filter-button ${sort && 'filter-button-selected'} whitespace-nowrap`}
          onClick={toggleSort}
        >
          Sort by Deadline
          {sort === 'asc' ? (<BsSortAlphaDown size={20} />) : 
           sort === 'desc' ? (<BsSortAlphaDownAlt size={20} />) : null}
        </button>
        <DeadlineFilterDropdown
          value={deadlineFilter}
          options={[
            { label: 'None', value: 'none' },
            { label: 'Past Deadline', value: 'past' },
            { label: 'Due Today', value: 'today' },
            { label: 'Due Tomorrow', value: 'tomorrow' },
            { label: 'Custom', value: 'custom' }
          ]}
          onChange={setDeadlineFilter}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          customDate={customDate}
          setCustomDate={setCustomDate}
          labelAtRest="Filter by Deadline"
        />
      </div>
      {showRight && (
        <button 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow"
          onClick={() => scrollContainerRef.current?.scrollBy({ left: 100, behavior: 'smooth' })}
        >
          <FaChevronRight size={20} />
        </button>
      )}
    </div>
  )
}
