import { BsSortAlphaDown, BsSortAlphaDownAlt } from 'react-icons/bs'
import { DeadlineFilterValues, FilterValues, SortValues } from './types'
import React, { useState } from 'react'
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

  return (
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
        onClick={toggleSort}
      >
        Sort by Deadline
        {sort === 'asc' ? ( <BsSortAlphaDown size={20} /> ) : 
        sort === 'desc' ? ( <BsSortAlphaDownAlt size={20} /> ) : null}
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
        labelAtRest={'Filter by Deadline'}
      />
    </div>
  )
}