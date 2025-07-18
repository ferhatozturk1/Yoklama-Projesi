import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { profileUpdateValidationSchema } from '../../utils/validators'
import { showError, showSuccess } from '../common/ToastNotification'
import LoadingSpinner from '../common/LoadingSpinner'
import FileUploader from '../common/FileUploader'

const ProfileForm = ({ user, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [academicCalendar, setAcademicCalendar] = useState(null)

  const titleOptions = [
    { value: 'Dr.', label: 'Dr.' },
    { value: 'Doç. Dr.', label: 'Doç. Dr.' },
    { value: 'Prof. Dr.', label: 'Prof. Dr.' },
    { value: 'Öğr. Gör.', label: 'Öğr. Gör.' },
    { value: 'Arş. Gör.', label: 'Arş. Gör.' }
  ]

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true)
      
      const updatedData = {
        ...values,
        profilePhoto: profilePhoto,
        academicCalendar: academicCalendar
      }
      
      await onSave(updatedData)
      showSuccess('Profil başarıyla güncellendi!')
      
    } catch (error) {
      console.error('Profile update error:', error)
      showError('Profil güncellenirken hata oluştu.')
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profil Düzenle</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <Formik
        initialValues={{
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          title: user?.title || '',
          university: user?.university || '',
          faculty: user?.faculty || '',
          department: user?.department || ''
        }}
        validationSchema={profileUpdateValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kişisel Bilgiler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    Ad *
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`form-input ${
                      errors.firstName && touched.firstName ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage 
                    name="firstName" 
                    component="div" 
                    className="form-error" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Soyad *
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`form-input ${
                      errors.lastName && touched.lastName ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage 
                    name="lastName" 
                    component="div" 
                    className="form-error" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Ünvan *
                </label>
                <Field
                  as="select"
                  id="title"
                  name="title"
                  className={`form-input ${
                    errors.title && touched.title ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Ünvan seçiniz</option>
                  {titleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage 
                  name="title" 
                  component="div" 
                  className="form-error" 
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Akademik Bilgiler</h3>
              
              <div className="form-group mb-4">
                <label htmlFor="university" className="form-label">
                  Üniversite *
                </label>
                <Field
                  id="university"
                  name="university"
                  type="text"
                  className={`form-input ${
                    errors.university && touched.university ? 'border-red-500' : ''
                  }`}
                />
                <ErrorMessage 
                  name="university" 
                  component="div" 
                  className="form-error" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="faculty" className="form-label">
                    Fakülte *
                  </label>
                  <Field
                    id="faculty"
                    name="faculty"
                    type="text"
                    className={`form-input ${
                      errors.faculty && touched.faculty ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage 
                    name="faculty" 
                    component="div" 
                    className="form-error" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department" className="form-label">
                    Bölüm *
                  </label>
                  <Field
                    id="department"
                    name="department"
                    type="text"
                    className={`form-input ${
                      errors.department && touched.department ? 'border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage 
                    name="department" 
                    component="div" 
                    className="form-error" 
                  />
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dosyalar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    Profil Fotoğrafı
                  </label>
                  <FileUploader
                    onFileSelect={setProfilePhoto}
                    acceptedTypes={['image/jpeg', 'image/png']}
                    maxSize={2 * 1024 * 1024}
                    label="Fotoğraf seçin"
                    description="JPG veya PNG, max 2MB"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Akademik Takvim
                  </label>
                  <FileUploader
                    onFileSelect={setAcademicCalendar}
                    acceptedTypes={['application/pdf']}
                    maxSize={10 * 1024 * 1024}
                    label="PDF dosyası seçin"
                    description="PDF formatında, max 10MB"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                disabled={isSubmitting || isLoading}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" className="mr-2" />
                    Kaydediliyor...
                  </div>
                ) : (
                  'Kaydet'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ProfileForm