import { BsSortAlphaDown, BsSortAlphaDownAlt } from 'react-icons/bs'
import { FilterValues, SortValues } from './types'

interface FilterSortButtonsProps {
  filter: FilterValues
  setFilter: (filter: FilterValues) => void
  sort: SortValues
  toggleSort: () => void
}

export default function FilterSortButtons({
  filter,
  setFilter,
  sort,
  toggleSort,
}: FilterSortButtonsProps) {
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
        {sort === 'asc' ? (
          <BsSortAlphaDown size={20} />
        ) : sort === 'desc' ? (
          <BsSortAlphaDownAlt size={20} />
        ) : null}
      </button>
      <button className={`filter-button`} onClick={() => {}}>
        Filter by Deadline
      </button>
    </div>
  )
}