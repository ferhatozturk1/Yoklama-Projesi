import { useState, useCallback } from 'react'
import { 
  generateProfilePDF, 
  generateAttendanceReportPDF, 
  generateStudentListPDF,
  generateSchedulePDF,
  savePDF, 
  previewPDF,
  getPDFBlob
} from '../utils/pdfUtils'
import { 
  exportAttendanceToExcel, 
  exportStudentListToExcel,
  exportScheduleToExcel,
  createStudentImportTemplate 
} from '../utils/excelUtils'
import { showSuccess, showError } from '../components/common/ToastNotification'

/**
 * Custom hook for managing PDF and Excel exports
 * 
 * @returns {Object} - Export functions and state
 */
const useExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  // Export profile as PDF
  const exportProfilePDF = useCallback(async (profileData, options = {}) => {
    try {
      setIsExporting(true)
      setExportProgress(25)
      
      const doc = generateProfilePDF(profileData)
      setExportProgress(75)
      
      const filename = options.filename || `Profil_${profileData.name || 'Kullanici'}_${new Date().toISOString().split('T')[0]}.pdf`
      
      if (options.preview) {
        previewPDF(doc)
      } else if (options.returnBlob) {
        return getPDFBlob(doc)
      } else {
        savePDF(doc, filename)
        showSuccess('Profil PDF\'i başarıyla indirildi')
      }
      
      setExportProgress(100)
      return doc
      
    } catch (error) {
      console.error('Profile PDF export error:', error)
      showError('Profil PDF\'i oluşturulurken hata oluştu')
      throw error
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 1000)
    }
  }, [])

  // Export attendance report
  const exportAttendanceReport = useCallback(async (attendanceData, format = 'pdf', options = {}) => {
    try {
      setIsExporting(true)
      setExportProgress(25)
      
      if (format === 'pdf' || format === 'both') {
        const doc = generateAttendanceReportPDF(attendanceData)
        setExportProgress(50)
        
        const filename = options.pdfFilename || `${attendanceData.course.code}_Devamsizlik_${new Date().toISOString().split('T')[0]}.pdf`
        
        if (options.preview) {
          previewPDF(doc)
        } else if (options.returnBlob) {
          return getPDFBlob(doc)
        } else {
          savePDF(doc, filename)
          if (format === 'pdf') {
            showSuccess('Devamsızlık raporu PDF\'i başarıyla indirildi')
          }
        }
      }
      
      if (format === 'excel' || format === 'both') {
        setExportProgress(75)
        exportAttendanceToExcel(attendanceData)
        if (format === 'excel') {
          showSuccess('Devamsızlık raporu Excel\'i başarıyla indirildi')
        }
      }
      
      if (format === 'both') {
        showSuccess('Devamsızlık raporu PDF ve Excel dosyaları başarıyla indirildi')
      }
      
      setExportProgress(100)
      
    } catch (error) {
      console.error('Attendance report export error:', error)
      showError('Devamsızlık raporu oluşturulurken hata oluştu')
      throw error
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 1000)
    }
  }, [])

  // Export student list
  const exportStudentList = useCallback(async (studentData, format = 'pdf', options = {}) => {
    try {
      setIsExporting(true)
      setExportProgress(25)
      
      if (format === 'pdf' || format === 'both') {
        const doc = generateStudentListPDF(studentData)
        setExportProgress(50)
        
        const filename = options.pdfFilename || `${studentData.course.code}_Ogrenci_Listesi_${new Date().toISOString().split('T')[0]}.pdf`
        
        if (options.preview) {
          previewPDF(doc)
        } else if (options.returnBlob) {
          return getPDFBlob(doc)
        } else {
          savePDF(doc, filename)
          if (format === 'pdf') {
            showSuccess('Öğrenci listesi PDF\'i başarıyla indirildi')
          }
        }
      }
      
      if (format === 'excel' || format === 'both') {
        setExportProgress(75)
        exportStudentListToExcel(studentData)
        if (format === 'excel') {
          showSuccess('Öğrenci listesi Excel\'i başarıyla indirildi')
        }
      }
      
      if (format === 'both') {
        showSuccess('Öğrenci listesi PDF ve Excel dosyaları başarıyla indirildi')
      }
      
      setExportProgress(100)
      
    } catch (error) {
      console.error('Student list export error:', error)
      showError('Öğrenci listesi oluşturulurken hata oluştu')
      throw error
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 1000)
    }
  }, [])

  // Export schedule
  const exportSchedule = useCallback(async (scheduleData, format = 'pdf', options = {}) => {
    try {
      setIsExporting(true)
      setExportProgress(25)
      
      if (format === 'pdf' || format === 'both') {
        const doc = generateSchedulePDF(scheduleData)
        setExportProgress(50)
        
        const filename = options.pdfFilename || `Ders_Programi_${new Date().toISOString().split('T')[0]}.pdf`
        
        if (options.preview) {
          previewPDF(doc)
        } else if (options.returnBlob) {
          return getPDFBlob(doc)
        } else {
          savePDF(doc, filename)
          if (format === 'pdf') {
            showSuccess('Ders programı PDF\'i başarıyla indirildi')
          }
        }
      }
      
      if (format === 'excel' || format === 'both') {
        setExportProgress(75)
        exportScheduleToExcel(scheduleData)
        if (format === 'excel') {
          showSuccess('Ders programı Excel\'i başarıyla indirildi')
        }
      }
      
      if (format === 'both') {
        showSuccess('Ders programı PDF ve Excel dosyaları başarıyla indirildi')
      }
      
      setExportProgress(100)
      
    } catch (error) {
      console.error('Schedule export error:', error)
      showError('Ders programı oluşturulurken hata oluştu')
      throw error
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 1000)
    }
  }, [])

  // Create student import template
  const createImportTemplate = useCallback(async () => {
    try {
      setIsExporting(true)
      setExportProgress(50)
      
      createStudentImportTemplate()
      setExportProgress(100)
      
      showSuccess('Öğrenci listesi şablonu başarıyla indirildi')
      
    } catch (error) {
      console.error('Template creation error:', error)
      showError('Şablon oluşturulurken hata oluştu')
      throw error
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 1000)
    }
  }, [])

  // Batch export multiple items
  const batchExport = useCallback(async (exports) => {
    try {
      setIsExporting(true)
      const results = []
      
      for (let i = 0; i < exports.length; i++) {
        const exportItem = exports[i]
        setExportProgress(((i + 1) / exports.length) * 100)
        
        let result
        switch (exportItem.type) {
          case 'profile':
            result = await exportProfilePDF(exportItem.data, { ...exportItem.options, returnBlob: true })
            break
          case 'attendance':
            result = await exportAttendanceReport(exportItem.data, exportItem.format, { ...exportItem.options, returnBlob: true })
            break
          case 'studentList':
            result = await exportStudentList(exportItem.data, exportItem.format, { ...exportItem.options, returnBlob: true })
            break
          case 'schedule':
            result = await exportSchedule(exportItem.data, exportItem.format, { ...exportItem.options, returnBlob: true })
            break
          default:
            throw new Error(`Unsupported export type: ${exportItem.type}`)
        }
        
        results.push({
          type: exportItem.type,
          result,
          filename: exportItem.filename
        })
      }
      
      showSuccess(`${exports.length} dosya başarıyla oluşturuldu`)
      return results
      
    } catch (error) {
      console.error('Batch export error:', error)
      showError('Toplu dışa aktarma sırasında hata oluştu')
      throw error
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 1000)
    }
  }, [exportProfilePDF, exportAttendanceReport, exportStudentList, exportSchedule])

  return {
    // State
    isExporting,
    exportProgress,
    
    // Export functions
    exportProfilePDF,
    exportAttendanceReport,
    exportStudentList,
    exportSchedule,
    createImportTemplate,
    batchExport
  }
}

export default useExport