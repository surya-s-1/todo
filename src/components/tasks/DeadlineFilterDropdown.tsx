import { useState, useRef, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa6'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { DeadlineFilterValues } from './types'

interface DeadlineFilterDropdownProps {
  value: DeadlineFilterValues
  options: { label: string; value: DeadlineFilterValues }[]
  onChange: (value: DeadlineFilterValues) => void
  showCalendar: boolean
  setShowCalendar: (state: boolean) => void
  customDate: Date | null
  setCustomDate: (d: Date | null) => void
  labelAtRest: string
}

export default function DeadlineFilterDropdown({
  value,
  options,
  onChange,
  showCalendar,
  setShowCalendar,
  customDate,
  setCustomDate,
  labelAtRest
}: DeadlineFilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(optionValue: DeadlineFilterValues) {
    onChange(optionValue)
    setOpen(false)

    if (optionValue === 'custom') {
      setShowCalendar(true)
    } else {
      setShowCalendar(false)
      setCustomDate(null)
    }
  }

  return (
    <div className={`relative w-fit`} ref={dropdownRef}>
      <button className={`filter-button ${value !== 'none' && 'filter-button-selected'}`} onClick={() => setOpen(!open)}>
        {
            value === 'custom' && customDate ? `Until ${customDate.toLocaleDateString()}` : 
            value === 'none' ? labelAtRest : 
            options.find(opt => opt.value === value)?.label
        }
        <FaChevronDown />
      </button>

      {open && (
        <div className="absolute left-0 w-full bg-gray-200 text-gray-600 rounded-md shadow-lg mt-1 z-10">
          {options.map(option => (
            <div
              key={option.value}
              className={`filter-button ${option.value === value && 'filter-button-selected'}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {showCalendar && value === 'custom' && (
        <div className="absolute z-10 mt-2">
          <Calendar
            onChange={(e) => {
              setCustomDate(e ? new Date(e.toString()) : null)
              setShowCalendar(false)
            }}
            value={customDate}
          />
        </div>
      )}
    </div>
  )
}