import jsPDF from 'jspdf'
import { formatDate, formatDateTime } from './dateHelpers'

// Configure jsPDF for Turkish characters
const configurePDF = (doc) => {
  // Add Turkish font support if needed
  doc.setFont('helvetica')
  return doc
}

// Generate profile PDF
export const generateProfilePDF = (userData) => {
  const doc = new jsPDF()
  configurePDF(doc)
  
  // Header
  doc.setFontSize(20)
  doc.text('Akademik Personel Profil Belgesi', 20, 30)
  
  // Line separator
  doc.setLineWidth(0.5)
  doc.line(20, 35, 190, 35)
  
  // Personal Information
  doc.setFontSize(16)
  doc.text('Kişisel Bilgiler', 20, 50)
  
  doc.setFontSize(12)
  let yPos = 60
  
  const personalInfo = [
    ['Ad Soyad:', `${userData.firstName} ${userData.lastName}`],
    ['Ünvan:', userData.title],
    ['E-posta:', userData.email],
    ['Üniversite:', userData.university],
    ['Fakülte:', userData.faculty],
    ['Bölüm:', userData.department]
  ]
  
  personalInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label, 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(value || 'Belirtilmemiş', 70, yPos)
    yPos += 10
  })
  
  // Academic Information
  yPos += 10
  doc.setFontSize(16)
  doc.text('Akademik Bilgiler', 20, yPos)
  yPos += 15
  
  doc.setFontSize(12)
  if (userData.courses && userData.courses.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Verilen Dersler:', 20, yPos)
    yPos += 10
    
    doc.setFont('helvetica', 'normal')
    userData.courses.forEach(course => {
      doc.text(`• ${course.code} - ${course.name} (Şube: ${course.section})`, 25, yPos)
      yPos += 8
    })
  }
  
  // Footer
  yPos = 270
  doc.setFontSize(10)
  doc.text(`Belge Oluşturma Tarihi: ${formatDateTime(new Date())}`, 20, yPos)
  doc.text('Bu belge sistem tarafından otomatik olarak oluşturulmuştur.', 20, yPos + 10)
  
  return doc
}

// Generate attendance report PDF
export const generateAttendanceReportPDF = (courseData, attendanceData, filters = {}) => {
  const doc = new jsPDF()
  configurePDF(doc)
  
  // Header
  doc.setFontSize(18)
  doc.text('Yoklama Raporu', 20, 30)
  
  // Course Information
  doc.setFontSize(14)
  doc.text(`Ders: ${courseData.code} - ${courseData.name}`, 20, 45)
  doc.text(`Şube: ${courseData.section}`, 20, 55)
  doc.text(`Derslik: ${courseData.classroom}`, 20, 65)
  
  // Filter Information
  if (filters.startDate || filters.endDate) {
    doc.setFontSize(12)
    doc.text('Rapor Dönemi:', 20, 80)
    if (filters.startDate) {
      doc.text(`Başlangıç: ${formatDate(filters.startDate)}`, 25, 90)
    }
    if (filters.endDate) {
      doc.text(`Bitiş: ${formatDate(filters.endDate)}`, 25, 100)
    }
  }
  
  // Line separator
  doc.setLineWidth(0.5)
  doc.line(20, 110, 190, 110)
  
  // Attendance Table
  let yPos = 125
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  
  // Table headers
  doc.text('Öğrenci No', 20, yPos)
  doc.text('Ad Soyad', 60, yPos)
  doc.text('Devam', 120, yPos)
  doc.text('Devamsızlık', 150, yPos)
  doc.text('Oran', 180, yPos)
  
  yPos += 5
  doc.line(20, yPos, 190, yPos)
  yPos += 10
  
  // Table data
  doc.setFont('helvetica', 'normal')
  attendanceData.forEach(student => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 30
    }
    
    const attendanceRate = student.totalSessions > 0 
      ? Math.round((student.presentCount / student.totalSessions) * 100)
      : 0
    
    doc.text(student.studentNumber, 20, yPos)
    doc.text(`${student.firstName} ${student.lastName}`, 60, yPos)
    doc.text(student.presentCount.toString(), 120, yPos)
    doc.text(student.absentCount.toString(), 150, yPos)
    doc.text(`%${attendanceRate}`, 180, yPos)
    
    yPos += 8
  })
  
  // Summary
  if (yPos > 250) {
    doc.addPage()
    yPos = 30
  } else {
    yPos += 20
  }
  
  doc.setFont('helvetica', 'bold')
  doc.text('Özet Bilgiler:', 20, yPos)
  yPos += 10
  
  doc.setFont('helvetica', 'normal')
  const totalStudents = attendanceData.length
  const averageAttendance = attendanceData.reduce((sum, student) => {
    const rate = student.totalSessions > 0 
      ? (student.presentCount / student.totalSessions) * 100
      : 0
    return sum + rate
  }, 0) / totalStudents
  
  doc.text(`Toplam Öğrenci Sayısı: ${totalStudents}`, 20, yPos)
  doc.text(`Ortalama Devam Oranı: %${Math.round(averageAttendance)}`, 20, yPos + 10)
  
  // Footer
  yPos = 280
  doc.setFontSize(10)
  doc.text(`Rapor Oluşturma Tarihi: ${formatDateTime(new Date())}`, 20, yPos)
  
  return doc
}

// Generate session attendance PDF
export const generateSessionAttendancePDF = (sessionData, courseData) => {
  const doc = new jsPDF()
  configurePDF(doc)
  
  // Header
  doc.setFontSize(18)
  doc.text('Ders Yoklama Listesi', 20, 30)
  
  // Session Information
  doc.setFontSize(12)
  doc.text(`Ders: ${courseData.code} - ${courseData.name}`, 20, 45)
  doc.text(`Şube: ${courseData.section}`, 20, 55)
  doc.text(`Tarih: ${formatDate(sessionData.date)}`, 20, 65)
  doc.text(`Saat: ${sessionData.startTime} - ${sessionData.endTime}`, 20, 75)
  doc.text(`Ders Türü: ${sessionData.type === 'makeup' ? 'Telafi' : 'Normal'}`, 20, 85)
  
  // Line separator
  doc.setLineWidth(0.5)
  doc.line(20, 95, 190, 95)
  
  // Attendance List
  let yPos = 110
  doc.setFont('helvetica', 'bold')
  
  // Headers
  doc.text('Öğrenci No', 20, yPos)
  doc.text('Ad Soyad', 60, yPos)
  doc.text('Durum', 130, yPos)
  doc.text('İmza', 160, yPos)
  
  yPos += 5
  doc.line(20, yPos, 190, yPos)
  yPos += 10
  
  // Student list
  doc.setFont('helvetica', 'normal')
  sessionData.attendance.forEach(record => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 30
    }
    
    const statusText = {
      present: 'Var',
      absent: 'Yok',
      excused: 'Mazeret',
      late: 'Geç'
    }[record.status] || 'Belirtilmemiş'
    
    doc.text(record.student.studentNumber, 20, yPos)
    doc.text(`${record.student.firstName} ${record.student.lastName}`, 60, yPos)
    doc.text(statusText, 130, yPos)
    
    // Signature line
    doc.line(160, yPos + 2, 185, yPos + 2)
    
    yPos += 12
  })
  
  // Footer
  yPos = Math.max(yPos + 20, 270)
  doc.setFontSize(10)
  doc.text(`Öğretim Görevlisi: ${courseData.instructor}`, 20, yPos)
  doc.text('İmza: ________________________', 20, yPos + 10)
  doc.text(`Tarih: ${formatDate(new Date())}`, 120, yPos + 10)
  
  return doc
}

// Download PDF
export const downloadPDF = (doc, filename) => {
  doc.save(filename)
}

// Preview PDF (open in new tab)
export const previewPDF = (doc) => {
  const pdfBlob = doc.output('blob')
  const url = URL.createObjectURL(pdfBlob)
  window.open(url, '_blank')
  
  // Clean up the URL after a delay
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}