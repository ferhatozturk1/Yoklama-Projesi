import * as XLSX from 'xlsx'

/**
 * Excel export utilities for the teacher attendance system
 */

/**
 * Export attendance data to Excel
 * @param {Object} attendanceData - Attendance data to export
 * @returns {void}
 */
export const exportAttendanceToExcel = (attendanceData) => {
  const { course, sessions, students, dateRange } = attendanceData
  
  // Create workbook
  const workbook = XLSX.utils.book_new()
  
  // Create attendance sheet
  const attendanceSheet = createAttendanceSheet(course, sessions, students)
  XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Devamsızlık')
  
  // Create summary sheet
  const summarySheet = createAttendanceSummarySheet(course, sessions, students)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Özet')
  
  // Create course info sheet
  const courseInfoSheet = createCourseInfoSheet(course, dateRange)
  XLSX.utils.book_append_sheet(workbook, courseInfoSheet, 'Ders Bilgileri')
  
  // Generate filename
  const filename = `${course.code}_${course.name}_Devamsizlik_${new Date().toISOString().split('T')[0]}.xlsx`
  
  // Save file
  XLSX.writeFile(workbook, filename)
}

/**
 * Create attendance sheet
 * @param {Object} course - Course information
 * @param {Array} sessions - Session data
 * @param {Array} students - Student data
 * @returns {Object} - Excel worksheet
 */
const createAttendanceSheet = (course, sessions, students) => {
  // Create headers
  const headers = [
    'Öğrenci No',
    'Ad Soyad',
    ...sessions.map((session, index) => {
      const date = new Date(session.date).toLocaleDateString('tr-TR')
      return `${index + 1}. Hafta (${date})`
    }),
    'Toplam Katılım',
    'Toplam Devamsızlık',
    'Katılım Oranı (%)'
  ]
  
  // Create data rows
  const data = students.map(student => {
    const attendanceRow = [student.studentId, student.name]
    
    let presentCount = 0
    let absentCount = 0
    
    sessions.forEach(session => {
      const attendance = session.attendances.find(a => a.studentId === student.id)
      if (attendance) {
        const statusText = getAttendanceStatusText(attendance.status)
        attendanceRow.push(statusText)
        
        if (attendance.status === 'present') presentCount++
        else if (attendance.status === 'absent') absentCount++
      } else {
        attendanceRow.push('-')
      }
    })
    
    const totalSessions = sessions.length
    const attendanceRate = totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(1) : 0
    
    attendanceRow.push(presentCount)
    attendanceRow.push(absentCount)
    attendanceRow.push(attendanceRate)
    
    return attendanceRow
  })
  
  // Combine headers and data
  const sheetData = [headers, ...data]
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  
  // Set column widths
  const columnWidths = [
    { wch: 15 }, // Öğrenci No
    { wch: 25 }, // Ad Soyad
    ...sessions.map(() => ({ wch: 12 })), // Session columns
    { wch: 15 }, // Toplam Katılım
    { wch: 15 }, // Toplam Devamsızlık
    { wch: 15 }  // Katılım Oranı
  ]
  worksheet['!cols'] = columnWidths
  
  // Style headers
  const headerRange = XLSX.utils.decode_range(worksheet['!ref'])
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "2980B9" } },
        font: { color: { rgb: "FFFFFF" } }
      }
    }
  }
  
  return worksheet
}

/**
 * Create attendance summary sheet
 * @param {Object} course - Course information
 * @param {Array} sessions - Session data
 * @param {Array} students - Student data
 * @returns {Object} - Excel worksheet
 */
const createAttendanceSummarySheet = (course, sessions, students) => {
  const summaryData = []
  
  // Course summary
  summaryData.push(['Ders Özeti', ''])
  summaryData.push(['Ders Adı', course.name])
  summaryData.push(['Ders Kodu', course.code])
  summaryData.push(['Toplam Öğrenci', students.length])
  summaryData.push(['Toplam Hafta', sessions.length])
  summaryData.push(['', ''])
  
  // Attendance statistics
  summaryData.push(['Devamsızlık İstatistikleri', ''])
  
  const totalPossibleAttendances = students.length * sessions.length
  let totalPresent = 0
  let totalAbsent = 0
  let totalExcused = 0
  
  sessions.forEach(session => {
    session.attendances.forEach(attendance => {
      switch (attendance.status) {
        case 'present':
          totalPresent++
          break
        case 'absent':
          totalAbsent++
          break
        case 'excused':
          totalExcused++
          break
      }
    })
  })
  
  summaryData.push(['Toplam Katılım', totalPresent])
  summaryData.push(['Toplam Devamsızlık', totalAbsent])
  summaryData.push(['Toplam Mazeret', totalExcused])
  summaryData.push(['Genel Katılım Oranı (%)', ((totalPresent / totalPossibleAttendances) * 100).toFixed(1)])
  summaryData.push(['', ''])
  
  // Weekly attendance summary
  summaryData.push(['Haftalık Katılım', ''])
  sessions.forEach((session, index) => {
    const weekPresent = session.attendances.filter(a => a.status === 'present').length
    const weekTotal = session.attendances.length
    const weekRate = weekTotal > 0 ? ((weekPresent / weekTotal) * 100).toFixed(1) : 0
    const date = new Date(session.date).toLocaleDateString('tr-TR')
    summaryData.push([`${index + 1}. Hafta (${date})`, `${weekPresent}/${weekTotal} (%${weekRate})`])
  })
  
  const worksheet = XLSX.utils.aoa_to_sheet(summaryData)
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 },
    { wch: 20 }
  ]
  
  return worksheet
}

/**
 * Create course information sheet
 * @param {Object} course - Course information
 * @param {Object} dateRange - Date range for report
 * @returns {Object} - Excel worksheet
 */
const createCourseInfoSheet = (course, dateRange) => {
  const courseData = [
    ['Ders Bilgileri', ''],
    ['Ders Adı', course.name || ''],
    ['Ders Kodu', course.code || ''],
    ['Dönem', course.semester || ''],
    ['Akademik Yıl', course.academicYear || ''],
    ['Kredi', course.credits || ''],
    ['AKTS', course.ects || ''],
    ['Ders Türü', course.type || ''],
    ['', ''],
    ['Rapor Bilgileri', ''],
    ['Rapor Tarihi', new Date().toLocaleDateString('tr-TR')],
    ['Rapor Saati', new Date().toLocaleTimeString('tr-TR')]
  ]
  
  if (dateRange) {
    courseData.push(['Rapor Dönemi Başlangıç', dateRange.start])
    courseData.push(['Rapor Dönemi Bitiş', dateRange.end])
  }
  
  const worksheet = XLSX.utils.aoa_to_sheet(courseData)
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 },
    { wch: 30 }
  ]
  
  return worksheet
}

/**
 * Export student list to Excel
 * @param {Object} courseData - Course and student data
 * @returns {void}
 */
export const exportStudentListToExcel = (courseData) => {
  const { course, students } = courseData
  
  // Create workbook
  const workbook = XLSX.utils.book_new()
  
  // Create student list sheet
  const headers = ['Sıra', 'Öğrenci No', 'Ad Soyad', 'E-posta', 'Telefon', 'Kayıt Tarihi']
  const data = students.map((student, index) => [
    index + 1,
    student.studentId,
    student.name,
    student.email || '',
    student.phone || '',
    student.createdAt ? new Date(student.createdAt).toLocaleDateString('tr-TR') : ''
  ])
  
  const sheetData = [headers, ...data]
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 },  // Sıra
    { wch: 15 }, // Öğrenci No
    { wch: 25 }, // Ad Soyad
    { wch: 30 }, // E-posta
    { wch: 15 }, // Telefon
    { wch: 15 }  // Kayıt Tarihi
  ]
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Öğrenci Listesi')
  
  // Add course info sheet
  const courseInfoSheet = createCourseInfoSheet(course)
  XLSX.utils.book_append_sheet(workbook, courseInfoSheet, 'Ders Bilgileri')
  
  // Generate filename
  const filename = `${course.code}_${course.name}_Ogrenci_Listesi_${new Date().toISOString().split('T')[0]}.xlsx`
  
  // Save file
  XLSX.writeFile(workbook, filename)
}

/**
 * Export weekly schedule to Excel
 * @param {Object} scheduleData - Weekly schedule data
 * @returns {void}
 */
export const exportScheduleToExcel = (scheduleData) => {
  const { schedule, teacherName, academicYear, semester } = scheduleData
  
  // Create workbook
  const workbook = XLSX.utils.book_new()
  
  // Time slots and days
  const timeSlots = [
    '08:30-09:20', '09:30-10:20', '10:30-11:20', '11:30-12:20',
    '13:30-14:20', '14:30-15:20', '15:30-16:20', '16:30-17:20'
  ]
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
  
  // Create schedule data
  const headers = ['Saat', ...days]
  const data = timeSlots.map(timeSlot => {
    const row = [timeSlot]
    days.forEach(day => {
      const courseInfo = schedule[day] && schedule[day][timeSlot]
      if (courseInfo) {
        row.push(`${courseInfo.name} (${courseInfo.code}) - ${courseInfo.room || 'Oda Belirtilmemiş'}`)
      } else {
        row.push('-')
      }
    })
    return row
  })
  
  const sheetData = [
    ['Haftalık Ders Programı', '', '', '', '', ''],
    [`Öğretim Görevlisi: ${teacherName}`, '', '', '', '', ''],
    [`Akademik Yıl: ${academicYear} - Dönem: ${semester}`, '', '', '', '', ''],
    ['', '', '', '', '', ''],
    headers,
    ...data
  ]
  
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 }, // Saat
    { wch: 25 }, // Pazartesi
    { wch: 25 }, // Salı
    { wch: 25 }, // Çarşamba
    { wch: 25 }, // Perşembe
    { wch: 25 }  // Cuma
  ]
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Haftalık Program')
  
  // Generate filename
  const filename = `Haftalik_Program_${academicYear}_${semester}_${new Date().toISOString().split('T')[0]}.xlsx`
  
  // Save file
  XLSX.writeFile(workbook, filename)
}

/**
 * Create Excel template for student import
 * @returns {void}
 */
export const createStudentImportTemplate = () => {
  const workbook = XLSX.utils.book_new()
  
  // Create template data
  const headers = ['name', 'studentId', 'email', 'phone']
  const sampleData = [
    ['Ahmet Yılmaz', '12345', 'ahmet@example.com', '05551234567'],
    ['Ayşe Demir', '12346', 'ayse@example.com', '05551234568'],
    ['Mehmet Kaya', '12347', 'mehmet@example.com', '05551234569']
  ]
  
  const sheetData = [
    ['Öğrenci Listesi İçe Aktarma Şablonu', '', '', ''],
    ['', '', '', ''],
    ['Açıklamalar:', '', '', ''],
    ['• name: Öğrencinin adı soyadı (zorunlu)', '', '', ''],
    ['• studentId: Öğrenci numarası (zorunlu, benzersiz olmalı)', '', '', ''],
    ['• email: E-posta adresi (isteğe bağlı)', '', '', ''],
    ['• phone: Telefon numarası (isteğe bağlı)', '', '', ''],
    ['', '', '', ''],
    ['Örnek veriler (bu satırları silebilirsiniz):', '', '', ''],
    headers,
    ...sampleData
  ]
  
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // name
    { wch: 15 }, // studentId
    { wch: 30 }, // email
    { wch: 15 }  // phone
  ]
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Öğrenci Şablonu')
  
  // Generate filename
  const filename = `Ogrenci_Listesi_Sablonu_${new Date().toISOString().split('T')[0]}.xlsx`
  
  // Save file
  XLSX.writeFile(workbook, filename)
}

/**
 * Get attendance status text for Excel
 * @param {string} status - Attendance status
 * @returns {string} - Status text
 */
const getAttendanceStatusText = (status) => {
  switch (status) {
    case 'present':
      return 'Katıldı'
    case 'absent':
      return 'Katılmadı'
    case 'excused':
      return 'Mazeret'
    default:
      return 'Kayıt Yok'
  }
}

/**
 * Read Excel file and parse student data
 * @param {File} file - Excel file
 * @returns {Promise<Array>} - Parsed student data
 */
export const parseStudentExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // Find header row (look for 'name' or 'studentId')
        let headerRowIndex = -1
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (row.includes('name') || row.includes('studentId')) {
            headerRowIndex = i
            break
          }
        }
        
        if (headerRowIndex === -1) {
          throw new Error('Geçerli başlık satırı bulunamadı')
        }
        
        const headers = jsonData[headerRowIndex]
        const dataRows = jsonData.slice(headerRowIndex + 1)
        
        // Convert to objects
        const students = dataRows
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map(row => {
            const student = {}
            headers.forEach((header, index) => {
              if (header && row[index] !== undefined) {
                student[header] = row[index]
              }
            })
            return student
          })
          .filter(student => student.name && student.studentId)
        
        resolve(students)
      } catch (error) {
        reject(new Error(`Excel dosyası okunamadı: ${error.message}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Dosya okuma hatası'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}