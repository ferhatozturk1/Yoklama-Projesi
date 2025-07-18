import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCalendar } from '../../context/CalendarContext'
import { showError, showSuccess, showWarning } from './ToastNotification'
import Modal from './Modal'
import LoadingSpinner from './LoadingSpinner'

const ClassStartButton = ({ course, onStartClass }) => {
  const navigate = useNavigate()
  const { canStartClass } = useCalendar()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [classType, setClassType] = useState('regular')

  const handleClick = (e) => {
    e.stopPropagation()
    
    // Check if class can be started
    const checkResult = canStartClass(new Date(), course.schedule)
    
    if (!checkResult.allowed) {
      showWarning(checkResult.reason)
      return
    }
    
    // Open modal to select class type
    setIsModalOpen(true)
  }

  const handleStartClass = async () => {
    try {
      setIsLoading(true)
      
      // In demo mode, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the parent component's handler
      if (onStartClass) {
        onStartClass(course.id, classType)
      }
      
      showSuccess(`${classType === 'regular' ? 'Normal' : 'Telafi'} dersi başlatıldı!`)
      setIsModalOpen(false)
      
      // Navigate to course detail page
      navigate(`/course/${course.id}`)
      
    } catch (error) {
      console.error('Error starting class:', error)
      showError('Ders başlatılırken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        className="flex-1 btn btn-secondary text-sm py-2"
        onClick={handleClick}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Yoklama
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ders Başlat"
        size="small"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>{course.code}</strong> - {course.name} dersi için yoklama başlatmak üzeresiniz.
          </p>

          <div className="form-group">
            <label className="form-label">Ders Türü</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="classType"
                  value="regular"
                  checked={classType === 'regular'}
                  onChange={() => setClassType('regular')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span>Normal Ders</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="classType"
                  value="makeup"
                  checked={classType === 'makeup'}
                  onChange={() => setClassType('makeup')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span>Telafi Dersi</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Bilgi:</strong> Yoklama başlattığınızda, öğrenciler QR kodu okutarak derse katılım sağlayabileceklerdir.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleStartClass}
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
    </>
  )
}

export default ClassStartButton