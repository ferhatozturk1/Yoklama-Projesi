import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import CourseDetailCard from '../components/course/CourseDetailCard'
import AttendanceTable from '../components/course/AttendanceTable'
import StartSessionModal from '../components/course/StartSessionModal'
import StudentUpload from '../components/course/StudentUpload'
import StudentList from '../components/course/StudentList'
import StudentEditModal from '../components/course/StudentEditModal'
import { useCalendar } from '../context/CalendarContext'
import { canStartClass } from '../utils/calendarRestrictions'
import { showError, showSuccess, showWarning } from '../components/common/ToastNotification'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Mock data service - would be replaced with API calls
const fetchCourseData = async (courseId) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    id: courseId,
    code: 'BIL101',
    name: 'Bilgisayar Programlama I',
    section: '1',
    classroom: 'A-201',
    status: 'active',
    description: 'Bu ders, programlama temellerini ve algoritma geliştirme becerilerini öğretmeyi amaçlamaktadır. Öğrenciler, temel programlama kavramlarını öğrenecek ve basit uygulamalar geliştireceklerdir.',
    schedule: {
      day: 'Pazartesi',
      startTime: '09:00',
      endTime: '11:00'
    },
    studentCount: 32,
    sessionsHeld: 8,
    attendanceRate: 85,
    makeupCount: 2,
    nextClass: 'Pazartesi, 09:00 - 11:00, A-201'
  }
}

const fetchStudents = async (courseId) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    { id: 's1', studentNumber: '20210001', firstName: 'Ali', lastName: 'Yılmaz', email: 'ali.yilmaz@ogrenci.edu.tr' },
    { id: 's2', studentNumber: '20210002', firstName: 'Ayşe', lastName: 'Kaya', email: 'ayse.kaya@ogrenci.edu.tr' },
    { id: 's3', studentNumber: '20210003', firstName: 'Mehmet', lastName: 'Demir', email: 'mehmet.demir@ogrenci.edu.tr' },
    { id: 's4', studentNumber: '20210004', firstName: 'Zeynep', lastName: 'Şahin', email: 'zeynep.sahin@ogrenci.edu.tr' },
    { id: 's5', studentNumber: '20210005', firstName: 'Mustafa', lastName: 'Öztürk', email: 'mustafa.ozturk@ogrenci.edu.tr' }
  ]
}

const fetchAttendanceData = async (sessionId) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  return [
    { studentId: 's1', status: 'present', timestamp: new Date() },
    { studentId: 's2', status: 'absent', timestamp: new Date() },
    { studentId: 's3', status: 'present', timestamp: new Date() },
    { studentId: 's4', status: 'excused', timestamp: new Date() }
  ]
}

