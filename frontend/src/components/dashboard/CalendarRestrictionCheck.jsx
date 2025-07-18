import React, { useState } from 'react'
import { useCalendar } from '../../context/CalendarContext'
import { isValidClassDate, getClassWarnings } from '../../utils/calendarRestrictions'
import { formatDate } from '../../utils/dateHelpers'

const CalendarRestrictionCheck = () => {
  const { holidays, examPeriods, semesterDates } = useCalendar()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDay, setSelectedDay] = useState('monday')
  const [checkResult, setCheckResult] = useState(null)
  const [warnings, setWarnings] = useState([])

  const weekDays = [
    { value: 'monday', label: 'Pazartesi' },
    { value: 'tuesday', label: 'Salı' },
    { value: 'wednesday', label: 'Çarşamba' },
    { value: 'thursday', label: 'Perşembe' },
    { value: 'friday', label: 'Cuma' }
  ]

  const handleCheck = () => {
    if (!selectedDate) {
      return
    }

    const date = new Date(selectedDate)
    
    // Check if the date is valid for scheduling
    const result = isValidClassDate(date, selectedDay, holidays, examPeriods, semesterDates)
    setCheckResult(result)
    
    // Get warnings
    const dateWarnings = getClassWarnings(date, holidays, examPeriods)
    setWarnings(dateWarnings)
  }

  const getResultColor = () => {
    if (!checkResult) return ''
    return checkResult.valid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tarih Uygunluk Kontrolü</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="selectedDate" className="form-label">
              Tarih
            </label>
            <input
              id="selectedDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="selectedDay" className="form-label">
              Gün
            </label>
            <select
              id="selectedDay"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="form-input"
            >
              {weekDays.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCheck}
            className="btn btn-primary"
            disabled={!selectedDate}
          >
            Kontrol Et
          </button>
        </div>

        {/* Result */}
        {checkResult && (
          <div className={`p-4 rounded-lg border ${getResultColor()} mt-4`}>
            <div className="flex items-center">
              {checkResult.valid ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className="font-medium">
                {selectedDate && formatDate(new Date(selectedDate))}:
                {' '}
                {checkResult.valid 
                  ? 'Bu tarihte ders programlanabilir.' 
                  : checkResult.reason
                }
              </p>
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200 text-yellow-800 mt-4">
            <h4 className="font-medium mb-2">Uyarılar:</h4>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-lg mt-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Bilgi:</h4>
          <p className="text-sm text-blue-600">
            Bu araç, seçilen tarihin ders programlamaya uygun olup olmadığını kontrol eder. 
            Resmi tatiller, sınav dönemleri ve akademik takvim dışı günlerde ders programlanamaz.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CalendarRestrictionCheck