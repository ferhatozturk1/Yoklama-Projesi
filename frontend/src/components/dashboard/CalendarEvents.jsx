import React from 'react'
import { Link } from 'react-router-dom'
import { useCalendar } from '../../context/CalendarContext'
import { formatDate } from '../../utils/dateHelpers'

const CalendarEvents = () => {
  const { getUpcomingEvents } = useCalendar()
  const upcomingEvents = getUpcomingEvents(5)

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'holiday':
        return (
          <div className="p-2 bg-red-100 rounded-full">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'exam':
        return (
          <div className="p-2 bg-yellow-100 rounded-full">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )
    }
  }

  const getEventTypeText = (eventType) => {
    switch (eventType) {
      case 'holiday':
        return 'Tatil'
      case 'exam':
        return 'Sınav Dönemi'
      default:
        return 'Etkinlik'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Yaklaşan Etkinlikler</h2>
        <Link 
          to="/calendar-settings"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Takvimi Yönet
        </Link>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Yaklaşan etkinlik bulunmuyor</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div 
              key={`${event.eventType}-${event.id}`}
              className="flex items-center space-x-4"
            >
              {getEventIcon(event.eventType)}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{event.name}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">{formatDate(event.eventDate)}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
                    {getEventTypeText(event.eventType)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link 
          to="/calendar-settings"
          className="btn btn-secondary w-full text-center"
        >
          Tüm Etkinlikleri Görüntüle
        </Link>
      </div>
    </div>
  )
}

export default CalendarEvents