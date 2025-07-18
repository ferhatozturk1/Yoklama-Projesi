import React, { useState } from 'react'
import { formatDate, getDayName } from '../../utils/dateHelpers'
import { useCalendar } from '../../context/CalendarContext'

const AcademicCalendar = () => {
  const { holidays, examPeriods, semesterDates, getDateStatus } = useCalendar()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day))
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const isToday = (date) => {
    const today = new Date()
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date) => {
    return date &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }

  const getDayStyle = (date) => {
    if (!date) return ''
    
    const status = getDateStatus(date)
    let baseStyle = 'w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer hover:bg-gray-100 '
    
    if (isToday(date)) {
      baseStyle += 'bg-blue-600 text-white hover:bg-blue-700 '
    } else if (isSelected(date)) {
      baseStyle += 'bg-blue-100 text-blue-800 '
    } else if (status.type === 'holiday') {
      baseStyle += 'bg-red-100 text-red-800 '
    } else if (status.type === 'exam') {
      baseStyle += 'bg-yellow-100 text-yellow-800 '
    } else if (status.type === 'non-academic') {
      baseStyle += 'text-gray-400 '
    } else {
      baseStyle += 'text-gray-700 '
    }
    
    return baseStyle
  }

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Akademik Takvim</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => (
            <div key={index} className="flex justify-center">
              {date ? (
                <button
                  className={getDayStyle(date)}
                  onClick={() => setSelectedDate(date)}
                  title={date ? getDateStatus(date).message : ''}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div className="w-8 h-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {formatDate(selectedDate)} - {getDayName(selectedDate)}
          </h3>
          <div className="text-xs text-gray-600">
            {(() => {
              const status = getDateStatus(selectedDate)
              if (status.message) {
                return (
                  <div className={`p-2 rounded ${
                    status.type === 'holiday' ? 'bg-red-50 text-red-700' :
                    status.type === 'exam' ? 'bg-yellow-50 text-yellow-700' :
                    status.type === 'non-academic' ? 'bg-gray-50 text-gray-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {status.message}
                  </div>
                )
              }
              return <div className="p-2 bg-green-50 text-green-700 rounded">Normal ders günü</div>
            })()}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-xs font-medium text-gray-900 mb-2">Açıklama:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span>Bugün</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
            <span>Tatil</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
            <span>Sınav</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
            <span>Akademik Dışı</span>
          </div>
        </div>
      </div>

      {/* Semester Info */}
      {semesterDates && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Dönem Bilgisi</h4>
            <p className="text-xs text-blue-700">
              {semesterDates.startDate && formatDate(semesterDates.startDate)} - {' '}
              {semesterDates.endDate && formatDate(semesterDates.endDate)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AcademicCalendar