import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'

const StudentEditModal = ({ isOpen, onClose, student, onSave }) => {
  const [isLoading, setIsLoading] = useState(false)

  // Define validation schema
  const validationSchema = Yup.object({
    studentNumber: Yup.string()
      .required('Öğrenci numarası zorunludur')
      .matches(/^\d+$/, 'Öğrenci numarası sadece rakamlardan oluşmalıdır'),
    firstName: Yup.string()
      .required('Ad zorunludur')
      .min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: Yup.string()
      .required('Soyad zorunludur')
      .min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: Yup.string()
      .email('Geçerli bir e-posta adresi giriniz')
  })

  // Initial form values
  const initialValues = {
    studentNumber: student?.studentNumber || '',
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || ''
  }

  const handleSubmit = async (values) => {
    setIsLoading(true)
    
    try {
      // In a real app, we would save this to the backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the parent component's handler
      if (onSave) {
        const updatedStudent = {
          id: student?.id || `student-${Date.now()}`,
          ...values
        }
        onSave(updatedStudent)
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving student:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'}
      size="medium"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="studentNumber" className="form-label">
                  Öğrenci Numarası <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  id="studentNumber"
                  name="studentNumber"
                  className={`form-input ${
                    errors.studentNumber && touched.studentNumber ? 'border-red-500' : ''
                  }`}
                />
                <ErrorMessage
                  name="studentNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-posta
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${
                    errors.email && touched.email ? 'border-red-500' : ''
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Ad <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-input ${
                    errors.firstName && touched.firstName ? 'border-red-500' : ''
                  }`}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Soyad <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-input ${
                    errors.lastName && touched.lastName ? 'border-red-500' : ''
                  }`}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
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
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
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
    </Modal>
  )
}

export default StudentEditModal