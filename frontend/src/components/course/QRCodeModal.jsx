import React, { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'

const QRCodeModal = ({ isOpen, onClose, session, course }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    if (isOpen && session) {
      generateQRCode()
      startTimer()
    }
  }, [isOpen, session])

  const generateQRCode = async () => {
    try {
      setIsLoading(true)
      
      // In demo mode, simulate QR code generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a mock QR code URL (in real app, this would be from backend)
      const qrData = {
        sessionId: session.id,
        courseId: course.id,
        timestamp: Date.now()
      }
      
      // Using a QR code generator service (placeholder URL)
      const qrCodeData = `attendance://join?session=${session.id}&course=${course.id}&token=${btoa(JSON.stringify(qrData))}`
      const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}`
      
      setQrCodeUrl(qrCodeImageUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startTimer = () => {
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setSessionTime(elapsed)
    }, 1000)

    // Cleanup timer when modal closes
    return () => clearInterval(timer)
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleRefreshQR = () => {
    generateQRCode()
  }

  const handleCopyLink = () => {
    const qrData = `attendance://join?session=${session.id}&course=${course.id}&token=${btoa(JSON.stringify({ sessionId: session.id, courseId: course.id, timestamp: Date.now() }))}`
    navigator.clipboard.writeText(qrData).then(() => {
      // Show success message
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QR Kod - Yoklama"
      size="medium"
    >
      <div className="space-y-6">
        {/* Session Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                {course?.code} - {course?.name}
              </h3>
              <p className="text-sm text-blue-700">
                Şube: {course?.section} | Derslik: {course?.classroom}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Ders Türü: {session?.type === 'makeup' ? 'Telafi Dersi' : 'Normal Ders'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900">
                {formatTime(sessionTime)}
              </div>
              <div className="text-xs text-blue-700">Geçen Süre</div>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600">QR kod oluşturuluyor...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-64 h-64 mx-auto"
                  onError={() => {
                    // Fallback if QR code fails to load
                    setQrCodeUrl('/placeholder-qr.png')
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  Öğrenciler bu QR kodu okutarak yoklamaya katılabilir
                </p>
                <p className="text-sm text-gray-600">
                  QR kod her 5 dakikada bir otomatik olarak yenilenir
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleRefreshQR}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            QR Kodu Yenile
          </button>
          
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Linki Kopyala
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Öğrenciler için talimatlar:</h4>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Mobil uygulamayı açın</li>
            <li>QR kod okuyucuyu kullanın</li>
            <li>Bu QR kodu okutun</li>
            <li>Yoklama otomatik olarak kaydedilecektir</li>
          </ol>
        </div>

        {/* Session Notes */}
        {session?.notes && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Ders Notları:</h4>
            <p className="text-sm text-gray-700">{session.notes}</p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4">
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

export default QRCodeModal