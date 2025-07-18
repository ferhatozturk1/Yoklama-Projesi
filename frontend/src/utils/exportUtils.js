import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatDate } from './dateHelpers'

/**
 * Generate a PDF document for attendance data
 * @param {Object} data - The data to export
 * @param {Object} options - Export options
 * @returns {jsPDF} - The PDF document
 */
export const generateAttendancePDF = (data, options = {}) => {
  const {
    title = 'Yoklama Raporu',
    fileName = 'yoklama-raporu.pdf',
    courseInfo = {},
    dateRange = {},
    download = true
  } = options
  
  // Create a new PDF document
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  
  // Add course info
  if (courseInfo.code) {
    doc.setFontSize(12)
    doc.text(`Ders: ${courseInfo.code} - ${courseInfo.name}`, 14, 32)
    doc.text(`Şube: ${courseInfo.section || '-'}`, 14, 38)
    doc.text(`Derslik: ${courseInfo.classroom || '-'}`, 14, 44)
  }
  
  // Add date range
  if (dateRange.startDate && dateRange.endDate) {
    doc.setFontSize(10)
    doc.text(`Tarih Aralığı: ${formatDate(dateRange.startDate, 'dd.MM.yyyy')} - ${formatDate(dateRange.endDate, 'dd.MM.yyyy')}`, 14, 52)
  }
  
  // Add generation date
  doc.setFontSize(10)
  doc.text(`Oluşturulma Tarihi: ${formatDate(new Date(), 'dd.MM.yyyy HH:mm')}`, 14, 58)
  
  // Add table
  if (data.type === 'history') {
    // Attendance history table
    const tableData = data.sessions.map(session => [
      formatDate(session.date, 'dd.MM.yyyy'),
      session.type === 'makeup' ? 'Telafi' : 'Normal',
      session.presentCount,
      session.absentCount,
      session.excusedCount,
      `%${Math.round((session.presentCount / (session.presentCount + session.absentCount + session.excusedCount)) * 100)}`
    ])
    
    doc.autoTable({
      startY: 65,
      head: [['Tarih', 'Tür', 'Var', 'Yok', 'Mazeretli', 'Katılım']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] }
    })
    
    // Add summary
    const totalPresent = data.sessions.reduce((sum, session) => sum + session.presentCount, 0)
    const totalAbsent = data.sessions.reduce((sum, session) => sum + session.absentCount, 0)
    const totalExcused = data.sessions.reduce((sum, session) => sum + session.excusedCount, 0)
    const totalAttendance = totalPresent + totalAbsent + totalExcused
    const attendanceRate = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0
    
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(11)
    doc.text(`Toplam Ders: ${data.sessions.length}`, 14, finalY)
    doc.text(`Toplam Var: ${totalPresent}`, 14, finalY + 6)
    doc.text(`Toplam Yok: ${totalAbsent}`, 14, finalY + 12)
    doc.text(`Toplam Mazeretli: ${totalExcused}`, 14, finalY + 18)
    doc.text(`Ortalama Katılım: %${attendanceRate}`, 14, finalY + 24)
  } else if (data.type === 'session') {
    // Single session attendance table
    const tableData = data.students.map(student => [
      student.studentNumber,
      `${student.firstName} ${student.lastName}`,
      student.status === 'present' ? 'Var' :
      student.status === 'absent' ? 'Yok' :
      student.status === 'excused' ? 'Mazeretli' :
      student.status === 'late' ? 'Geç' : 'Belirsiz',
      student.timestamp ? formatDate(student.timestamp, 'HH:mm:ss') : '-'
    ])
    
    doc.autoTable({
      startY: 65,
      head: [['Öğrenci No', 'Ad Soyad', 'Durum', 'Zaman']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] }
    })
    
    // Add summary
    const presentCount = data.students.filter(s => s.status === 'present').length
    const absentCount = data.students.filter(s => s.status === 'absent').length
    const excusedCount = data.students.filter(s => s.status === 'excused').length
    const lateCount = data.students.filter(s => s.status === 'late').length
    const totalCount = data.students.length
    const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0
    
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(11)
    doc.text(`Toplam Öğrenci: ${totalCount}`, 14, finalY)
    doc.text(`Var: ${presentCount}`, 14, finalY + 6)
    doc.text(`Yok: ${absentCount}`, 14, finalY + 12)
    doc.text(`Mazeretli: ${excusedCount}`, 14, finalY + 18)
    doc.text(`Geç: ${lateCount}`, 14, finalY + 24)
    doc.text(`Katılım Oranı: %${attendanceRate}`, 14, finalY + 30)
  }
  
  // Download the PDF
  if (download) {
    doc.save(fileName)
  }
  
  return doc
}

/**
 * Generate an Excel file for attendance data
 * @param {Object} data - The data to export
 * @param {Object} options - Export options
 */
