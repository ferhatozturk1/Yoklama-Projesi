import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useCalendar } from '../../context/CalendarContext'
import { formatDate } from '../../utils/dateHelpers'
import { showSuccess, showError } from '../common/ToastNotification'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'

const CalendarManagement = () => {
  const { 
    holidays, 
    examPeriods, 
    semesterDates, 
    addHoliday, 
    removeHoliday, 
    addExamPeriod, 
    removeExamPeriod, 
    updateSemesterDates 
  } = useCalendar()
  
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false)
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false)
  const [isEditSemesterModalOpen, setIsEditSemesterModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Holiday validation schema
  const holidaySchema = Yup.object({
    name: Yup.string()
      .required('Tatil adı zorunludur')
      .min(3, 'Tatil adı en az 3 karakter olmalıdır'),
    date: Yup.date()
      .required('Tarih zorunludur'),
    type: Yup.string()
      .required('Tür zorunludur')
      .oneOf(['national', 'religious', 'other'], 'Geçerli bir tür seçiniz')
  })

  // Exam period validation schema
  const examPeriodSchema = Yup.object({
    name: Yup.string()
      .required('Sınav dönemi adı zorunludur')
      .min(3, 'Sınav dönemi adı en az 3 karakter olmalıdır'),
    startDate: Yup.date()
      .required('Başlangıç tarihi zorunludur'),
    endDate: Yup.date()
      .required('Bitiş tarihi zorunludur')
      .min(
        Yup.ref('startDate'),
        'Bitiş tarihi başlangıç tarihinden sonra olmalıdır'
      ),
    type: Yup.string()
      .required('Tür zorunludur')
      .oneOf(['midterm', 'final', 'other'], 'Geçerli bir tür seçiniz')
  })

  // Semester dates validation schema
  const semesterSchema = Yup.object({
    startDate: Yup.date()
      .required('Başlangıç tarihi zorunludur'),
    endDate: Yup.date()
      .required('Bitiş tarihi zorunludur')
      .min(
        Yup.ref('startDate'),
        'Bitiş tarihi başlangıç tarihinden sonra olmalıdır'
      )
  })

  // Handle add holiday
  const handleAddHoliday = async (values, { resetForm }) => {
    try {
      setIsLoading(true)
      await addHoliday(values)
      showSuccess('Tatil başarıyla eklendi!')
      resetForm()
      setIsAddHolidayModalOpen(false)
    } catch (error) {
      showError('Tatil eklenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle add exam period
  const handleAddExamPeriod = async (values, { resetForm }) => {
    try {
      setIsLoading(true)
      await addExamPeriod(values)
      showSuccess('Sınav dönemi başarıyla eklendi!')
      resetForm()
      setIsAddExamModalOpen(false)
    } catch (error) {
      showError('Sınav dönemi eklenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle update semester dates
  const handleUpdateSemesterDates = async (values, { resetForm }) => {
    try {
      setIsLoading(true)
      await updateSemesterDates(values)
      showSuccess('Dönem tarihleri başarıyla güncellendi!')
      resetForm()
      setIsEditSemesterModalOpen(false)
    } catch (error) {
      showError('Dönem tarihleri güncellenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle remove holiday
  const handleRemoveHoliday = async (id) => {
    if (window.confirm('Bu tatili silmek istediğinizden emin misiniz?')) {
      try {
        setIsLoading(true)
        await removeHoliday(id)
        showSuccess('Tatil başarıyla silindi!')
      } catch (error) {
        showError('Tatil silinirken bir hata oluştu.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle remove exam period
  const handleRemoveExamPeriod = async (id) => {
    if (window.confirm('Bu sınav dönemini silmek istediğinizden emin misiniz?')) {
      try {
        setIsLoading(true)
        await removeExamPeriod(id)
        showSuccess('Sınav dönemi başarıyla silindi!')
      } catch (error) {
        showError('Sınav dönemi silinirken bir hata oluştu.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Semester Dates */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Dönem Bilgileri</h3>
          <button
            onClick={() => setIsEditSemesterModalOpen(true)}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Düzenle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Başlangıç Tarihi</p>
            <p className="text-lg text-blue-900 mt-1">
              {semesterDates?.startDate ? formatDate(semesterDates.startDate) : 'Belirtilmemiş'}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Bitiş Tarihi</p>
            <p className="text-lg text-blue-900 mt-1">
              {semesterDates?.endDate ? formatDate(semesterDates.endDate) : 'Belirtilmemiş'}
            </p>
          </div>
        </div>
      </div>

      {/* Holidays */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Tatiller</h3>
          <button
            onClick={() => setIsAddHolidayModalOpen(true)}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tatil Ekle
          </button>
        </div>

        {holidays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Henüz tatil eklenmemiş</p>
          </div>
        ) : (
          <div className="space-y-2">
            {holidays.map(holiday => (
              <div 
                key={holiday.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{holiday.name}</p>
                  <p className="text-sm text-gray-600">{formatDate(holiday.date)}</p>
                </div>
                <button
                  onClick={() => handleRemoveHoliday(holiday.id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Periods */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Sınav Dönemleri</h3>
          <button
            onClick={() => setIsAddExamModalOpen(true)}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Sınav Dönemi Ekle
          </button>
        </div>

        {examPeriods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Henüz sınav dönemi eklenmemiş</p>
          </div>
        ) : (
          <div className="space-y-2">
            {examPeriods.map(exam => (
              <div 
                key={exam.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{exam.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveExamPeriod(exam.id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Holiday Modal */}
      <Modal
        isOpen={isAddHolidayModalOpen}
        onClose={() => setIsAddHolidayModalOpen(false)}
        title="Tatil Ekle"
        size="small"
      >
        <Formik
          initialValues={{
            name: '',
            date: '',
            type: 'national'
          }}
          validationSchema={holidaySchema}
          onSubmit={handleAddHoliday}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Tatil Adı *
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Örn: 29 Ekim Cumhuriyet Bayramı"
                />
                <ErrorMessage 
                  name="name" 
                  component="div" 
                  className="form-error" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Tarih *
                </label>
                <Field
                  id="date"
                  name="date"
                  type="date"
                  className="form-input"
                />
                <ErrorMessage 
                  name="date" 
                  component="div" 
                  className="form-error" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Tür *
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className="form-input"
                >
                  <option value="national">Resmi Tatil</option>
                  <option value="religious">Dini Tatil</option>
                  <option value="other">Diğer</option>
                </Field>
                <ErrorMessage 
                  name="type" 
                  component="div" 
                  className="form-error" 
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddHolidayModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isLoading || isSubmitting}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      Ekleniyor...
                    </div>
                  ) : (
                    'Tatil Ekle'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Add Exam Period Modal */}
      <Modal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        title="Sınav Dönemi Ekle"
        size="small"
      >
        <Formik
          initialValues={{
            name: '',
            startDate: '',
            endDate: '',
            type: 'midterm'
          }}
          validationSchema={examPeriodSchema}
          onSubmit={handleAddExamPeriod}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Sınav Dönemi Adı *
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Örn: Ara Sınav Dönemi"
                />
                <ErrorMessage 
                  name="name" 
                  component="div" 
                  className="form-error" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    Başlangıç Tarihi *
                  </label>
                  <Field
                    id="startDate"
                    name="startDate"
                    type="date"
                    className="form-input"
                  />
                  <ErrorMessage 
                    name="startDate" 
                    component="div" 
                    className="form-error" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">
                    Bitiş Tarihi *
                  </label>
                  <Field
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="form-input"
                  />
                  <ErrorMessage 
                    name="endDate" 
                    component="div" 
                    className="form-error" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Tür *
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className="form-input"
                >
                  <option value="midterm">Ara Sınav</option>
                  <option value="final">Final Sınavı</option>
                  <option value="other">Diğer</option>
                </Field>
                <ErrorMessage 
                  name="type" 
                  component="div" 
                  className="form-error" 
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddExamModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isLoading || isSubmitting}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      Ekleniyor...
                    </div>
                  ) : (
                    'Sınav Dönemi Ekle'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Edit Semester Dates Modal */}
      <Modal
        isOpen={isEditSemesterModalOpen}
        onClose={() => setIsEditSemesterModalOpen(false)}
        title="Dönem Tarihlerini Düzenle"
        size="small"
      >
        <Formik
          initialValues={{
            startDate: semesterDates?.startDate || '',
            endDate: semesterDates?.endDate || ''
          }}
          validationSchema={semesterSchema}
          onSubmit={handleUpdateSemesterDates}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    Başlangıç Tarihi *
                  </label>
                  <Field
                    id="startDate"
                    name="startDate"
                    type="date"
                    className="form-input"
                  />
                  <ErrorMessage 
                    name="startDate" 
                    component="div" 
                    className="form-error" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">
                    Bitiş Tarihi *
                  </label>
                  <Field
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="form-input"
                  />
                  <ErrorMessage 
                    name="endDate" 
                    component="div" 
                    className="form-error" 
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Uyarı:</strong> Dönem tarihlerini değiştirmek, akademik takvimi ve ders programını etkileyebilir.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditSemesterModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isLoading || isSubmitting}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      Güncelleniyor...
                    </div>
                  ) : (
                    'Tarihleri Güncelle'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}

export default CalendarManagement