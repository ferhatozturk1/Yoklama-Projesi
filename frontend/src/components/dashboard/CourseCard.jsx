import React from 'react'
import { Link } from 'react-router-dom'
import ClassStartButton from '../common/ClassStartButton'

const CourseCard = ({ course, index, onClick }) => {
  // Color scheme for different courses
  const getCardColor = (index) => {
    const colors = [
      'border-l-blue-500 bg-blue-50',
      'border-l-green-500 bg-green-50',
      'border-l-purple-500 bg-purple-50',
      'border-l-orange-500 bg-orange-50',
      'border-l-pink-500 bg-pink-50',
      'border-l-indigo-500 bg-indigo-50'
    ]
    return colors[index % colors.length]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'completed':
        return 'Tamamlandı'
      case 'upcoming':
        return 'Yaklaşan'
      default:
        return 'Bilinmiyor'
    }
  }

  return (
    <div
      className={`card border-l-4 ${getCardColor(index)} hover:shadow-lg transition-all duration-200 cursor-pointer`}
      onClick={onClick}
    >
      {/* Course Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {course.code}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{course.name}</p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
              {getStatusText(course.status)}
            </span>
            <span className="text-xs text-gray-500">Şube: {course.section}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{course.classroom}</p>
          <p className="text-xs text-gray-500">{course.schedule?.day}</p>
          <p className="text-xs text-gray-500">
            {course.schedule?.startTime} - {course.schedule?.endTime}
          </p>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{course.studentCount || 0}</div>
          <div className="text-xs text-gray-600">Öğrenci</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{course.sessionsHeld || 0}</div>
          <div className="text-xs text-gray-600">Ders</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{course.attendanceRate || 0}%</div>
          <div className="text-xs text-gray-600">Devam</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Link
          to={`/course/${course.id}`}
          className="flex-1 btn btn-primary text-center text-sm py-2"
          onClick={(e) => e.stopPropagation()}
        >
          Detay
        </Link>
        <ClassStartButton 
          course={course} 
          onStartClass={(courseId, classType) => {
            console.log(`Starting ${classType} class for course ${courseId}`)
          }} 
        />
      </div>

      {/* Next Class Info */}
      {course.nextClass && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 font-medium">
            Sonraki Ders: {course.nextClass}
          </p>
        </div>
      )}
    </div>
  )
}

export default CourseCard