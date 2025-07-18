import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import ProfileCard from '../components/profile/ProfileCard'
import ProfileForm from '../components/profile/ProfileForm'
import ProfilePDFDownload from '../components/profile/ProfilePDFDownload'
import UploadProfilePhoto from '../components/profile/UploadProfilePhoto'
import { showSuccess } from '../components/common/ToastNotification'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async (updatedData) => {
    // In demo mode, just update the context
    updateUser(updatedData)
    setIsEditing(false)
    showSuccess('Profil başarıyla güncellendi!')
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handlePhotoUpdate = async (photoUrl) => {
    updateUser({ profilePhoto: photoUrl })
    setShowPhotoUpload(false)
  }

  const handleDownloadPDF = () => {
    // This will be handled by the ProfilePDFDownload component
  }

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Bilgileri</h1>
            <p className="text-gray-600">
              Kişisel ve akademik bilgilerinizi görüntüleyin ve düzenleyin
            </p>
          </div>

          {/* Main Content */}
          {isEditing ? (
            <ProfileForm 
              user={user}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <div className="space-y-8">
              {/* Profile Card */}
              <ProfileCard 
                user={user}
                onEdit={handleEdit}
                onDownloadPDF={handleDownloadPDF}
              />

              {/* Additional Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Photo Upload */}
                <UploadProfilePhoto
                  currentPhoto={user?.profilePhoto}
                  onPhotoUpdate={handlePhotoUpdate}
                />

                {/* PDF Download */}
                <ProfilePDFDownload
                  user={user}
                  courses={[]} // Will be populated when courses are implemented
                />
              </div>

              {/* Courses Section */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Verilen Dersler</h3>
                  <button className="btn btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ders Ekle
                  </button>
                </div>
                
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz ders eklenmemiş</h4>
                  <p className="text-sm text-gray-600 mb-4">Verdiğiniz dersleri ekleyerek başlayın</p>
                  <button className="btn btn-primary">
                    İlk Dersinizi Ekleyin
                  </button>
                </div>
              </div>

              {/* Academic Calendar */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Akademik Takvim</h3>
                  <button className="btn btn-secondary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Takvim Yükle
                  </button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 mb-1">Akademik takvim dosyası yüklenmemiş</p>
                  <p className="text-xs text-gray-500">PDF formatında akademik takvim dosyanızı yükleyebilirsiniz</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Profile