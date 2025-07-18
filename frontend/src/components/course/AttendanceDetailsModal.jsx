import React, { useState, useEffect } from 'react'
import { formatDate } from '../../utils/dateHelpers'
import { exportAttendance } from '../../utils/exportUtils'
import { showError, showSuccess } from '../common/ToastNotification'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'

const AttendanceDetailsModal = ({ isOpen, onClose, session, courseId, courseInfo }) => {
  const [attendanceDetails, setAttendanceDetails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  useEffect(() => {
    if (isOpen && session) {
      loadAttendanceDetails()
    }
  }, [isOpen, session])
  
  const loadAttendanceDetails = async () => {
    try {
      setIsLoading(true)
      
      // In demo mode, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Mock data
      const mockDetails = [
        { 
          studentId: 's1', 
          studentNumber: '20210001', 
          firstName: 'Ali', 
          lastName: 'Yılmaz',
          status: 'present',
          timestamp: new Date(session.date.getTime() + 5 * 60000) // 5 minutes after session start
        },
        { 
          studentId: 's2', 
          studentNumber: '20210002', 
          firstName: 'Ayşe', 
          lastName: 'Kaya',
          status: 'absent',
          timestamp: null
        },
        { 
          studentId: 's3', 
          studentNumber: '20210003', 
          firstName: 'Mehmet', 
          lastName: 'Demir',
          status: 'present',
          timestamp: new Date(session.date.getTime() + 2 * 60000) // 2 minutes after session start
        },
        { 
          studentId: 's4', 
          studentNumber: '20210004', 
          firstName: 'Zeynep', 
          lastName: 'Şahin',
          status: 'excused',
          timestamp: null
        },
        { 
          studentId: 's5', 
          studentNumber: '20210005', 
          firstName: 'Mustafa', 
          lastName: 'Öztürk',
          status: 'late',
          timestamp: new Date(session.date.getTime() + 15 * 60000) // 15 minutes after session start
        }
      ]
      
      setAttendanceDetails(mockDetails)
    } catch (error) {
      console.error('Error loading attendance details:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter attendance details
  const filteredDetails = attendanceDetails.filter(detail => {
    const matchesSearch = searchTerm === '' || 
      detail.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${detail.firstName} ${detail.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || detail.status === filterStatus
    
    return matchesSearch && matchesStatus
  })
  
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
  
  // Calculate statistics
  const presentCount = attendanceDetails.filter(d => d.status === 'present').length
  const absentCount = attendanceDetails.filter(d => d.status === 'absent').length
  const excusedCount = attendanceDetails.filter(d => d.status === 'excused').length
  const lateCount = attendanceDetails.filter(d => d.status === 'late').length
  const totalCount = attendanceDetails.length
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yoklama Detayları"
      size="large"
    >
      <div className="space-y-6">
        {/* Session Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                {formatDate(session?.date, 'dd MMMM yyyy')}
              </h3>
              <p className="text-sm text-blue-700">
                Ders Türü: {session?.type === 'makeup' ? 'Telafi Dersi' : 'Normal Ders'}
                {session?.notes && ` - ${session.notes}`}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                Katılım Oranı: %{attendanceRate}
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-xl font-bold text-green-800">{presentCount}</div>
            <div className="text-sm text-green-600">Var</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-xl font-bold text-red-800">{absentCount}</div>
            <div className="text-sm text-red-600">Yok</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg text-center">
            <div className="text-xl font-bold text-yellow-800">{excusedCount}</div>
            <div className="text-sm text-yellow-600">Mazeretli</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <div className="text-xl font-bold text-orange-800">{lateCount}</div>
            <div className="text-sm text-orange-600">Geç</div>
          </div>
        </div>
        
        {/* Filters */}
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input py-2"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="present">Var</option>
            <option value="absent">Yok</option>
            <option value="excused">Mazeretli</option>
            <option value="late">Geç</option>
          </select>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Zaman
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <LoadingSpinner size="medium" />
                      <span className="ml-2">Yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDetails.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Arama kriterlerine uygun öğrenci bulunamadı.' 
                      : 'Henüz yoklama kaydı yok.'}
                  </td>
                </tr>
              ) : (
                filteredDetails.map(detail => (
                  <tr key={detail.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {detail.studentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {detail.firstName} {detail.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(detail.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {detail.timestamp ? formatDate(detail.timestamp, 'HH:mm:ss') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => {
              try {
                exportAttendance('excel', {
                  type: 'session',
                  session: session,
                  students: attendanceDetails
                }, {
                  fileName: `yoklama-detay-${formatDate(session.date, 'yyyy-MM-dd')}.xlsx`,
                  courseInfo: courseInfo
                })
                showSuccess('Excel formatında dışa aktarma tamamlandı.')
              } catch (error) {
                console.error('Error exporting attendance:', error)
                showError('Dışa aktarma sırasında bir hata oluştu.')
              }
            }}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          
          <button
            onClick={() => {
              try {
                exportAttendance('pdf', {
                  type: 'session',
                  session: session,
                  students: attendanceDetails
                }, {
                  title: 'Yoklama Detayları',
                  fileName: `yoklama-detay-${formatDate(session.date, 'yyyy-MM-dd')}.pdf`,
                  courseInfo: courseInfo
                })
                showSuccess('PDF formatında dışa aktarma tamamlandı.')
              } catch (error) {
                console.error('Error exporting attendance:', error)
                showError('Dışa aktarma sırasında bir hata oluştu.')
              }
            }}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
          
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Kapat
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AttendanceDetailsModal