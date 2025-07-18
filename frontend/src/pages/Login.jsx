import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useAuth } from '../context/AuthContext'
import { loginValidationSchema } from '../utils/validators'
import { showError, showSuccess, showInfo } from '../components/common/ToastNotification'
import LoadingSpinner from '../components/common/LoadingSpinner'
import logo from '../assets/logo.svg'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsLoading(true)
      const result = await login(values.email, values.password)
      
      if (result.success) {
        showSuccess('Giriş başarılı! Yönlendiriliyorsunuz...')
        navigate('/dashboard')
      } else {
        showError(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
        
        // Set specific field errors if available
        if (result.error?.includes('email')) {
          setFieldError('email', 'Geçersiz e-posta adresi')
        } else if (result.error?.includes('password')) {
          setFieldError('password', 'Geçersiz şifre')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      showError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img 
            src={logo} 
            alt="Teacher Attendance System" 
            className="mx-auto h-16 w-16 mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hoş Geldiniz
          </h2>
          <p className="text-gray-600">
            Akademik Personel Paneli'ne giriş yapın
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    E-posta Adresi
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

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Şifre
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className={`form-input ${
                      errors.password && touched.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Şifrenizi giriniz"
                  />
                  <ErrorMessage 
                    name="password" 
                    component="div" 
                    className="form-error" 
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Beni hatırla
                    </label>
                  </div>

                  <div className="text-sm">
                    <a 
                      href="#" 
                      className="font-medium text-blue-600 hover:text-blue-500"
                      onClick={(e) => {
                        e.preventDefault()
                        showInfo('Şifre sıfırlama özelliği yakında eklenecek.')
                      }}
                    >
                      Şifremi unuttum
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full btn btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="small" className="mr-2" />
                        Giriş yapılıyor...
                      </div>
                    ) : (
                      'Giriş Yap'
                    )}
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hesabınız yok mu?{' '}
                    <Link 
                      to="/register" 
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Kayıt olun
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
              Backend henüz hazır olmadığı için giriş işlemi simüle edilmektedir.
              <br />
              Herhangi bir e-posta ve şifre ile giriş yapabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login