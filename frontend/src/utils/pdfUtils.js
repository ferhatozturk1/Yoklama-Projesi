import jsPDF from 'jspdf'
import 'jspdf-autotable'

/**
 * PDF generation utilities for the teacher attendance system
 */

// Configure jsPDF for Turkish characters
const configurePDF = (doc) => {
  // Set font for Turkish character support
  doc.setFont('helvetica')
  return doc
}

/**
 * Generate PDF for user profile
 * @param {Object} userProfile - User profile data
 * @returns {jsPDF} - PDF document
 */
export const generateProfilePDF = (userProfile) => {
  const doc = new jsPDF()
  configurePDF(doc)
  
  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Öğretmen Profil Bilgileri', 20, 30)
  
  // Personal Information Section
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Kişisel Bilgiler', 20, 50)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  let yPosition = 65
  
  const personalInfo = [
    ['Ad Soyad:', userProfile.name || 'Belirtilmemiş'],
    ['E-posta:', userProfile.email || 'Belirtilmemiş'],
    ['Telefon:', userProfile.phone || 'Belirtilmemiş'],
    ['Doğum Tarihi:', userProfile.birthDate ? new Date(userProfile.birthDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'],
    ['TC Kimlik No:', userProfile.tcNumber || 'Belirtilmemiş'],
    ['Adres:', userProfile.address || 'Belirtilmemiş']
  ]
  
  personalInfo.forEach(([label, value]) => {
    doc.text(label, 20, yPosition)
    doc.text(value, 80, yPosition)
    yPosition += 10
  })
  
  // Academic Information Section
  yPosition += 10
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Akademik Bilgiler', 20, yPosition)
  
  yPosition += 15
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  const academicInfo = [
    ['Üniversite:', userProfile.university || 'Belirtilmemiş'],
    ['Fakülte:', userProfile.faculty || 'Belirtilmemiş'],
    ['Bölüm:', userProfile.department || 'Belirtilmemiş'],
    ['Unvan:', userProfile.title || 'Belirtilmemiş'],
    ['Sicil No:', userProfile.registrationNumber || 'Belirtilmemiş'],
    ['Oda No:', userProfile.officeNumber || 'Belirtilmemiş']
  ]
  
  academicInfo.forEach(([label, value]) => {
    doc.text(label, 20, yPosition)
    doc.text(value, 80, yPosition)
    yPosition += 10
  })
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 20, pageHeight - 20)
  
  return doc
}

/**
 * Generate attendance report PDF
 * @param {Object} reportData - Attendance report data
 * @returns {jsPDF} - PDF document
 */
export const generateAttendanceReportPDF = (reportData) => {
  const doc = new jsPDF()
  configurePDF(doc)
  
  const { course, sessions, students, dateRange } = reportData
  
  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Devamsızlık Raporu', 20, 30)
  
  // Course Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Ders Bilgileri', 20, 50)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Ders Adı: ${course.name}`, 20, 65)
  doc.text(`Ders Kodu: ${course.code}`, 20, 75)
  doc.text(`Dönem: ${course.semester}`, 20, 85)
  doc.text(`Akademik Yıl: ${course.academicYear}`, 20, 95)
  
  if (dateRange) {
    doc.text(`Rapor Dönemi: ${dateRange.start} - ${dateRange.end}`, 20, 105)
  }
  
  // Attendance Table
  const tableData = students.map(student => {
    const attendanceData = sessions.map(session => {
      const attendance = session.attendances.find(a => a.studentId === student.id)
      return attendance ? getAttendanceSymbol(attendance.status) : '-'
    })
    
    const totalSessions = sessions.length
    const presentCount = sessions.reduce((count, session) => {
      const attendance = session.attendances.find(a => a.studentId === student.id)
      return attendance && attendance.status === 'present' ? count + 1 : count
    }, 0)
    const attendanceRate = totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(1) : '0'
    
    return [
      student.studentId,
      student.name,
      ...attendanceData,
      `${presentCount}/${totalSessions}`,
      `%${attendanceRate}`
    ]
  })
  
  const tableHeaders = [
    'Öğrenci No',
    'Ad Soyad',
    ...sessions.map((session, index) => `${index + 1}. Hafta`),
    'Toplam',
    'Oran'
  ]
  
  doc.autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 120,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  })
  
  // Legend
  const finalY = doc.lastAutoTable.finalY + 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Açıklamalar:', 20, finalY)
  
  doc.setFont('helvetica', 'normal')
  doc.text('✓ = Katıldı, ✗ = Katılmadı, M = Mazeret, - = Kayıt Yok', 20, finalY + 10)
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 20, pageHeight - 10)
  
  return doc
}

/**
 * Generate student list PDF
 * @param {Object} courseData - Course and student data
 * @returns {jsPDF} - PDF document
 */
export const generateStudentListPDF = (courseData) => {
  const doc = new jsPDF()
  configurePDF(doc)
  
  const { course, students } = courseData
  
  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Öğrenci Listesi', 20, 30)
  
  // Course Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Ders Bilgileri', 20, 50)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Ders Adı: ${course.name}`, 20, 65)
  doc.text(`Ders Kodu: ${course.code}`, 20, 75)
  doc.text(`Öğrenci Sayısı: ${students.length}`, 20, 85)
  
  // Student Table
  const tableData = students.map((student, index) => [
    index + 1,
    student.studentId,
    student.name,
    student.email || '-',
    student.phone || '-'
  ])
  
  doc.autoTable({
    head: [['Sıra', 'Öğrenci No', 'Ad Soyad', 'E-posta', 'Telefon']],
    body: tableData,
    startY: 100,
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { cellWidth: 50 },
      4: { cellWidth: 30 }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  })
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 20, pageHeight - 10)
  
  return doc
}

/**
 * Generate weekly schedule PDF
 * @param {Object} scheduleData - Weekly schedule data
 * @returns {jsPDF} - PDF document
 */
export const generateSchedulePDF = (scheduleData) => {
  const doc = new jsPDF('landscape') // Landscape for better table fit
  configurePDF(doc)
  
  const { schedule, teacherName, academicYear, semester } = scheduleData
  
  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Haftalık Ders Programı', 20, 30)
  
  // Teacher Information
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Öğretim Görevlisi: ${teacherName}`, 20, 45)
  doc.text(`Akademik Yıl: ${academicYear} - Dönem: ${semester}`, 20, 55)
  
  // Time slots
  const timeSlots = [
    '08:30-09:20', '09:30-10:20', '10:30-11:20', '11:30-12:20',
    '13:30-14:20', '14:30-15:20', '15:30-16:20', '16:30-17:20'
  ]
  
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
  
  // Create schedule table data
  const tableData = timeSlots.map(timeSlot => {
    const row = [timeSlot]
    days.forEach(day => {
      const courseInfo = schedule[day] && schedule[day][timeSlot]
      if (courseInfo) {
        row.push(`${courseInfo.name}\n${courseInfo.code}\n${courseInfo.room || ''}`)
      } else {
        row.push('-')
      }
    })
    return row
  })
  
  doc.autoTable({
    head: [['Saat', ...days]],
    body: tableData,
    startY: 70,
    styles: {
      fontSize: 9,
      cellPadding: 4,
      valign: 'middle',
      halign: 'center'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25, fillColor: [240, 240, 240] }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  })
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, pageHeight - 10)
  
  return doc
}

/**
 * Get attendance status symbol for PDF
 * @param {string} status - Attendance status
 * @returns {string} - Symbol representation
 */
const getAttendanceSymbol = (status) => {
  switch (status) {
    case 'present':
      return '✓'
    case 'absent':
      return '✗'
    case 'excused':
      return 'M'
    default:
      return '-'
  }
}

/**
 * Save PDF to file
 * @param {jsPDF} doc - PDF document
 * @param {string} filename - File name
 */
export const savePDF = (doc, filename) => {
  doc.save(filename)
}

/**
 * Get PDF as blob for upload or preview
 * @param {jsPDF} doc - PDF document
 * @returns {Blob} - PDF blob
 */
export const getPDFBlob = (doc) => {
  return doc.output('blob')
}

/**
 * Preview PDF in new window
 * @param {jsPDF} doc - PDF document
 */
export const previewPDF = (doc) => {
  const pdfUrl = doc.output('bloburl')
  window.open(pdfUrl, '_blank')
}