export const generateAttendanceExcel = (data, options = {}) => {
  const {
    fileName = 'yoklama-raporu.xlsx',
    courseInfo = {},
    dateRange = {},
    download = true
  } = options
  
  // Create a new workbook
  const wb = XLSX.utils.book_new()
  
  if (data.type === 'history') {
    // Attendance history sheet
    const wsData = [
      ['Yoklama Geçmişi'],
      [],
      ['Ders', courseInfo.code ? `${courseInfo.code} - ${courseInfo.name}` : ''],
      ['Şube', courseInfo.section || ''],
      ['Derslik', courseInfo.classroom || ''],
      [],
      ['Tarih Aralığı', dateRange.startDate && dateRange.endDate ? 
        `${formatDate(dateRange.startDate, 'dd.MM.yyyy')} - ${formatDate(dateRange.endDate, 'dd.MM.yyyy')}` : ''],
      ['Oluşturulma Tarihi', formatDate(new Date(), 'dd.MM.yyyy HH:mm')],
      [],
      ['Tarih', 'Tür', 'Var', 'Yok', 'Mazeretli', 'Katılım']
    ]
    
    // Add session data
    data.sessions.forEach(session => {
      const total = session.presentCount + session.absentCount + session.excusedCount
      const attendanceRate = total > 0 ? Math.round((session.presentCount / total) * 100) : 0
      
      wsData.push([
        formatDate(session.date, 'dd.MM.yyyy'),
        session.type === 'makeup' ? 'Telafi' : 'Normal',
        session.presentCount,
        session.absentCount,
        session.excusedCount,
        `%${attendanceRate}`
      ])
    })
    
    // Add summary
    const totalPresent = data.sessions.reduce((sum, session) => sum + session.presentCount, 0)
    const totalAbsent = data.sessions.reduce((sum, session) => sum + session.absentCount, 0)
    const totalExcused = data.sessions.reduce((sum, session) => sum + session.excusedCount, 0)
    const totalAttendance = totalPresent + totalAbsent + totalExcused
    const attendanceRate = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0
    
    wsData.push(
      [],
      ['Toplam Ders', data.sessions.length],
      ['Toplam Var', totalPresent],
      ['Toplam Yok', totalAbsent],
      ['Toplam Mazeretli', totalExcused],
      ['Ortalama Katılım', `%${attendanceRate}`]
    )
    
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, 'Yoklama Geçmişi')
  } else if (data.type === 'session') {
    // Single session attendance sheet
    const sessionDate = data.session?.date ? formatDate(data.session.date, 'dd.MM.yyyy') : ''
    const sessionType = data.session?.type === 'makeup' ? 'Telafi' : 'Normal'
    
    const wsData = [
      ['Yoklama Detayları'],
      [],
      ['Ders', courseInfo.code ? `${courseInfo.code} - ${courseInfo.name}` : ''],
      ['Şube', courseInfo.section || ''],
      ['Derslik', courseInfo.classroom || ''],
      ['Tarih', sessionDate],
      ['Tür', sessionType],
      ['Oluşturulma Tarihi', formatDate(new Date(), 'dd.MM.yyyy HH:mm')],
      [],
      ['Öğrenci No', 'Ad', 'Soyad', 'Durum', 'Zaman']
    ]
    
    // Add student data
    data.students.forEach(student => {
      const status = 
        student.status === 'present' ? 'Var' :
        student.status === 'absent' ? 'Yok' :
        student.status === 'excused' ? 'Mazeretli' :
        student.status === 'late' ? 'Geç' : 'Belirsiz'
      
      wsData.push([
        student.studentNumber,
        student.firstName,
        student.lastName,
        status,
        student.timestamp ? formatDate(student.timestamp, 'HH:mm:ss') : '-'
      ])
    })
    
    // Add summary
    const presentCount = data.students.filter(s => s.status === 'present').length
    const absentCount = data.students.filter(s => s.status === 'absent').length
    const excusedCount = data.students.filter(s => s.status === 'excused').length
    const lateCount = data.students.filter(s => s.status === 'late').length
    const totalCount = data.students.length
    const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0
    
    wsData.push(
      [],
      ['Toplam Öğrenci', totalCount],
      ['Var', presentCount],
      ['Yok', absentCount],
      ['Mazeretli', excusedCount],
      ['Geç', lateCount],
      ['Katılım Oranı', `%${attendanceRate}`]
    )
    
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, 'Yoklama Detayları')
  }
  
  // Download the Excel file
  if (download) {
    XLSX.writeFile(wb, fileName)
  }
  
  return wb
}

/**
 * Export attendance data as PDF or Excel
 * @param {string} format - The export format ('pdf' or 'excel')
 * @param {Object} data - The data to export
 * @param {Object} options - Export options
 */
export const exportAttendance = (format, data, options = {}) => {
  if (format === 'pdf') {
    return generateAttendancePDF(data, options)
  } else if (format === 'excel') {
    return generateAttendanceExcel(data, options)
  }
  
  throw new Error(`Unsupported export format: ${format}`)
}