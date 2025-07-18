import React, { useState, useEffect } from 'react'
import { formatDate } from '../../utils/dateHelpers'
import { showSuccess, showWarning } from '../common/ToastNotification'
import LoadingSpinner from '../common/LoadingSpinner'

const AttendanceTable = ({ 
  students = [], 
  attendanceData = [], 
  onAttendanceUpdate, 
  isLoading = false,
  session = null,
  autoSave = true
}) => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'studentNumber', direction: 'ascending' })

  // Auto-save effect
  useEffect(() => {
    if (autoSave && attendanceData.length > 0) {
      const timer = setTimeout(() => {
        saveAttendanceData()
      }, 5000) // Auto-save after 5 seconds of inactivity
      
      return () => clearTimeout(timer)
    }
  }, [attendanceData, autoSave])
  
  // Save attendance data
  const saveAttendanceData = async () => {
    try {
      setIsSaving(true)
      
      // In a real app, we would save this to the backend
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setLastSaved(new Date())
      setIsSaving(false)
    } catch (error) {
      console.error('Error saving attendance data:', error)
      setIsSaving(false)
    }
  }
  
  // Sort students
  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })
  
  // Filter students based on search and status
  const filteredStudents = sortedStudents.filter(student => {
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
      
      // Show success message
      const student = students.find(s => s.id === studentId)
      if (student) {
        const statusText = {
          'present': 'Var',
          'absent': 'Yok',
          'excused': 'Mazeretli',
          'late': 'Geç'
        }
        showSuccess(`${student.firstName} ${student.lastName} için durum "${statusText[newStatus]}" olarak güncellendi.`)
      }
    }
  }
  
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

  const handleBulkAction = (status) => {
    if (onAttendanceUpdate && selectedStudents.length > 0) {
      selectedStudents.forEach(studentId => {
        onAttendanceUpdate(studentId, status)
      })
      
      // Show success message
      const statusText = {
        'present': 'Var',
        'absent': 'Yok',
        'excused': 'Mazeretli',
        'late': 'Geç'
      }
      showSuccess(`${selectedStudents.length} öğrenci için durum "${statusText[status]}" olarak güncellendi.`)
      
      setSelectedStudents([])
      setSelectAll(false)
    } else {
      showWarning('Lütfen önce öğrenci seçin.')
    }
  }
  
  const handleSaveClick = async () => {
    await saveAttendanceData()
    showSuccess('Yoklama verileri başarıyla kaydedildi.')
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
      {/* Session Info */}
      {session && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Aktif Yoklama:</span> {session.type === 'makeup' ? 'Telafi Dersi' : 'Normal Ders'}
              </p>
              {session.notes && (
                <p className="text-sm text-blue-700 mt-1">
                  <span className="font-medium">Not:</span> {session.notes}
                </p>
              )}
            </div>
            <div className="mt-2 md:mt-0 text-sm text-blue-800">
              {lastSaved ? (
                <span>Son kayıt: {formatDate(lastSaved, 'HH:mm:ss')}</span>
              ) : autoSave ? (
                <span>Otomatik kayıt aktif</span>
              ) : (
                <span>Değişiklikler kaydedilmedi</span>
              )}
            </div>
          </div>
        </div>
      )}
      
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
        
        <div className="flex items-center space-x-2">
          {selectedStudents.length > 0 ? (
            <>
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
                <button
                  onClick={() => handleBulkAction('late')}
                  className="px-2 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
                >
                  Geç
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleSaveClick}
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  <span>Kaydediliyor...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Kaydet</span>
                </div>
              )}
            </button>
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
                  <span>Ad Soyad</span>
                  {getSortIcon('firstName')}
                </div>
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
                        <button
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-2 py-1 rounded ${attendance.status === 'late' ? 'bg-orange-200' : 'bg-orange-100'} text-orange-800 hover:bg-orange-200`}
                        >
                          Geç
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
      {!isLoading && students.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Yoklama Özeti</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm text-center">
              <div className="text-lg font-bold text-gray-800">{students.length}</div>
              <div className="text-xs text-gray-600">Toplam Öğrenci</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg shadow-sm text-center">
              <div className="text-lg font-bold text-green-800">{attendanceData.filter(a => a.status === 'present').length}</div>
              <div className="text-xs text-green-600">Var</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg shadow-sm text-center">
              <div className="text-lg font-bold text-red-800">{attendanceData.filter(a => a.status === 'absent').length}</div>
              <div className="text-xs text-red-600">Yok</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg shadow-sm text-center">
              <div className="text-lg font-bold text-yellow-800">{attendanceData.filter(a => a.status === 'excused').length}</div>
              <div className="text-xs text-yellow-600">Mazeretli</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg shadow-sm text-center">
              <div className="text-lg font-bold text-orange-800">{attendanceData.filter(a => a.status === 'late').length}</div>
              <div className="text-xs text-orange-600">Geç</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-2 md:mb-0">
              <span className="font-medium">Katılım Oranı:</span> %{Math.round(((attendanceData.filter(a => a.status === 'present' || a.status === 'late').length) / students.length) * 100) || 0}
            </div>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">Belirlenmemiş:</span> {students.length - attendanceData.length} öğrenci
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceTable