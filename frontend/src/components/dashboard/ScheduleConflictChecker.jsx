import React, { useState } from 'react'
import { isTimeSlotAvailable } from '../../utils/calendarRestrictions'

const ScheduleConflictChecker = ({ schedule }) => {
  const [day, setDay] = useState('monday')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [checkResult, setCheckResult] = useState(null)

  const weekDays = [
    { value: 'monday', label: 'Pazartesi' },
    { value: 'tuesday', label: 'Salı' },
    { value: 'wednesday', label: 'Çarşamba' },
    { value: 'thursday', label: 'Perşembe' },
    { value: 'friday', label: 'Cuma' }
  ]

  const handleCheck = () => {
    if (!day || !startTime || !endTime) {
      return
    }

    // Check if the time slot is available
    const result = isTimeSlotAvailable(schedule, day, startTime, endTime)
    setCheckResult(result)
  }

  const getResultColor = () => {
    if (!checkResult) return ''
    return checkResult.available ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Çakışma Kontrolü</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="day" className="form-label">
              Gün
            </label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="form-input"
            >
              {weekDays.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startTime" className="form-label">
              Başlangıç Saati
            </label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime" className="form-label">
              Bitiş Saati
            </label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCheck}
            className="btn btn-primary"
            disabled={!day || !startTime || !endTime}
          >
            Kontrol Et
          </button>
        </div>

        {/* Result */}
        {checkResult && (
          <div className={`p-4 rounded-lg border ${getResultColor()} mt-4`}>
            <div className="flex items-center">
              {checkResult.available ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className="font-medium">
                {weekDays.find(d => d.value === day)?.label}, {startTime} - {endTime}:
                {' '}
                {checkResult.available 
                  ? 'Bu zaman dilimi müsait.' 
                  : checkResult.reason
                }
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-lg mt-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Bilgi:</h4>
          <p className="text-sm text-blue-600">
            Bu araç, seçilen zaman diliminin mevcut programınızla çakışıp çakışmadığını kontrol eder.
            Aynı zaman diliminde birden fazla ders programlayamazsınız.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScheduleConflictChecker