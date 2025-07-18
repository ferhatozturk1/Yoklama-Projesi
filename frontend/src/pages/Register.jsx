import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useAuth } from '../context/AuthContext'
import { registrationValidationSchema } from '../utils/validators'
import { showError, showSuccess } from '../components/common/ToastNotification'
import LoadingSpinner from '../components/common/LoadingSpinner'
import FileUploader from '../components/common/FileUploader'
import logo from '../assets/logo.svg'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [academicCalendar, setAcademicCalendar] = useState(null)

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsLoading(true)
      
      // Prepare user data
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        title: values.title,
        university: values.university,
        faculty: values.faculty,
        department: values.department,
        profilePhoto: profilePhoto,
        academicCalendar: academicCalendar
      }
      
      const result = await register(userData)
      
      if (result.success) {
        showSuccess('Kayıt başarılı! Hoş geldiniz!')
        navigate('/dashboard')
      } else {
        showError(result.error || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.')
        
        // Set specific field errors if available
        if (result.error?.includes('email')) {
          setFieldError('email', 'Bu e-posta adresi zaten kullanılıyor')
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      showError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  const titleOptions = [
    { value: 'Dr.', label: 'Dr.' },
    { value: 'Doç. Dr.', label: 'Doç. Dr.' },
    { value: 'Prof. Dr.', label: 'Prof. Dr.' },
    { value: 'Öğr. Gör.', label: 'Öğr. Gör.' },
    { value: 'Arş. Gör.', label: 'Arş. Gör.' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img 
            src={logo} 
            alt="Teacher Attendance System" 
            className="mx-auto h-16 w-16 mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hesap Oluşturun
          </h2>
          <p className="text-gray-600">
            Akademik Personel Paneli'ne katılın
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="ml-2 text-xs font-medium hidden sm:inline">Kişisel</span>
          </div>
          <div className={`w-6 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="ml-2 text-xs font-medium hidden sm:inline">Akademik</span>
          </div>
          <div className={`w-6 h-0.5 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className="ml-2 text-xs font-medium hidden sm:inline">Tamamla</span>
          </div>
        </div>

        {/* Registration Form */}
        <div className="card">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              title: '',
              university: '',
              faculty: '',
              department: '',
              profilePhoto: null,
              academicCalendar: null
            }}
            validationSchema={registrationValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Kişisel Bilgileriniz</h3>
                      <p className="text-sm text-gray-600">Temel bilgilerinizi giriniz</p>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="Adınız"
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
                          placeholder="Soyadınız"
                        />
                        <ErrorMessage 
                          name="lastName" 
                          component="div" 
                          className="form-error" 
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        E-posta Adresi *
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`form-input ${
                          errors.email && touched.email ? 'border-red-500' : ''
                        }`}
                        placeholder="ornek@universite.edu.tr"
                      />
                      <ErrorMessage 
                        name="email" 
                        component="div" 
                        className="form-error" 
                      />
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="password" className="form-label">
                          Şifre *
                        </label>
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          className={`form-input ${
                            errors.password && touched.password ? 'border-red-500' : ''
                          }`}
                          placeholder="En az 8 karakter"
                        />
                        <ErrorMessage 
                          name="password" 
                          component="div" 
                          className="form-error" 
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          Şifre Tekrarı *
                        </label>
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          className={`form-input ${
                            errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
                          }`}
                          placeholder="Şifrenizi tekrar giriniz"
                        />
                        <ErrorMessage 
                          name="confirmPassword" 
                          component="div" 
                          className="form-error" 
                        />
                      </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          // Basic validation for step 1
                          if (values.firstName && values.lastName && values.email && 
                              values.password && values.confirmPassword) {
                            setCurrentStep(2)
                          } else {
                            showError('Lütfen tüm zorunlu alanları doldurunuz')
                          }
                        }}
                        className="btn btn-primary"
                      >
                        Devam Et
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Akademik Bilgileriniz</h3>
                      <p className="text-sm text-gray-600">Çalıştığınız kurum bilgilerini giriniz</p>
                    </div>

                    {/* Title Field */}
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

                    {/* University Field */}
                    <div className="form-group">
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
                        placeholder="Çalıştığınız üniversite"
                      />
                      <ErrorMessage 
                        name="university" 
                        component="div" 
                        className="form-error" 
                      />
                    </div>

                    {/* Faculty and Department */}
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
                          placeholder="Fakülte adı"
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
                          placeholder="Bölüm adı"
                        />
                        <ErrorMessage 
                          name="department" 
                          component="div" 
                          className="form-error" 
                        />
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="btn btn-secondary"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Geri
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          // Basic validation for step 2
                          if (values.title && values.university && values.faculty && values.department) {
                            setCurrentStep(3)
                          } else {
                            showError('Lütfen tüm zorunlu alanları doldurunuz')
                          }
                        }}
                        className="btn btn-primary"
                      >
                        Devam Et
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Ek Bilgiler</h3>
                      <p className="text-sm text-gray-600">İsteğe bağlı dosyalarınızı yükleyebilirsiniz</p>
                    </div>

                    {/* Profile Photo Upload */}
                    <div className="form-group">
                      <label className="form-label">
                        Profil Fotoğrafı
                      </label>
                      <FileUploader
                        onFileSelect={setProfilePhoto}
                        acceptedTypes={['image/jpeg', 'image/png']}
                        maxSize={2 * 1024 * 1024} // 2MB
                        label="Profil fotoğrafı seçin"
                        description="JPG veya PNG formatında, maksimum 2MB"
                      />
                    </div>

                    {/* Academic Calendar Upload */}
                    <div className="form-group">
                      <label className="form-label">
                        Akademik Takvim
                      </label>
                      <FileUploader
                        onFileSelect={setAcademicCalendar}
                        acceptedTypes={['application/pdf']}
                        maxSize={10 * 1024 * 1024} // 10MB
                        label="Akademik takvim dosyası seçin"
                        description="PDF formatında, maksimum 10MB"
                      />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Bilgi</h4>
                          <p className="text-sm text-blue-600 mt-1">
                            Bu dosyalar isteğe bağlıdır. Daha sonra profil sayfanızdan da yükleyebilirsiniz.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="btn btn-secondary"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Geri
                      </button>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Atla ve Oluştur
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <LoadingSpinner size="small" className="mr-2" />
                              Hesap oluşturuluyor...
                            </div>
                          ) : (
                            'Hesap Oluştur'
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Zaten hesabınız var mı?{' '}
                    <Link 
                      to="/login" 
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Giriş yapın
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Demo Info */}
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Demo Bilgileri
            </h3>
            <p className="text-xs text-blue-600">
              Backend henüz hazır olmadığı için kayıt işlemi simüle edilmektedir.
              <br />
              Tüm alanları doldurarak demo hesabı oluşturabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register