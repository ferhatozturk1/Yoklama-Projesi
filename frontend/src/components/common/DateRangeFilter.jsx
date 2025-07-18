import React, { useState } from 'react'
import { formatDate } from '../../utils/dateHelpers'

const DateRangeFilter = ({ onApply, onClear }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  const handleApply = () => {
    if (startDate && endDate) {
      onApply && onApply(startDate, endDate)
      setIsOpen(false)
    }
  }
  
  const handleClear = () => {
    setStartDate('')
    setEndDate('')
    onClear && onClear()
    setIsOpen(false)
  }
  
  const getPresetDates = (preset) => {
    const today = new Date()
    let start = new Date()
    let end = new Date()
    
    switch (preset) {
      case 'today':
        // Start and end are already today
        break
      case 'yesterday':
        start.setDate(today.getDate() - 1)
        end.setDate(today.getDate() - 1)
        break
      case 'thisWeek':
        start.setDate(today.getDate() - today.getDay())
        break
      case 'lastWeek':
        start.setDate(today.getDate() - today.getDay() - 7)
        end.setDate(today.getDate() - today.getDay() - 1)
        break
      case 'thisMonth':
        start.setDate(1)
        break
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      default:
        break
    }
    
    setStartDate(formatDate(start, 'yyyy-MM-dd'))
    setEndDate(formatDate(end, 'yyyy-MM-dd'))
  }
  
  return (
    <div className="relative">
      <button
        className="btn btn-secondary flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Tarih Aralığı
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hızlı Seçim</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => getPresetDates('today')}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Bugün
                </button>
                <button
                  type="button"
                  onClick={() => getPresetDates('yesterday')}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Dün
                </button>
                <button
                  type="button"
                  onClick={() => getPresetDates('thisWeek')}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Bu Hafta
                </button>
                <button
                  type="button"
                  onClick={() => getPresetDates('lastWeek')}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Geçen Hafta
                </button>
                <button
                  type="button"
                  onClick={() => getPresetDates('thisMonth')}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Bu Ay
                </button>
                <button
                  type="button"
                  onClick={() => getPresetDates('lastMonth')}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Geçen Ay
                </button>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Temizle
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!startDate || !endDate}
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter