import React, { useState } from 'react'
import FileUploader from '../common/FileUploader'
import { showError, showSuccess } from '../common/ToastNotification'
import LoadingSpinner from '../common/LoadingSpinner'

const UploadProfilePhoto = ({ currentPhoto, onPhotoUpdate }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Lütfen bir dosya seçin')
      return
    }

    try {
      setIsUploading(true)
      
      // In demo mode, just create a preview URL
      const photoUrl = URL.createObjectURL(selectedFile)
      
      // Call the parent component's update function
      await onPhotoUpdate(photoUrl)
      
      showSuccess('Profil fotoğrafı başarıyla güncellendi!')
      setSelectedFile(null)
      
    } catch (error) {
      console.error('Photo upload error:', error)
      showError('Fotoğraf yüklenirken hata oluştu.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    try {
      setIsUploading(true)
      await onPhotoUpdate(null)
      showSuccess('Profil fotoğrafı kaldırıldı!')
      setSelectedFile(null)
    } catch (error) {
      console.error('Photo remove error:', error)
      showError('Fotoğraf kaldırılırken hata oluştu.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Profil Fotoğrafı</h3>
      
      {/* Current Photo */}
      {currentPhoto && (
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={currentPhoto} 
              alt="Current profile" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-gray-600">Mevcut fotoğraf</p>
              <button
                onClick={handleRemove}
                disabled={isUploading}
                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
              >
                Kaldır
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload */}
      <div className="mb-4">
        <FileUploader
          onFileSelect={handleFileSelect}
          acceptedTypes={['image/jpeg', 'image/png']}
          maxSize={2 * 1024 * 1024}
          label="Yeni fotoğraf seçin"
          description="JPG veya PNG formatında, maksimum 2MB"
        />
      </div>

      {/* Upload Button */}
      {selectedFile && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setSelectedFile(null)}
            className="btn btn-secondary"
            disabled={isUploading}
          >
            İptal
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                Yükleniyor...
              </div>
            ) : (
              'Fotoğrafı Güncelle'
            )}
          </button>
        </div>
      )}

      {/* Guidelines */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Fotoğraf Önerileri:</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Kare formatında fotoğraf kullanın</li>
          <li>• Yüzünüz net görünür olsun</li>
          <li>• Profesyonel görünüm için düz arka plan tercih edin</li>
          <li>• Dosya boyutu 2MB'dan küçük olmalı</li>
        </ul>
      </div>
    </div>
  )
}

export default UploadProfilePhoto