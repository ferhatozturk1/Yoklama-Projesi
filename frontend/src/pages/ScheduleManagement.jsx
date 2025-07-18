import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import WeeklyScheduleTable from '../components/dashboard/WeeklyScheduleTable'
import ScheduleConflictChecker from '../components/dashboard/ScheduleConflictChecker'
import ScheduleExtension from '../components/dashboard/ScheduleExtension'
import { saveScheduleToStorage, loadScheduleFromStorage } from '../utils/scheduleExtension'
import { useAuth } from '../context/AuthContext'
import { showSuccess, showError } from '../components/common/ToastNotification'

const ScheduleManagement = () => {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState({
    monday: {
      '09:00': {
        id: '1',
        code: 'BIL101',
        name: 'Bilgisayar Programlama I',
        section: '1',
        classroom: 'A-201',
        schedule: {
          day: 'monday',
          startTime: '09:00',
          endTime: '11:00'
        }
      },
      '14:00': {
        id: '4',
        code: 'BIL201',
        name: 'Veri Yapıları',
        section: '1',
        classroom: 'A-301',
        schedule: {
          day: 'monday',
          startTime: '14:00',
          endTime: '16:00'
        }
      }
    },
    wednesday: {
      '13:00': {
        id: '2',
        code: 'BIL102',
        name: 'Bilgisayar Programlama II',
        section: '2',
        classroom: 'A-202',
        schedule: {
          day: 'wednesday',
          startTime: '13:00',
          endTime: '15:00'
        }
      }
    },
    friday: {
      '10:00': {
        id: '3',
        code: 'MAT201',
        name: 'Matematik I',
        section: '1',
        classroom: 'B-101',
        schedule: {
          day: 'friday',
          startTime: '10:00',
          endTime: '12:00'
        }
      }
    }
  })

  // Load schedule from storage on component mount
  useEffect(() => {
    if (user?.id) {
      const savedSchedule = loadScheduleFromStorage(user.id)
      if (savedSchedule) {
        setSchedule(savedSchedule)
      }
    }
  }, [user])

  const handleScheduleUpdate = (newSchedule) => {
    setSchedule(newSchedule)
    
    // Save to storage
    if (user?.id) {
      const saved = saveScheduleToStorage(user.id, newSchedule)
      if (saved) {
        showSuccess('Program başarıyla güncellendi ve kaydedildi!')
      } else {
        showSuccess('Program başarıyla güncellendi!')
        showError('Ancak yerel depolamaya kaydedilemedi.')
      }
    } else {
      showSuccess('Program başarıyla güncellendi!')
    }
  }

  const handleCreateSchedule = () => {
    // In a real implementation, this would open a modal or redirect to a creation page
    showSuccess('Program oluşturma özelliği yakında eklenecek!')
  }

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ders Programı Yönetimi</h1>
            <p className="text-gray-600">
              Haftalık ders programınızı oluşturun ve yönetin
            </p>
          </div>

          {/* Weekly Schedule Table */}
          <div className="mb-8">
            <WeeklyScheduleTable
              schedule={schedule}
              onScheduleUpdate={handleScheduleUpdate}
              onCreateSchedule={handleCreateSchedule}
            />
          </div>

          {/* Schedule Conflict Checker */}
          <div className="mb-8">
            <ScheduleConflictChecker schedule={schedule} />
          </div>

          {/* Schedule Extension */}
          <div className="mb-8">
            <ScheduleExtension schedule={schedule} />
          </div>

          {/* Schedule Tips */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Program Oluşturma İpuçları</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dengeli Program</h4>
                  <p className="text-sm text-gray-600">
                    Dersleri haftanın farklı günlerine dağıtarak daha dengeli bir program oluşturun.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Ara Süresi</h4>
                  <p className="text-sm text-gray-600">
                    Ardışık dersler arasında en az 15 dakika ara bırakın.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Akademik Takvim</h4>
                  <p className="text-sm text-gray-600">
                    Resmi tatil ve sınav dönemlerini dikkate alarak programınızı oluşturun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ScheduleManagement