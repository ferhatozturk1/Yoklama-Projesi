import React, { useState, useEffect } from 'react'
import { showError, showSuccess, showWarning } from '../common/ToastNotification'
import LoadingSpinner from '../common/LoadingSpinner'

const SessionControls = ({ session, onEndSession, onPauseSession, onResumeSession }) => {
  const [sessionTime, setSessionTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [isPausing, setIsPausing] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)
  
  useEffect(() => {
    if (!session) return
    
    const startTime = new Date(session.date).getTime()
    let intervalId
    
    if (!isPaused) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setSessionTime(elapsed)
        
        // Calculate time left if auto-end is enabled
        if (session.autoEndSession && session.endTime) {
          const endTime = new Date(session.endTime).getTime()
          const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000))
          setTimeLeft(remaining)
          
          // Auto-end the session when time is up
          if (remaining <= 0 && onEndSession) {
            clearInterval(intervalId)
            onEndSession()
          }
        }
      }, 1000)
    }
    
    return () => clearInterval(intervalId)
  }, [session, isPaused, onEndSession])
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleEndSession = async () => {
    if (!window.confirm('Dersi sonlandırmak istediğinizden emin misiniz?')) {
      return
    }
    
    try {
      setIsEnding(true)
      
      // In demo mode, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onEndSession) {
        onEndSession()
      }
      
      showSuccess('Ders başarıyla sonlandırıldı.')
    } catch (error) {
      console.error('Error ending session:', error)
      showError('Ders sonlandırılırken bir hata oluştu.')
    } finally {
      setIsEnding(false)
    }
  }
  
  const handlePauseSession = async () => {
    try {
      setIsPausing(true)
      
      // In demo mode, simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setIsPaused(true)
      
      if (onPauseSession) {
        onPauseSession()
      }
      
      showSuccess('Ders duraklatıldı.')
    } catch (error) {
      console.error('Error pausing session:', error)
      showError('Ders duraklatılırken bir hata oluştu.')
    } finally {
      setIsPausing(false)
    }
  }
  
  const handleResumeSession = async () => {
    try {
      setIsResuming(true)
      
      // In demo mode, simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setIsPaused(false)
      
      if (onResumeSession) {
        onResumeSession()
      }
      
      showSuccess('Ders devam ediyor.')
    } catch (error) {
      console.error('Error resuming session:', error)
      showError('Ders devam ettirilirken bir hata oluştu.')
    } finally {
      setIsResuming(false)
    }
  }
  
  if (!session) return null
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className={`w-3 h-3 rounded-full mr-2 ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></div>
          <span className="font-medium text-blue-900">
            {isPaused ? 'Ders Duraklatıldı' : 'Ders Devam Ediyor'}
          </span>
          <span className="ml-3 text-blue-800 font-bold">
            {formatTime(sessionTime)}
          </span>
          {timeLeft !== null && (
            <span className="ml-3 text-sm text-blue-700">
              (Kalan: {formatTime(timeLeft)})
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isPaused ? (
            <button
              className="btn btn-secondary"
              onClick={handleResumeSession}
              disabled={isResuming}
            >
              {isResuming ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  <span>Devam Ettiriliyor...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  <span>Devam Ettir</span>
                </div>
              )}
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={handlePauseSession}
              disabled={isPausing}
            >
              {isPausing ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  <span>Duraklatılıyor...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Duraklat</span>
                </div>
              )}
            </button>
          )}
          
          <button
            className="btn btn-danger"
            onClick={handleEndSession}
            disabled={isEnding}
          >
            {isEnding ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                <span>Sonlandırılıyor...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Dersi Sonlandır</span>
              </div>
            )}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={() => window.dispatchEvent(new CustomEvent('show-qr-code'))}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>QR Kodu</span>
            </div>
          </button>
        </div>
      </div>
      
      {session.type === 'makeup' && (
        <div className="mt-2 text-sm text-blue-700">
          <span className="font-medium">Telafi Dersi</span> - {session.notes || 'Not eklenmemiş'}
        </div>
      )}
    </div>
  )
}

export default SessionControls