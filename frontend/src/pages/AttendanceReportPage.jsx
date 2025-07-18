import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import DateRangeFilter from '../components/common/DateRangeFilter'
import { formatDate } from '../utils/dateHelpers'
import { exportAttendance } from '../utils/exportUtils'
import { showError, showSuccess } from '../components/common/ToastNotification'
import LoadingSpinner from '../components/common/LoadingSpinner'

const AttendanceReportPage = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [reportType, setReportType] = useState('summary')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // In demo mode, simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock course data
        const courseData = {
          id: courseId,
          code: 'BIL101',
          name: 'Bilgisayar Programlama I',
          section: '1',
          classroom: 'A-201',
          status: 'active'
        }
        
        // Mock student data
        const studentsData = [
          { id: 's1', studentNumber: '20210001', firstName: 'Ali', lastName: 'Yılmaz', email: 'ali.yilmaz@ogrenci.edu.tr' },
          { id: 's2', studentNumber: '20210002', firstName: 'Ayşe', lastName: 'Kaya', email: 'ayse.kaya@ogrenci.edu.tr' },
          { id: 's3', studentNumber: '20210003', firstName: 'Mehmet', lastName: 'Demir', email: 'mehmet.demir@ogrenci.edu.tr' },
          { id: 's4', studentNumber: '20210004', firstName: 'Zeynep', lastName: 'Şahin', email: 'zeynep.sahin@ogrenci.edu.tr' },
          { id: 's5', studentNumber: '20210005', firstName: 'Mustafa', lastName: 'Öztürk', email: 'mustafa.ozturk@ogrenci.edu.tr' }
        ]
        
        // Mock attendance data
        const attendanceData = [
          {
            id: 'session1',
            date: new Date(2025, 6, 1),
            type: 'regular',
            students: [
              { studentId: 's1', status: 'present' },
              { studentId: 's2', status: 'absent' },
              { studentId: 's3', status: 'present' },
              { studentId: 's4', status: 'excused' },
              { studentId: 's5', status: 'present' }
            ]
          },
          {
            id: 'session2',
            date: new Date(2025, 6, 8),
            type: 'regular',
            students: [
              { studentId: 's1', status: 'present' },
              { studentId: 's2', status: 'present' },
              { studentId: 's3', status: 'present' },
              { studentId: 's4', status: 'absent' },
              { studentId: 's5', status: 'present' }
            ]
          },
          {
            id: 'session3',
            date: new Date(2025, 6, 15),
            type: 'makeup',
            students: [
              { studentId: 's1', status: 'present' },
              { studentId: 's2', status: 'present' },
              { studentId: 's3', status: 'present' },
              { studentId: 's4', status: 'present' },
              { studentId: 's5', status: 'excused' }
            ]
          }
        ]
        
        setCourse(courseData)
        setStudents(studentsData)
        setAttendanceData(attendanceData)
        setSelectedStudents(studentsData.map(s => s.id))
        setSelectAll(true)
        
      } catch (error) {
        console.error('Error loading data:', error)
        showError('Veri yüklenirken bir hata oluştu.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [courseId])
  
  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }
  
  const handleDateRangeClear = () => {
    setDateRange({ startDate: null, endDate: null })
  }
  
  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedStudents(students.map(s => s.id))
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
  
  const handleExport = (format) => {
    try {
      // Filter attendance data by date range
      let filteredData = [...attendanceData]
      
      if (dateRange.startDate && dateRange.endDate) {
        const startDate = new Date(dateRange.startDate)
        const endDate = new Date(dateRange.endDate)
        
        // Set time to midnight for proper comparison
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        
        filteredData = filteredData.filter(session => {
          const sessionDate = new Date(session.date)
          return sessionDate >= startDate && sessionDate <= endDate
        })
      }
      
      // Filter attendance data by selected students
      filteredData = filteredData.map(session => ({
        ...session,
        students: session.students.filter(s => selectedStudents.includes(s.studentId))
      }))
      
      // Generate student attendance summary
      const studentSummary = students
        .filter(student => selectedStudents.includes(student.id))
        .map(student => {
          const studentAttendance = filteredData.map(session => {
            const record = session.students.find(s => s.studentId === student.id)
            return {
              sessionId: session.id,
              date: session.date,
              type: session.type,
              status: record ? record.status : 'unknown'
            }
          })
          
          const presentCount = studentAttendance.filter(a => a.status === 'present').length
          const absentCount = studentAttendance.filter(a => a.status === 'absent').length
          const excusedCount = studentAttendance.filter(a => a.status === 'excused').length
          const lateCount = studentAttendance.filter(a => a.status === 'late').length
          const totalSessions = filteredData.length
          const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0
          
          return {
            ...student,
            presentCount,
            absentCount,
            excusedCount,
            lateCount,
            totalSessions,
            attendanceRate,
            sessions: studentAttendance
          }
        })
      
      // Export based on report type
      if (reportType === 'summary') {
        // Export summary report
        const fileName = `${course.code.toLowerCase()}-yoklama-ozeti.${format}`
        
        if (format === 'pdf') {
          // Create PDF document
          const doc = new window.jsPDF()
          
          // Add title
          doc.setFontSize(18)
          doc.text(`${course.code} - Yoklama Özeti`, 14, 22)
          
          // Add course info
          doc.setFontSize(12)
          doc.text(`Ders: ${course.code} - ${course.name}`, 14, 32)
          doc.text(`Şube: ${course.section || '-'}`, 14, 38)
          doc.text(`Derslik: ${course.classroom || '-'}`, 14, 44)
          
          // Add date range
          if (dateRange.startDate && dateRange.endDate) {
            doc.setFontSize(10)
            doc.text(`Tarih Aralığı: ${formatDate(dateRange.startDate, 'dd.MM.yyyy')} - ${formatDate(dateRange.endDate, 'dd.MM.yyyy')}`, 14, 52)
          }
          
          // Add generation date
          doc.setFontSize(10)
          doc.text(`Oluşturulma Tarihi: ${formatDate(new Date(), 'dd.MM.yyyy HH:mm')}`, 14, 58)
          
          // Add table
          const tableData = studentSummary.map(student => [
            student.studentNumber,
            `${student.firstName} ${student.lastName}`,
            student.presentCount,
            student.absentCount,
            student.excusedCount,
            student.lateCount,
            `%${student.attendanceRate}`
          ])
          
          doc.autoTable({
            startY: 65,
            head: [['Öğrenci No', 'Ad Soyad', 'Var', 'Yok', 'Mazeretli', 'Geç', 'Katılım']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [66, 139, 202] }
          })
          
          // Save the PDF
          doc.save(fileName)
        } else {
          // Export as Excel
          exportAttendance('excel', {
            type: 'summary',
            students: studentSummary
          }, {
            fileName,
            courseInfo: course,
            dateRange
          })
        }
      } else {
        // Export detailed report
        const fileName = `${course.code.toLowerCase()}-yoklama-detay.${format}`
        
        exportAttendance(format, {
          type: 'detailed',
          students: studentSummary,
          sessions: filteredData
        }, {
          fileName,
          courseInfo: course,
          dateRange
        })
      }
      
      showSuccess(`${format.toUpperCase()} formatında dışa aktarma tamamlandı.`)
    } catch (error) {
      console.error('Error exporting report:', error)
      showError('Dışa aktarma sırasında bir hata oluştu.')
    }
  }
  
  const calculateStudentStats = () => {
    if (!students.length || !attendanceData.length) return null
    
    // Filter attendance data by date range
    let filteredData = [...attendanceData]
    
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      
      // Set time to midnight for proper comparison
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      
      filteredData = filteredData.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= startDate && sessionDate <= endDate
      })
    }
    
    // Calculate statistics
    const totalSessions = filteredData.length
    const totalStudents = students.length
    
    // Calculate attendance rates
    const studentStats = students.map(student => {
      const presentCount = filteredData.reduce((count, session) => {
        const record = session.students.find(s => s.studentId === student.id)
        return count + (record && record.status === 'present' ? 1 : 0)
      }, 0)
      
      const absentCount = filteredData.reduce((count, session) => {
        const record = session.students.find(s => s.studentId === student.id)
        return count + (record && record.status === 'absent' ? 1 : 0)
      }, 0)
      
      const excusedCount = filteredData.reduce((count, session) => {
        const record = session.students.find(s => s.studentId === student.id)
        return count + (record && record.status === 'excused' ? 1 : 0)
      }, 0)
      
      const lateCount = filteredData.reduce((count, session) => {
        const record = session.students.find(s => s.studentId === student.id)
        return count + (record && record.status === 'late' ? 1 : 0)
      }, 0)
      
      const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0
      
      return {
        ...student,
        presentCount,
        absentCount,
        excusedCount,
        lateCount,
        attendanceRate
      }
    })
    
    // Calculate overall statistics
    const overallStats = {
      totalSessions,
      totalStudents,
      averageAttendanceRate: Math.round(
        studentStats.reduce((sum, student) => sum + student.attendanceRate, 0) / totalStudents
      )
    }
    
    return {
      studentStats,
      overallStats
    }
  }
  
  const stats = calculateStudentStats()
  
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yoklama Raporu</h1>
            {course && (
              <p className="text-gray-600">
                {course.code} - {course.name} | Şube: {course.section}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="card mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rapor Ayarları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Aralığı</label>
                    <DateRangeFilter 
                      onApply={handleDateRangeApply}
                      onClear={handleDateRangeClear}
                    />
                    {dateRange.startDate && dateRange.endDate && (
                      <p className="text-sm text-gray-600 mt-2">
                        Seçili Aralık: {formatDate(dateRange.startDate, 'dd.MM.yyyy')} - {formatDate(dateRange.endDate, 'dd.MM.yyyy')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rapor Türü</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="reportType"
                          value="summary"
                          checked={reportType === 'summary'}
                          onChange={() => setReportType('summary')}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span>Özet Rapor</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="reportType"
                          value="detailed"
                          checked={reportType === 'detailed'}
                          onChange={() => setReportType('detailed')}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span>Detaylı Rapor</span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {reportType === 'summary' 
                        ? 'Özet rapor, her öğrencinin toplam devam durumunu gösterir.' 
                        : 'Detaylı rapor, her öğrencinin her dersteki devam durumunu gösterir.'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Öğrenci Seçimi</label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>Tümünü Seç ({students.length} öğrenci)</span>
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {students.map(student => (
                      <div key={student.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span>{student.studentNumber} - {student.firstName} {student.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleExport('excel')}
                    className="btn btn-secondary"
                    disabled={selectedStudents.length === 0}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Excel
                  </button>
                  
                  <button
                    onClick={() => handleExport('pdf')}
                    className="btn btn-secondary"
                    disabled={selectedStudents.length === 0}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF
                  </button>
                </div>
              </div>

              {/* Statistics */}
              {stats && (
                <div className="card mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Yoklama İstatistikleri</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-900">{stats.overallStats.totalSessions}</div>
                      <div className="text-sm text-blue-700">Toplam Ders</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-900">{stats.overallStats.totalStudents}</div>
                      <div className="text-sm text-green-700">Toplam Öğrenci</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-900">%{stats.overallStats.averageAttendanceRate}</div>
                      <div className="text-sm text-purple-700">Ortalama Katılım</div>
                    </div>
                  </div>
                  
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.studentStats.map(student => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.studentNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.firstName} {student.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.presentCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.absentCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.excusedCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      student.attendanceRate >= 80 ? 'bg-green-500' : 
                                      student.attendanceRate >= 60 ? 'bg-yellow-500' : 
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${student.attendanceRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">%{student.attendanceRate}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AttendanceReportPage