import React, { useState } from 'react'
import { 
  generateProfilePDF, 
  generateAttendanceReportPDF, 
  generateStudentListPDF,
  generateSchedulePDF,
  savePDF, 
  previewPDF 
} from '../../utils/pdfUtils'
import { 
  exportAttendanceToExcel, 
  exportStudentListToExcel,
  exportScheduleToExcel,
  createStudentImportTemplate 
} from '../../utils/excelUtils'
import { showSuccess, showError } from './ToastNotification'
import LoadingSpinner from './LoadingSpinner'

/**
 * Export button component for PDF and Excel exports
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Export type (profile, attendance, studentList, schedule, template)
 * @param {Object} props.data - Data to export
 * @param {string} props.format - Export format (pdf, excel, both)
 * @param {string} props.buttonText - Button text
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.showPreview - Whether to show preview option for PDF
 */
const ExportButton = ({
  type,
  data,
  format = 'pdf',
  buttonText,
  className = '',
  disabled = false,
  showPreview = false
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Get default button text based on type and format
  const getDefaultButtonText = () => {
    const typeTexts = {
      profile: 'Profil',
      attendance: 'Devamsızlık Raporu',
      studentList: 'Öğrenci Listesi',
      schedule: 'Ders Programı',
      template: 'Şablon'
    }
    
    const formatTexts = {
      pdf: 'PDF İndir',
      excel: 'Excel İndir',
      both: 'Dışa Aktar'
    }
    
    if (format === 'both') {
      return `${typeTexts[type]} ${formatTexts[format]}`
    }
    
    return `${typeTexts[type]} ${formatTexts[format]}`
  }

  // Handle PDF export
  const handlePDFExport = async (preview = false) => {
    try {
      setIsExporting(true)
      
      let doc
      let filename
      
      switch (type) {
        case 'profile':
          doc = generateProfilePDF(data)
          filename = `Profil_${data.name || 'Kullanici'}_${new Date().toISOString().split('T')[0]}.pdf`
          break
          
        case 'attendance':
          doc = generateAttendanceReportPDF(data)
          filename = `${data.course.code}_Devamsizlik_${new Date().toISOString().split('T')[0]}.pdf`
          break
          
        case 'studentList':
          doc = generateStudentListPDF(data)
          filename = `${data.course.code}_Ogrenci_Listesi_${new Date().toISOString().split('T')[0]}.pdf`
          break
          
        case 'schedule':
          doc = generateSchedulePDF(data)
          filename = `Ders_Programi_${new Date().toISOString().split('T')[0]}.pdf`
          break
          
        default:
          throw new Error('Geçersiz export türü')
      }
      
      if (preview) {
        previewPDF(doc)
      } else {
        savePDF(doc, filename)
        showSuccess('PDF başarıyla indirildi')
      }
      
    } catch (error) {
      console.error('PDF export error:', error)
      showError('PDF oluşturulurken hata oluştu: ' + error.message)
    } finally {
      setIsExporting(false)
      setShowDropdown(false)
    }
  }

  // Handle Excel export
  const handleExcelExport = async () => {
    try {
      setIsExporting(true)
      
      switch (type) {
        case 'attendance':
          exportAttendanceToExcel(data)
          break
          
        case 'studentList':
          exportStudentListToExcel(data)
          break
          
        case 'schedule':
          exportScheduleToExcel(data)
          break
          
        case 'template':
          createStudentImportTemplate()
          break
          
        default:
          throw new Error('Bu tür için Excel export desteklenmiyor')
      }
      
      showSuccess('Excel dosyası başarıyla indirildi')
      
    } catch (error) {
      console.error('Excel export error:', error)
      showError('Excel dosyası oluşturulurken hata oluştu: ' + error.message)
    } finally {
      setIsExporting(false)
      setShowDropdown(false)
    }
  }

  // Handle single format export
  const handleSingleExport = () => {
    if (format === 'pdf') {
      handlePDFExport()
    } else if (format === 'excel') {
      handleExcelExport()
    }
  }

  // Render single format button
  if (format !== 'both') {
    return (
      <button
        type="button"
        onClick={handleSingleExport}
        disabled={disabled || isExporting}
        className={`btn btn-primary ${className}`}
      >
        {isExporting ? (
          <div className="flex items-center">
            <LoadingSpinner size="small" className="mr-2" />
            <span>İşleniyor...</span>
          </div>
        ) : (
          <>
            {format === 'pdf' ? (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span>{buttonText || getDefaultButtonText()}</span>
          </>
        )}
      </button>
    )
  }

  // Render dropdown for both formats
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled || isExporting}
        className={`btn btn-primary ${className}`}
      >
        {isExporting ? (
          <div className="flex items-center">
            <LoadingSpinner size="small" className="mr-2" />
            <span>İşleniyor...</span>
          </div>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{buttonText || getDefaultButtonText()}</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {showDropdown && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              type="button"
              onClick={() => handlePDFExport()}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF İndir
            </button>
            
            {showPreview && (
              <button
                type="button"
                onClick={() => handlePDFExport(true)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                PDF Önizle
              </button>
            )}
            
            {type !== 'profile' && (
              <button
                type="button"
                onClick={handleExcelExport}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel İndir
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default ExportButton