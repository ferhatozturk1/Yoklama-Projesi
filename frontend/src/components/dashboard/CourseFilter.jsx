import React from 'react'

const CourseFilter = ({ 
  searchTerm = '', 
  onSearchChange, 
  filterSemester = '', 
  onSemesterChange,
  onAddCourse,
  semesters = [
    { value: '2024-fall', label: '2024 Güz' },
    { value: '2024-spring', label: '2024 Bahar' }
  ]
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
      <h2 className="text-xl font-bold text-gray-900">Derslerim</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Ders ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input pl-10 pr-4 py-2 w-full"
          />
          <svg 
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Semester Filter */}
        <select
          value={filterSemester}
          onChange={(e) => onSemesterChange(e.target.value)}
          className="form-input py-2 w-full sm:w-auto"
        >
          <option value="">Tüm Dönemler</option>
          {semesters.map(semester => (
            <option key={semester.value} value={semester.value}>
              {semester.label}
            </option>
          ))}
        </select>

        {/* Add Course Button */}
        <button 
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => onAddCourse && onAddCourse()}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ders Ekle
        </button>
      </div>
    </div>
  )
}

export default CourseFilter