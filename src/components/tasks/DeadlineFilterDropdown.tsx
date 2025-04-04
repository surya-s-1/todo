import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
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
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const portalContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        portalContainerRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
      setShowCalendar(false)
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

  const toggleDropdown = () => {
    if (!open && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
    setOpen(!open)
  }

  const baseStyles = triggerRect
    ? {
        position: 'absolute' as const,
        top: triggerRect.bottom + window.scrollY,
        left: triggerRect.left + window.scrollX,
        zIndex: 9999,
      }
    : {}

  return (
    <>
      <div className="relative">
        <button
          ref={triggerRef}
          className={`filter-button ${value !== 'none' && 'filter-button-selected'} whitespace-nowrap`}
          onClick={toggleDropdown}
        >
          {value === 'custom' && customDate
            ? `Until ${customDate.toLocaleDateString()}`
            : value === 'none'
            ? labelAtRest
            : options.find(opt => opt.value === value)?.label}
          <FaChevronDown />
        </button>
      </div>

      {ReactDOM.createPortal(
        (open || (showCalendar && value === 'custom')) && triggerRect ? (
          <div ref={portalContainerRef} style={baseStyles}>
            {open && (
              <div className="bg-gray-200 dark:bg-gray-600 text-gray-600 rounded-md shadow-lg mt-1">
                {options.map(option => (
                  <div
                    key={option.value}
                    className={`filter-button ${option.value === value && 'filter-button-selected'} w-full`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}

            {showCalendar && value === 'custom' && (
              <div className="mt-2">
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
        ) : null,
        document.body
      )}
    </>
  )
}