const fetchAttendanceHistory = async (courseId) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    { 
      id: 'session1', 
      date: new Date(2025, 6, 1), 
      type: 'regular',
      presentCount: 28,
      absentCount: 3,
      excusedCount: 1
    },
    { 
      id: 'session2', 
      date: new Date(2025, 6, 8), 
      type: 'regular',
      presentCount: 25,
      absentCount: 5,
      excusedCount: 2
    },
    { 
      id: 'session3', 
      date: new Date(2025, 6, 15), 
      type: 'makeup',
      presentCount: 30,
      absentCount: 2,
      excusedCount: 0
    }
  ]
}

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { holidays, examPeriods, semesterDates } = useCalendar()
  
  const [course, setCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [activeTab, setActiveTab] = useState('students')
  const [isLoading, setIsLoading] = useState(true)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [activeSession, setActiveSession] = useState(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true)
        
        // Load course data
        const courseData = await fetchCourseData(courseId)
        setCourse(courseData)
        
        // Load students
        const studentsData = await fetchStudents(courseId)
        setStudents(studentsData)
        
        // Load attendance history
        const historyData = await fetchAttendanceHistory(courseId)
        setAttendanceHistory(historyData)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading course data:', error)
        showError('Ders bilgileri yüklenirken bir hata oluştu.')
        setIsLoading(false)
      }
    }
    
    loadCourseData()
  }, [courseId])
  
  const handleStartSession = (sessionData) => {
    setActiveSession(sessionData)
    // In a real app, we would save this to the backend
    showSuccess('Yoklama başlatıldı!')
    
    // Load empty attendance data for the new session
    setAttendanceData([])
    
    // Switch to the students tab
    setActiveTab('students')
  }
  
  const handleAttendanceUpdate = (studentId, status) => {
    // Update attendance data
    const existingIndex = attendanceData.findIndex(a => a.studentId === studentId)
    
    if (existingIndex >= 0) {
      // Update existing record
      const updatedData = [...attendanceData]
      updatedData[existingIndex] = {
        ...updatedData[existingIndex],
        status,
        timestamp: new Date()
      }
      setAttendanceData(updatedData)
    } else {
      // Add new record
      setAttendanceData([
        ...attendanceData,
        {
          studentId,
          status,
          timestamp: new Date()
        }
      ])
    }
    
    // In a real app, we would save this to the backend
  }
  
  const handleUploadComplete = (newStudents) => {
    // Add the new students to our list
    setStudents([...students, ...newStudents])
    setIsUploadModalOpen(false)
  }
  
  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }
  
  const handleDeleteStudent = (studentId) => {
    // Remove the student from our list
    setStudents(students.filter(s => s.id !== studentId))
    showSuccess('Öğrenci başarıyla silindi.')
  }
  
  const handleBulkAction = (action, studentIds) => {
    if (action === 'delete') {
      // Remove the students from our list
      setStudents(students.filter(s => !studentIds.includes(s.id)))
      showSuccess(`${studentIds.length} öğrenci başarıyla silindi.`)
    } else if (action === 'export') {
      // In a real app, we would export the students
      showSuccess(`${studentIds.length} öğrenci için dışa aktarma başlatıldı.`)
    }
  }
  
  const handleSaveStudent = (updatedStudent) => {
    if (selectedStudent) {
      // Update existing student
      setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s))
      showSuccess('Öğrenci bilgileri güncellendi.')
    } else {
      // Add new student
      setStudents([...students, updatedStudent])
      showSuccess('Yeni öğrenci eklendi.')
    }
    setIsEditModalOpen(false)
    setSelectedStudent(null)
  }
  
  const canStartClassNow = () => {
    if (!course?.schedule) return { allowed: false, reason: 'Ders programı bulunamadı.' }
    
    return canStartClass(
      new Date(),
      course.schedule,
      holidays,
      examPeriods,
      semesterDates
    )
  }
  
  const handleStartClassClick = () => {
    const checkResult = canStartClassNow()
    
    if (!checkResult.allowed) {
      showWarning(checkResult.reason)
      return
    }
    
    setIsSessionModalOpen(true)
  }
  
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )
    }
    
    switch (activeTab) {
      case 'students':
        return (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Öğrenci Listesi</h3>
              <div className="flex space-x-2">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Liste Yükle
                </button>
                {activeSession && (
                  <button className="btn btn-primary">
                    QR Kodu Göster
                  </button>
                )}
              </div>
            </div>
            
            {activeSession ? (
              <AttendanceTable 
                students={students}
                attendanceData={attendanceData}
                onAttendanceUpdate={handleAttendanceUpdate}
                isLoading={false}
              />
            ) : students.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg font-medium mb-2">Öğrenci listesi yüklenmemiş</p>
                <p className="text-sm">Excel veya PDF dosyası yükleyerek öğrenci listesini ekleyin</p>
              </div>
            ) : (
              <StudentList 
                students={students}
                isLoading={false}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onBulkAction={handleBulkAction}
              />
            )}
          </div>
        )
        
      case 'history':
        return (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Yoklama Geçmişi</h3>
            
            {attendanceHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium mb-2">Henüz yoklama kaydı yok</p>
                <p className="text-sm">Ders başlattığınızda yoklama kayıtları burada görünecektir</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
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
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceHistory.map(session => (
                      <tr key={session.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.date.toLocaleDateString('tr-TR')}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Görüntüle
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
        
      case 'reports':
        return (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Raporlar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Devam Durumu Raporu</h4>
                <p className="text-gray-600 mb-4">
                  Tüm öğrencilerin devam durumunu gösteren detaylı rapor.
                </p>
                <button className="btn btn-secondary">
                  PDF İndir
                </button>
              </div>
              
              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Haftalık Yoklama Özeti</h4>
                <p className="text-gray-600 mb-4">
                  Haftalık bazda yoklama istatistiklerini içeren özet rapor.
                </p>
                <button className="btn btn-secondary">
                  Excel İndir
                </button>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  if (isLoading && !course) {
    return (
      <Layout showSidebar={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center py-24">
              <LoadingSpinner size="large" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ders Detayı</h1>
              <p className="text-gray-600">
                Ders ID: {courseId}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button 
                className="btn btn-primary"
                onClick={handleStartClassClick}
              >
                Yoklama Başlat
              </button>
            </div>
          </div>

          {/* Course Info Card */}
          {course && <CourseDetailCard course={course} />}

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                <button 
                  className={`border-b-2 py-2 px-1 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'students' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('students')}
                >
                  Öğrenci Listesi
                </button>
                <button 
                  className={`border-b-2 py-2 px-1 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'history' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  Yoklama Geçmişi
                </button>
                <button 
                  className={`border-b-2 py-2 px-1 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'reports' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('reports')}
                >
                  Raporlar
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
      
      {/* Modals */}
      {course && (
        <StartSessionModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          course={course}
          onStartSession={handleStartSession}
        />
      )}
      
      <StudentUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        courseId={courseId}
        onUploadComplete={handleUploadComplete}
      />
      
      <StudentEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedStudent(null)
        }}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />
    </Layout>
  )
}

export default CourseDetail