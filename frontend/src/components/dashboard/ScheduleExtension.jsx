import React, { useState } from 'react'
import { useCalendar } from '../../context/CalendarContext'
import { extendScheduleToSemester, generateScheduleSummary, exportScheduleToICalendar } from '../../utils/scheduleExtension'
import { formatDate } from '../../utils/dateHelpers'
import { showSuccess, showError } from '../common/ToastNotification'
import LoadingSpinner from '../common/LoadingSpinner'

const ScheduleExtension = ({ schedule }) => {
  const { holidays, examPeriods, semesterDates } = useCalendar()
  const [isLoading, setIsLoading] = useState(false)
  const [semesterClasses, setSemesterClasses] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [scheduleSummary, setScheduleSummary] = useState(null)

  const handleGenerateSchedule = () => {
    try {
      setIsLoading(true)
      
      // Generate schedule summary
      const summary = generateScheduleSummary(schedule)
      setScheduleSummary(summary)
      
      // Extend schedule to semester
      const startDate = new Date(semesterDates.startDate)
      const endDate = new Date(semesterDates.endDate)
      
      const extendedSchedule = extendScheduleToSemester(
        schedule,
        startDate,
        endDate,
        holidays,
        examPeriods
      )
      
      setSemesterClasses(extendedSchedule)
      setShowPreview(true)
      
      showSuccess('Dönem programı başarıyla oluşturuldu!')
    } catch (error) {
      console.error('Error generating schedule:', error)
      showError('Program oluşturulurken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportICalendar = () => {
    try {
      if (semesterClasses.length === 0) {
        showError('Önce dönem programını oluşturun.')
        return
      }
      
      // Generate iCalendar content
      const icalContent = exportScheduleToICalendar(semesterClasses, 'Akademik Dönem Programı')
      
      // Create blob and download
      const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ders_programi.ics'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showSuccess('Program başarıyla dışa aktarıldı!')
    } catch (error) {
      console.error('Error exporting schedule:', error)
      showError('Program dışa aktarılırken bir hata oluştu.')
    }
  }

  const handleExportCSV = () => {
    try {
      if (semesterClasses.length === 0) {
        showError('Önce dönem programını oluşturun.')
        return
      }
      
      // Generate CSV content
      const headers = ['Tarih', 'Gün', 'Başlangıç', 'Bitiş', 'Ders Kodu', 'Ders Adı', 'Şube', 'Derslik']
      const rows = semesterClasses.map(classItem => [
        formatDate(classItem.date),
        new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(classItem.date),
        classItem.startTime,
        classItem.endTime,
        classItem.code,
        classItem.name,
        classItem.section,
        classItem.classroom
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ders_programi.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showSuccess('Program başarıyla dışa aktarıldı!')
    } catch (error) {
      console.error('Error exporting schedule:', error)
      showError('Program dışa aktarılırken bir hata oluştu.')
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Dönem Programı</h3>
      
      <div className="space-y-6">
        {/* Schedule Summary */}
        {scheduleSummary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm font-medium text-blue-800">Toplam Ders</p>
              <p className="text-2xl font-bold text-blue-900">{scheduleSummary.totalCourses}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm font-medium text-green-800">Toplam Saat</p>
              <p className="text-2xl font-bold text-green-900">{scheduleSummary.totalHours}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm font-medium text-purple-800">Pazartesi</p>
              <p className="text-2xl font-bold text-purple-900">{scheduleSummary.coursesByDay.monday}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-sm font-medium text-yellow-800">Çarşamba</p>
              <p className="text-2xl font-bold text-yellow-900">{scheduleSummary.coursesByDay.wednesday}</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg text-center">
              <p className="text-sm font-medium text-pink-800">Cuma</p>
              <p className="text-2xl font-bold text-pink-900">{scheduleSummary.coursesByDay.friday}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {!showPreview && (
          <div className="flex justify-center">
            <button
              onClick={handleGenerateSchedule}
              className="btn btn-primary"
              disabled={isLoading || Object.keys(schedule).length === 0}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  Oluşturuluyor...
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Dönem Programı Oluştur
                </>
              )}
            </button>
          </div>
        )}

        {/* Schedule Preview */}
        {showPreview && semesterClasses.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Dönem Programı Önizleme</h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Derslik
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {semesterClasses.slice(0, 10).map((classItem) => (
                    <tr key={classItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(classItem.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {classItem.startTime} - {classItem.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {classItem.code} - {classItem.name} (Şube: {classItem.section})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {classItem.classroom}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {semesterClasses.length > 10 && (
              <p className="text-sm text-gray-600 text-center">
                ... ve {semesterClasses.length - 10} ders daha
              </p>
            )}

            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                onClick={handleExportICalendar}
                className="btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                iCalendar Olarak İndir
              </button>
              <button
                onClick={handleExportCSV}
                className="btn btn-secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV Olarak İndir
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-lg mt-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Bilgi:</h4>
          <p className="text-sm text-blue-600">
            Bu araç, haftalık programınızı tüm akademik döneme yayar ve takvim uygulamalarına aktarmanız için iCalendar formatında dışa aktarmanızı sağlar.
            Resmi tatiller ve sınav dönemleri otomatik olarak hariç tutulur.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScheduleExtension