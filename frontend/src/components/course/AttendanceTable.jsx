import React, { useState } from 'react'
import { formatDate } from '../../utils/dateHelpers'
import LoadingSpinner from '../common/LoadingSpinner'

const AttendanceTable = ({ students = [], attendanceData = [], onAttendanceUpdate, isLoading = false }) => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])

  // Filter students based on search and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedStatus === 'all') return matchesSearch
    
    const attendance = attendanceData.find(a => a.studentId === student.id)
    return matchesSearch && attendance?.status === selectedStatus
  })

  const handleStatusChange = (studentId, newStatus) => {
    if (onAttendanceUpdate) {
      onAttendanceUpdate(studentId, newStatus)
    }
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

  const handleBulkAction = (status) => {
    if (onAttendanceUpdate && selectedStudents.length > 0) {
      selectedStudents.forEach(studentId => {
        onAttendanceUpdate(studentId, status)
      })
      setSelectedStudents([])
      setSelectAll(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'present': 'bg-green-100 text-green-800',
      'absent': 'bg-red-100 text-red-800',
      'excused': 'bg-yellow-100 text-yellow-800',
      'late': 'bg-orange-100 text-orange-800'
    }
    
    const statusText = {
      'present': 'Var',
      'absent': 'Yok',
      'excused': 'Mazeretli',
      'late': 'Geç'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100'}`}>
        {statusText[status] || 'Belirsiz'}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Öğrenci ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4 py-2 w-full sm:w-64"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-input py-2"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="present">Var</option>
            <option value="absent">Yok</option>
            <option value="excused">Mazeretli</option>
            <option value="late">Geç</option>
          </select>
        </div>
        
        {selectedStudents.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{selectedStudents.length} öğrenci seçildi</span>
            <div className="flex space-x-1">
              <button
                onClick={() => handleBulkAction('present')}
                className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Var
              </button>
              <button
                onClick={() => handleBulkAction('absent')}
                className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Yok
              </button>
              <button
                onClick={() => handleBulkAction('excused')}
                className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              >
                Mazeretli
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Öğrenci No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Güncelleme
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
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'Arama kriterlerine uygun öğrenci bulunamadı.' 
                    : 'Henüz öğrenci eklenmemiş.'}
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => {
                const attendance = attendanceData.find(a => a.studentId === student.id) || {}
                return (
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
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attendance.status ? (
                        getStatusBadge(attendance.status)
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Belirlenmedi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.timestamp ? formatDate(attendance.timestamp, 'dd MMM HH:mm') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-2 py-1 rounded ${attendance.status === 'present' ? 'bg-green-200' : 'bg-green-100'} text-green-800 hover:bg-green-200`}
                        >
                          Var
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-2 py-1 rounded ${attendance.status === 'absent' ? 'bg-red-200' : 'bg-red-100'} text-red-800 hover:bg-red-200`}
                        >
                          Yok
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`px-2 py-1 rounded ${attendance.status === 'excused' ? 'bg-yellow-200' : 'bg-yellow-100'} text-yellow-800 hover:bg-yellow-200`}
                        >
                          Mazeretli
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {!isLoading && attendanceData.length > 0 && (
        <div className="flex flex-wrap justify-end space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Var: {attendanceData.filter(a => a.status === 'present').length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Yok: {attendanceData.filter(a => a.status === 'absent').length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>Mazeretli: {attendanceData.filter(a => a.status === 'excused').length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
            <span>Belirlenmemiş: {students.length - attendanceData.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceTable