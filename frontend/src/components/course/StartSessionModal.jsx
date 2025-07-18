import React, { useState } from 'react'
import { useCalendar } from '../../context/CalendarContext'
import { canStartClass } from '../../utils/calendarRestrictions'
import { showError, showSuccess, showWarning } from '../common/ToastNotification'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'

const StartSessionModal = ({ isOpen, onClose, course, onStartSession }) => {
  const { holidays, examPeriods, semesterDates } = useCalendar()
  const [sessionType, setSessionType] = useState('regular')
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const handleStartSession = async () => {
    try {
      // Check if class can be started
      const checkResult = canStartClass(
        new Date(),
        course?.schedule,
        holidays,
        examPeriods,
        semesterDates
      )
      
      if (!checkResult.allowed && sessionType === 'regular') {
        showWarning(checkResult.reason)
        return
      }
      
      setIsLoading(true)
      
      // In demo mode, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create session data
      const sessionData = {
        id: `session-${Date.now()}`,
        courseId: course.id,
        type: sessionType,
        date: new Date(),
        notes: notes,
        status: 'active'
      }
      
      // Call the parent component's handler
      if (onStartSession) {
        onStartSession(sessionData)
      }
      
      showSuccess(`${sessionType === 'regular' ? 'Normal' : 'Telafi'} dersi başlatıldı!`)
      onClose()
      
    } catch (error) {
      console.error('Error starting session:', error)
      showError('Ders başlatılırken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ders Başlat"
      size="small"
    >
      <div className="space-y-6">
        {course && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-1">{course.code} - {course.name}</h3>
            <p className="text-sm text-blue-700">
              Şube: {course.section} | Derslik: {course.classroom}
            </p>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Ders Türü</label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sessionType"
                value="regular"
                checked={sessionType === 'regular'}
                onChange={() => setSessionType('regular')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span>Normal Ders</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sessionType"
                value="makeup"
                checked={sessionType === 'makeup'}
                onChange={() => setSessionType('makeup')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span>Telafi Dersi</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notlar (İsteğe Bağlı)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
            rows="3"
            placeholder="Ders hakkında notlar..."
          />
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Bilgi:</strong> Ders başlatıldığında, öğrenciler QR kodu okutarak yoklamaya katılabileceklerdir.
            {sessionType === 'makeup' && ' Telafi dersi olarak işaretlenecektir.'}
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleStartSession}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                Başlatılıyor...
              </div>
            ) : (
              'Dersi Başlat'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default StartSessionModal