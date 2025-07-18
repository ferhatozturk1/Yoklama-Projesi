import React from 'react'
import { formatDate } from '../../utils/dateHelpers'

const CourseDetailCard = ({ course }) => {
  if (!course) return null

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'upcoming': 'bg-blue-100 text-blue-800',
      'archived': 'bg-yellow-100 text-yellow-800'
    }
    
    const statusText = {
      'active': 'Aktif',
      'completed': 'Tamamlandı',
      'upcoming': 'Yaklaşan',
      'archived': 'Arşivlenmiş'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100'}`}>
        {statusText[status] || 'Bilinmiyor'}
      </span>
    )
  }

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 mr-3">
              {course.code} - {course.name}
            </h1>
            {getStatusBadge(course.status)}
          </div>
          <p className="text-gray-600 mt-1">
            Şube: {course.section} | Derslik: {course.classroom}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {course.schedule?.day}, {course.schedule?.startTime} - {course.schedule?.endTime}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-800">Öğrenci</p>
          <p className="text-2xl font-bold text-blue-900">{course.studentCount || 0}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <p className="text-sm font-medium text-green-800">Ders</p>
          <p className="text-2xl font-bold text-green-900">{course.sessionsHeld || 0}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-sm font-medium text-purple-800">Devam</p>
          <p className="text-2xl font-bold text-purple-900">{course.attendanceRate || 0}%</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg text-center">
          <p className="text-sm font-medium text-yellow-800">Telafi</p>
          <p className="text-2xl font-bold text-yellow-900">{course.makeupCount || 0}</p>
        </div>
      </div>

      {course.description && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ders Açıklaması</h3>
          <p className="text-gray-700">{course.description}</p>
        </div>
      )}

      {course.nextClass && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Sonraki Ders</h4>
              <p className="text-sm text-blue-700">{course.nextClass}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetailCard