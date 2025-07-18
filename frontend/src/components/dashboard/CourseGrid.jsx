import React from 'react'
import CourseCard from './CourseCard'

const CourseGrid = ({ courses = [], onCourseSelect, searchTerm = '', filterSemester = '' }) => {
  // Filter courses based on search and semester
  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSemester = !filterSemester || course.semester === filterSemester
    
    return matchesSearch && matchesSemester
  })

  // Filter courses based on search and semester

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm || filterSemester ? 'Ders bulunamadı' : 'Henüz ders eklenmemiş'}
        </h3>
        <p className="text-gray-600 mb-4">
          {searchTerm || filterSemester 
            ? 'Arama kriterlerinizi değiştirmeyi deneyin'
            : 'İlk dersinizi ekleyerek başlayın'
          }
        </p>
        {!searchTerm && !filterSemester && (
          <button className="btn btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ders Ekle
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course, index) => (
        <CourseCard
          key={course.id}
          course={course}
          index={index}
          onClick={() => onCourseSelect && onCourseSelect(course)}
        />
      ))}
    </div>
  )
}

export default CourseGrid