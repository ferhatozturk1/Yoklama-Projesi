// Demo data for testing purposes

export const demoUsers = [
  {
    email: 'demo@example.com',
    password: '123456',
    firstName: 'Demo',
    lastName: 'Kullanıcı',
    title: 'Dr.',
    university: 'Demo Üniversitesi',
    faculty: 'Demo Fakültesi',
    department: 'Demo Bölümü'
  },
  {
    email: 'ahmet.yilmaz@universite.edu.tr',
    password: 'password123',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    title: 'Prof. Dr.',
    university: 'İstanbul Teknik Üniversitesi',
    faculty: 'Mühendislik Fakültesi',
    department: 'Bilgisayar Mühendisliği'
  },
  {
    email: 'fatma.demir@universite.edu.tr',
    password: 'password123',
    firstName: 'Fatma',
    lastName: 'Demir',
    title: 'Doç. Dr.',
    university: 'Ankara Üniversitesi',
    faculty: 'Eğitim Fakültesi',
    department: 'Matematik Öğretmenliği'
  }
]

export const demoCourses = [
  {
    id: '1',
    code: 'BIL101',
    name: 'Bilgisayar Programlama I',
    section: '1',
    classroom: 'A-201',
    schedule: {
      day: 'monday',
      startTime: '09:00',
      endTime: '11:00'
    }
  },
  {
    id: '2',
    code: 'BIL102',
    name: 'Bilgisayar Programlama II',
    section: '2',
    classroom: 'A-202',
    schedule: {
      day: 'wednesday',
      startTime: '13:00',
      endTime: '15:00'
    }
  },
  {
    id: '3',
    code: 'MAT201',
    name: 'Matematik I',
    section: '1',
    classroom: 'B-101',
    schedule: {
      day: 'friday',
      startTime: '10:00',
      endTime: '12:00'
    }
  }
]

export const demoStudents = [
  {
    id: '1',
    studentNumber: '20210001',
    firstName: 'Ali',
    lastName: 'Veli',
    email: 'ali.veli@ogrenci.edu.tr'
  },
  {
    id: '2',
    studentNumber: '20210002',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    email: 'ayse.kaya@ogrenci.edu.tr'
  },
  {
    id: '3',
    studentNumber: '20210003',
    firstName: 'Mehmet',
    lastName: 'Özkan',
    email: 'mehmet.ozkan@ogrenci.edu.tr'
  }
]

export const demoHolidays = [
  {
    id: '1',
    name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',
    date: '2024-04-23',
    type: 'national'
  },
  {
    id: '2',
    name: '1 Mayıs İşçi Bayramı',
    date: '2024-05-01',
    type: 'national'
  },
  {
    id: '3',
    name: '19 Mayıs Atatürk\'ü Anma Gençlik ve Spor Bayramı',
    date: '2024-05-19',
    type: 'national'
  }
]

export const demoExamPeriods = [
  {
    id: '1',
    name: 'Ara Sınav Dönemi',
    startDate: '2024-11-04',
    endDate: '2024-11-15',
    type: 'midterm'
  },
  {
    id: '2',
    name: 'Final Sınav Dönemi',
    startDate: '2024-12-16',
    endDate: '2024-12-27',
    type: 'final'
  }
]

// Helper function to get demo user by email
export const getDemoUserByEmail = (email) => {
  return demoUsers.find(user => user.email === email)
}

// Helper function to generate random demo data
export const generateDemoAttendance = (courseId, studentCount = 30, sessionCount = 10) => {
  const attendance = []
  
  for (let session = 1; session <= sessionCount; session++) {
    const sessionData = {
      id: `session-${session}`,
      courseId,
      date: new Date(2024, 9, session).toISOString(), // October 2024
      type: session % 7 === 0 ? 'makeup' : 'regular',
      attendance: []
    }
    
    for (let student = 1; student <= studentCount; student++) {
      const statuses = ['present', 'absent', 'excused']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      sessionData.attendance.push({
        studentId: `student-${student}`,
        studentNumber: `202100${student.toString().padStart(2, '0')}`,
        firstName: `Öğrenci${student}`,
        lastName: `Soyad${student}`,
        status: randomStatus,
        timestamp: new Date(2024, 9, session, 9, Math.floor(Math.random() * 60)).toISOString()
      })
    }
    
    attendance.push(sessionData)
  }
  
  return attendance
}