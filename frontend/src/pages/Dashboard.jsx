import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTimeBasedGreeting, getMotivationalMessage, formatDate } from '../utils/dateHelpers'
import Layout from '../components/layout/Layout'
import WeeklySummary from '../components/dashboard/WeeklySummary'
import CourseGrid from '../components/dashboard/CourseGrid'
import CourseFilter from '../components/dashboard/CourseFilter'
import CourseCreateModal from '../components/dashboard/CourseCreateModal'
import AcademicCalendar from '../components/dashboard/AcademicCalendar'
import CalendarEvents from '../components/dashboard/CalendarEvents'
import WeeklyScheduleTable from '../components/dashboard/WeeklyScheduleTable'
import { showSuccess } from '../components/common/ToastNotification'

const Dashboard = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([
    {
      id: '1',
      code: 'BIL101',
      name: 'Bilgisayar Programlama I',
      section: '1',
      classroom: 'A-201',
      status: 'active',
      studentCount: 32,
      sessionsHeld: 8,
      attendanceRate: 85,
      schedule: {
        day: 'Pazartesi',
        startTime: '09:00',
        endTime: '11:00'
      },
      nextClass: '25 Kasım 2024, Pazartesi 09:00',
      semester: '2024-fall'
    },
    {
      id: '2',
      code: 'BIL102',
      name: 'Bilgisayar Programlama II',
      section: '2',
      classroom: 'A-202',
      status: 'active',
      studentCount: 28,
      sessionsHeld: 6,
      attendanceRate: 92,
      schedule: {
        day: 'Çarşamba',
        startTime: '13:00',
        endTime: '15:00'
      },
      nextClass: '27 Kasım 2024, Çarşamba 13:00',
      semester: '2024-fall'
    },
    {
      id: '3',
      code: 'MAT201',
      name: 'Matematik I',
      section: '1',
      classroom: 'B-101',
      status: 'active',
      studentCount: 25,
      sessionsHeld: 10,
      attendanceRate: 78,
      schedule: {
        day: 'Cuma',
        startTime: '10:00',
        endTime: '12:00'
      },
      nextClass: '29 Kasım 2024, Cuma 10:00',
      semester: '2024-fall'
    }
  ])
  const [schedule, setSchedule] = useState({}) // Demo schedule
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSemester, setFilterSemester] = useState('')
  
  const greeting = getTimeBasedGreeting()
  const motivationalMessage = getMotivationalMessage()
  const today = formatDate(new Date(), 'dd MMMM yyyy, EEEE')

  // Demo stats
  const stats = {
    weeklyClasses: 5,
    todayClasses: 2,
    makeupClasses: 1,
    totalStudents: 85,
    completedAttendance: 12,
    attendanceRate: 87
  }

  const handleScheduleUpdate = (newSchedule) => {
    setSchedule(newSchedule)
    showSuccess('Program başarıyla güncellendi!')
  }

  const handleCreateSchedule = () => {
    // Open schedule creation modal or redirect
    showSuccess('Program oluşturma özelliği yakında eklenecek!')
  }

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCourseSelect = (course) => {
    // Navigate to course detail page
    window.location.href = `/course/${course.id}`
  }

  const handleCreateCourse = (courseData) => {
    // Add the new course to the courses array
    setCourses([...courses, courseData])
  }

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {greeting}, {user?.title} {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 mb-1">{today}</p>
              <p className="text-blue-600 font-medium">{motivationalMessage}</p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {user?.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <WeeklySummary {...stats} />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-2">
            <WeeklyScheduleTable
              schedule={schedule}
              onScheduleUpdate={handleScheduleUpdate}
              onCreateSchedule={handleCreateSchedule}
            />
          </div>

          {/* Academic Calendar and Events */}
          <div className="lg:col-span-1 space-y-6">
            <AcademicCalendar />
            <CalendarEvents />
          </div>
        </div>

        {/* My Courses */}
        <div className="mt-8">
          <div className="card">
            <CourseFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterSemester={filterSemester}
              onSemesterChange={setFilterSemester}
              onAddCourse={() => setIsCreateModalOpen(true)}
            />
            
            <CourseGrid
              courses={courses}
              onCourseSelect={handleCourseSelect}
              searchTerm={searchTerm}
              filterSemester={filterSemester}
            />
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Başlangıç Adımları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                    1
                  </div>
                  <h3 className="font-medium text-gray-900">Profil Tamamla</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Profil bilgilerinizi tamamlayın ve akademik takvimi yükleyin.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Profile Git →
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                    2
                  </div>
                  <h3 className="font-medium text-gray-900">Ders Programı</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Haftalık ders programınızı oluşturun ve derslerinizi ekleyin.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Program Oluştur →
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                    3
                  </div>
                  <h3 className="font-medium text-gray-900">Öğrenci Listeleri</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Dersleriniz için öğrenci listelerini yükleyin.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Liste Yükle →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Create Modal */}
      <CourseCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourse={handleCreateCourse}
      />
    </Layout>
  )
}

export default Dashboard