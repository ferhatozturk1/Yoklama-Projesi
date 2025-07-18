import React, { useState } from 'react'
import { showSuccess, showError, showWarning } from '../common/ToastNotification'
import LoadingSpinner from '../common/LoadingSpinner'

const StudentList = ({ students, isLoading, onEdit, onDelete, onBulkAction }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [sortConfig, setSortConfig] = useState({
    key: 'studentNumber',
    direction: 'ascending'
  })

  // Filter students based on search
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase()
    return (
      student.studentNumber.toLowerCase().includes(searchLower) ||
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      (student.email && student.email.toLowerCase().includes(searchLower))
    )
  })

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId])
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    }
  }

  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) {
      showWarning('Lütfen önce öğrenci seçin')
      return
    }

    if (window.confirm(`${selectedStudents.length} öğrenciyi silmek istediğinizden emin misiniz?`)) {
      if (onBulkAction) {
        onBulkAction('delete', selectedStudents)
        showSuccess(`${selectedStudents.length} öğrenci başarıyla silindi`)
        setSelectedStudents([])
        setSelectAll(false)
      }
    }
  }

  const handleExportSelected = () => {
    if (selectedStudents.length === 0) {
      showWarning('Lütfen önce öğrenci seçin')
      return
    }

    if (onBulkAction) {
      onBulkAction('export', selectedStudents)
      showSuccess(`${selectedStudents.length} öğrenci için dışa aktarma başlatıldı`)
    }
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }

    return sortConfig.direction === 'ascending' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Öğrenci ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 pr-4 py-2 w-full"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {selectedStudents.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{selectedStudents.length} öğrenci seçildi</span>
            <div className="flex space-x-1">
              <button
                onClick={handleExportSelected}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Dışa Aktar
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Sil
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('studentNumber')}
              >
                <div className="flex items-center space-x-1">
                  <span>Öğrenci No</span>
                  {getSortIcon('studentNumber')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Ad</span>
                  {getSortIcon('firstName')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Soyad</span>
                  {getSortIcon('lastName')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <LoadingSpinner size="medium" />
                    <span className="ml-2">Yükleniyor...</span>
                  </div>
                </td>
              </tr>
            ) : sortedStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm 
                    ? 'Arama kriterlerine uygun öğrenci bulunamadı.' 
                    : 'Henüz öğrenci eklenmemiş.'}
                </td>
              </tr>
            ) : (
              sortedStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => onEdit && onEdit(student)}
                    >
                      Düzenle
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        if (window.confirm(`${student.firstName} ${student.lastName} öğrencisini silmek istediğinizden emin misiniz?`)) {
                          onDelete && onDelete(student.id)
                        }
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Toplam: {students.length} öğrenci
          {searchTerm && ` (Filtrelenmiş: ${filteredStudents.length})`}
        </div>
        <div>
          {selectedStudents.length > 0 && `${selectedStudents.length} öğrenci seçildi`}
        </div>
      </div>
    </div>
  )
}

export default StudentList