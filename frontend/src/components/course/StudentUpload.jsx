import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { showError, showSuccess, showWarning } from '../common/ToastNotification'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'
import StudentImportPreview from './StudentImportPreview'

const StudentUpload = ({ isOpen, onClose, courseId, onUploadComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parsedStudents, setParsedStudents] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return
    
    const file = acceptedFiles[0]
    setUploadedFile(file)
    
    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/pdf' // .pdf
    ]
    
    if (!validTypes.includes(file.type)) {
      setUploadError('Desteklenmeyen dosya formatı. Lütfen Excel, CSV veya PDF dosyası yükleyin.')
      return
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.')
      return
    }
    
    try {
      setIsLoading(true)
      setUploadError('')
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)
      
      // In demo mode, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate parsing the file and extracting student data
      const mockStudents = [
        {
          id: `student-${Date.now()}-1`,
          studentNumber: '20210001',
          firstName: 'Ali',
          lastName: 'Yılmaz',
          email: 'ali.yilmaz@ogrenci.edu.tr'
        },
        {
          id: `student-${Date.now()}-2`,
          studentNumber: '20210002',
          firstName: 'Ayşe',
          lastName: 'Kaya',
          email: 'ayse.kaya@ogrenci.edu.tr'
        },
        {
          id: `student-${Date.now()}-3`,
          studentNumber: '20210003',
          firstName: 'Mehmet',
          lastName: 'Demir',
          email: 'mehmet.demir@ogrenci.edu.tr'
        },
        {
          id: `student-${Date.now()}-4`,
          studentNumber: '20210004',
          firstName: 'Zeynep',
          lastName: 'Şahin',
          email: 'zeynep.sahin@ogrenci.edu.tr'
        },
        {
          id: `student-${Date.now()}-5`,
          studentNumber: '20210005',
          firstName: 'Mustafa',
          lastName: 'Öztürk',
          email: 'mustafa.ozturk@ogrenci.edu.tr'
        },
        // Add a duplicate for testing
        {
          id: `student-${Date.now()}-6`,
          studentNumber: '20210001', // Duplicate student number
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet.yilmaz@ogrenci.edu.tr'
        }
      ]
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Store parsed students for preview
      setParsedStudents(mockStudents)
      
      // Show preview
      setShowPreview(true)
      
    } catch (error) {
      console.error('Error uploading student list:', error)
      setUploadError('Öğrenci listesi yüklenirken bir hata oluştu.')
      showError('Dosya yüklenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const handleImportConfirm = (selectedStudents) => {
    // Call the parent component's handler
    if (onUploadComplete) {
      onUploadComplete(selectedStudents)
    }
    
    showSuccess(`Öğrenci listesi başarıyla yüklendi. ${selectedStudents.length} öğrenci eklendi.`)
    onClose()
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleManualUpload = () => {
    if (!uploadedFile) {
      showWarning('Lütfen önce bir dosya seçin.')
      return
    }
    
    // Trigger the same process as if the file was dropped
    onDrop([uploadedFile])
  }

  return (
    <>
      <Modal
        isOpen={isOpen && !showPreview}
        onClose={onClose}
        title="Öğrenci Listesi Yükle"
        size="medium"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Excel (.xlsx, .xls), CSV veya PDF formatında öğrenci listesi yükleyin. 
            Dosya, öğrenci numarası, ad ve soyad bilgilerini içermelidir.
          </p>
          
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            
            {isLoading ? (
              <div className="space-y-4">
                <LoadingSpinner size="medium" className="mx-auto" />
                <div>
                  <p className="font-medium">Yükleniyor...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-4 text-lg font-medium">
                  {isDragActive ? 'Dosyayı buraya bırakın' : 'Dosya yüklemek için tıklayın veya sürükleyin'}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Excel, CSV veya PDF (maks. 10MB)
                </p>
                {uploadedFile && (
                  <div className="mt-4 p-2 bg-blue-50 rounded-lg text-sm">
                    <p className="font-medium text-blue-800">
                      Seçilen dosya: {uploadedFile.name}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p><strong>Hata:</strong> {uploadError}</p>
            </div>
          )}
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>İpucu:</strong> Excel dosyasında en az "Öğrenci No", "Ad" ve "Soyad" sütunları bulunmalıdır.
            </p>
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
              type="button"
              className="btn btn-primary"
              disabled={isLoading || !uploadedFile}
              onClick={handleManualUpload}
            >
              Yükle
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Preview Modal */}
      <StudentImportPreview
        isOpen={isOpen && showPreview}
        onClose={() => {
          setShowPreview(false)
          onClose()
        }}
        importData={parsedStudents}
        onConfirm={handleImportConfirm}
      />
    </>
  )
}

export default StudentUpload