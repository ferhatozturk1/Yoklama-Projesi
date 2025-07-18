import { useCallback } from 'react'
import { showSuccess, showError, showWarning, showInfo, showCustomToast } from '../components/common/ToastNotification'

/**
 * Custom hook for managing notifications
 * 
 * @returns {Object} - Notification functions
 */
const useNotification = () => {
  // Success notification
  const notifySuccess = useCallback((message, options = {}) => {
    showSuccess(message, options)
  }, [])

  // Error notification
  const notifyError = useCallback((error, options = {}) => {
    let message = 'Bir hata oluştu'
    
    if (typeof error === 'string') {
      message = error
    } else if (error?.message) {
      message = error.message
    } else if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error?.response?.statusText) {
      message = error.response.statusText
    }
    
    showError(message, options)
  }, [])

  // Warning notification
  const notifyWarning = useCallback((message, options = {}) => {
    showWarning(message, options)
  }, [])

  // Info notification
  const notifyInfo = useCallback((message, options = {}) => {
    showInfo(message, options)
  }, [])

  // Custom notification
  const notify = useCallback((message, type = 'info', options = {}) => {
    switch (type) {
      case 'success':
        notifySuccess(message, options)
        break
      case 'error':
        notifyError(message, options)
        break
      case 'warning':
        notifyWarning(message, options)
        break
      case 'info':
        notifyInfo(message, options)
        break
      default:
        showCustomToast(message, { type, ...options })
    }
  }, [notifySuccess, notifyError, notifyWarning, notifyInfo])

  // API error handler
  const handleApiError = useCallback((error, customMessage = null) => {
    console.error('API Error:', error)
    
    let message = customMessage
    
    if (!message) {
      if (error?.response?.status === 401) {
        message = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.'
      } else if (error?.response?.status === 403) {
        message = 'Bu işlem için yetkiniz bulunmuyor.'
      } else if (error?.response?.status === 404) {
        message = 'İstenen kaynak bulunamadı.'
      } else if (error?.response?.status === 422) {
        message = 'Gönderilen veriler geçersiz.'
      } else if (error?.response?.status >= 500) {
        message = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
      } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
        message = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
      } else {
        message = error?.response?.data?.message || error?.message || 'Bilinmeyen bir hata oluştu'
      }
    }
    
    notifyError(message)
    return message
  }, [notifyError])

  // Form validation error handler
  const handleValidationErrors = useCallback((errors) => {
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        notifyError(typeof error === 'string' ? error : error.message)
      })
    } else if (typeof errors === 'object') {
      Object.values(errors).forEach(error => {
        if (Array.isArray(error)) {
          error.forEach(err => notifyError(err))
        } else {
          notifyError(error)
        }
      })
    } else {
      notifyError(errors)
    }
  }, [notifyError])

  // Operation feedback
  const notifyOperation = useCallback((operation, status, customMessages = {}) => {
    const defaultMessages = {
      create: {
        loading: 'Oluşturuluyor...',
        success: 'Başarıyla oluşturuldu',
        error: 'Oluşturulurken hata oluştu'
      },
      update: {
        loading: 'Güncelleniyor...',
        success: 'Başarıyla güncellendi',
        error: 'Güncellenirken hata oluştu'
      },
      delete: {
        loading: 'Siliniyor...',
        success: 'Başarıyla silindi',
        error: 'Silinirken hata oluştu'
      },
      save: {
        loading: 'Kaydediliyor...',
        success: 'Başarıyla kaydedildi',
        error: 'Kaydedilirken hata oluştu'
      },
      upload: {
        loading: 'Yükleniyor...',
        success: 'Başarıyla yüklendi',
        error: 'Yüklenirken hata oluştu'
      },
      download: {
        loading: 'İndiriliyor...',
        success: 'Başarıyla indirildi',
        error: 'İndirilirken hata oluştu'
      },
      send: {
        loading: 'Gönderiliyor...',
        success: 'Başarıyla gönderildi',
        error: 'Gönderilirken hata oluştu'
      }
    }

    const messages = { ...defaultMessages[operation], ...customMessages }
    const message = messages[status]

    if (message) {
      switch (status) {
        case 'success':
          notifySuccess(message)
          break
        case 'error':
          notifyError(message)
          break
        case 'loading':
          notifyInfo(message)
          break
        default:
          notify(message, status)
      }
    }
  }, [notifySuccess, notifyError, notifyInfo, notify])

  // Batch operation feedback
  const notifyBatchOperation = useCallback((results, operation = 'işlem') => {
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    const total = results.length

    if (failed === 0) {
      notifySuccess(`Tüm ${operation}ler başarıyla tamamlandı (${successful}/${total})`)
    } else if (successful === 0) {
      notifyError(`Tüm ${operation}ler başarısız oldu (${failed}/${total})`)
    } else {
      notifyWarning(`${operation}ler kısmen tamamlandı (Başarılı: ${successful}, Başarısız: ${failed})`)
    }
  }, [notifySuccess, notifyError, notifyWarning])

  // Progress notification
  const notifyProgress = useCallback((message, progress) => {
    showCustomToast(`${message} (${progress}%)`, {
      type: 'info',
      autoClose: false,
      closeOnClick: false,
      hideProgressBar: false,
      progress: progress / 100
    })
  }, [])

  return {
    // Basic notifications
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notify,
    
    // Specialized handlers
    handleApiError,
    handleValidationErrors,
    notifyOperation,
    notifyBatchOperation,
    notifyProgress
  }
}

export default useNotification