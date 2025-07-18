import React, { useState } from 'react'
import { formatDate } from '../../utils/dateHelpers'
import DateRangeFilter from '../common/DateRangeFilter'
import LoadingSpinner from '../common/LoadingSpinner'

const AttendanceHistoryTable = ({ attendanceHistory = [], isLoading = false, onViewDetails, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' })
  
  // Sort attendance history
  const sortedHistory = [...attendanceHistory].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })
  
  // Filter attendance history
  const filteredHistory = sortedHistory.filter(session => {
    const matchesSearch = searchTerm === '' || 
      formatDate(session.date, 'dd MMMM yyyy').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || session.type === filterType
    
    // Check date range
    let matchesDateRange = true
    if (dateRange.startDate && dateRange.endDate) {
      const sessionDate = new Date(session.date)
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      
      // Set time to midnight for proper comparison
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      
      matchesDateRange = sessionDate >= startDate && sessionDate <= endDate
    }
    
    return matchesSearch && matchesType && matchesDateRange
  })
  
  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }
  
  const handleDateRangeClear = () => {
    setDateRange({ startDate: null, endDate: null })
  }
  
  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
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
  
  const calculateAttendanceRate = (session) => {
    const total = session.presentCount + session.absentCount + session.excusedCount
    if (total === 0) return 0
    return Math.round((session.presentCount / total) * 100)
  }
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tarih ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4 py-2 w-full sm:w-64"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input py-2"
          >
            <option value="all">Tüm Dersler</option>
            <option value="regular">Normal Dersler</option>
            <option value="makeup">Telafi Dersleri</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <DateRangeFilter 
            onApply={handleDateRangeApply}
            onClear={handleDateRangeClear}
          />
          
          <button
            onClick={() => onExport && onExport('excel', filteredHistory, dateRange)}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          
          <button
            onClick={() => onExport && onExport('pdf', filteredHistory, dateRange)}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tarih</span>
                  {getSortIcon('date')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tür
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Var
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yok
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mazeretli
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Katılım
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <LoadingSpinner size="medium" />
                    <span className="ml-2">Yükleniyor...</span>
                  </div>
                </td>
              </tr>
            ) : filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || filterType !== 'all' 
                    ? 'Arama kriterlerine uygun yoklama kaydı bulunamadı.' 
                    : 'Henüz yoklama kaydı yok.'}
                </td>
              </tr>
            ) : (
              filteredHistory.map(session => {
                const attendanceRate = calculateAttendanceRate(session)
                
                return (
                  <tr key={session.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(session.date, 'dd MMMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        session.type === 'makeup' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.type === 'makeup' ? 'Telafi' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.presentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.absentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.excusedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              attendanceRate >= 80 ? 'bg-green-500' : 
                              attendanceRate >= 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">%{attendanceRate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => onViewDetails && onViewDetails(session)}
                      >
                        Görüntüle
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => onExport && onExport('pdf', session.id)}
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {!isLoading && filteredHistory.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 text-sm text-gray-600">
          <div>
            Toplam: {filteredHistory.length} yoklama kaydı
            {dateRange.startDate && dateRange.endDate && (
              <span className="ml-2">
                ({formatDate(dateRange.startDate, 'dd.MM.yyyy')} - {formatDate(dateRange.endDate, 'dd.MM.yyyy')})
              </span>
            )}
            {filterType !== 'all' && (
              <span className="ml-2">
                ({filterType === 'regular' ? 'Normal Dersler' : 'Telafi Dersleri'})
              </span>
            )}
          </div>
          <div>
            Ortalama Katılım: %{Math.round(
              filteredHistory.reduce((sum, session) => sum + calculateAttendanceRate(session), 0) / filteredHistory.length
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceHistoryTable