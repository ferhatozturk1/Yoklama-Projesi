import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTimeBasedGreeting, getMotivationalMessage, formatDate } from '../utils/dateHelpers';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AcademicCalendar from '../components/AcademicCalendar';
import { showSuccess } from '../components/common/ToastNotification';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [courses, setCourses] = useState([
    {
      id: '1',
      code: 'BIL101',
      name: 'Bilgisayar Programlama I',
      section: '1',
      classroom: 'A-201',
      status: 'active',
      studentCount: 32,
      sessionsHeld: 8,
      attendanceRate: 85,
      schedule: {
        day: 'Pazartesi',
        startTime: '09:00',
        endTime: '11:00'
      },
      nextClass: '25 Kasım 2024, Pazartesi 09:00',
      semester: '2024-fall',
      color: '#3B82F6'
    },
    {
      id: '2',
      code: 'BIL102',
      name: 'Bilgisayar Programlama II',
      section: '2',
      classroom: 'A-202',
      status: 'active',
      studentCount: 28,
      sessionsHeld: 6,
      attendanceRate: 92,
      schedule: {
        day: 'Çarşamba',
        startTime: '13:00',
        endTime: '15:00'
      },
      nextClass: '27 Kasım 2024, Çarşamba 13:00',
      semester: '2024-fall',
      color: '#10B981'
    },
    {
      id: '3',
      code: 'MAT201',
      name: 'Matematik I',
      section: '1',
      classroom: 'B-101',
      status: 'active',
      studentCount: 25,
      sessionsHeld: 10,
      attendanceRate: 78,
      schedule: {
        day: 'Cuma',
        startTime: '10:00',
        endTime: '12:00'
      },
      nextClass: '29 Kasım 2024, Cuma 10:00',
      semester: '2024-fall',
      color: '#F59E0B'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const greeting = getTimeBasedGreeting();
  const motivationalMessage = getMotivationalMessage();
  const today = formatDate(new Date(), 'dd MMMM yyyy, EEEE');

  const stats = {
    weeklyClasses: 5,
    todayClasses: 2,
    makeupClasses: 1,
    totalStudents: 85,
    completedAttendance: 12,
    attendanceRate: 87
  };

  const todaysCourses = courses.filter(course => {
    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
    return course.schedule.day === today;
  });

  const upcomingTasks = [
    { id: 1, title: 'BIL101 - Ara Sınav Notları', deadline: '2 gün', priority: 'high' },
    { id: 2, title: 'MAT201 - Ödev Kontrolü', deadline: '5 gün', priority: 'medium' },
    { id: 3, title: 'BIL102 - Proje Sunumları', deadline: '1 hafta', priority: 'low' }
  ];

  const recentActivities = [
    { id: 1, action: 'Yoklama alındı', course: 'BIL101', time: '2 saat önce', icon: '✅' },
    { id: 2, action: 'Öğrenci listesi güncellendi', course: 'MAT201', time: '5 saat önce', icon: '👥' },
    { id: 3, action: 'Rapor oluşturuldu', course: 'BIL102', time: '1 gün önce', icon: '📊' }
  ];

  return (
    <Layout showSidebar={true}>
      <div className="dashboard">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                {greeting}, {user?.title} {user?.firstName} {user?.lastName}! 👋
              </h1>
              <p className="hero-subtitle">{today}</p>
              <p className="hero-message">{motivationalMessage}</p>
            </div>
            <div className="hero-visual">
              <div className="hero-avatar">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hero-time">
                <div className="current-time">
                  {currentTime.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="current-date">
                  {currentTime.toLocaleDateString('tr-TR', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <Card className="stat-card stat-card--primary">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6l4-4 4 4"/>
                <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22"/>
                <path d="M20 22l-6.828-6.828A4 4 0 0 1 12 12.3"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.weeklyClasses}</div>
              <div className="stat-label">Bu Hafta Ders</div>
            </div>
          </Card>

          <Card className="stat-card stat-card--success">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.attendanceRate}%</div>
              <div className="stat-label">Devam Oranı</div>
            </div>
          </Card>

          <Card className="stat-card stat-card--warning">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalStudents}</div>
              <div className="stat-label">Toplam Öğrenci</div>
            </div>
          </Card>

          <Card className="stat-card stat-card--info">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.todayClasses}</div>
              <div className="stat-label">Bugünkü Dersler</div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Today's Courses */}
          <Card className="dashboard-section">
            <Card.Header>
              <Card.Title>Bugünkü Derslerim</Card.Title>
              <Button variant="ghost" size="sm">
                Tümünü Gör
              </Button>
            </Card.Header>
            <Card.Body>
              {todaysCourses.length > 0 ? (
                <div className="courses-today">
                  {todaysCourses.map(course => (
                    <div key={course.id} className="course-today-item">
                      <div 
                        className="course-color-indicator" 
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="course-info">
                        <div className="course-name">{course.name}</div>
                        <div className="course-details">
                          {course.code} • {course.classroom} • {course.schedule.startTime}-{course.schedule.endTime}
                        </div>
                      </div>
                      <div className="course-actions">
                        <Button size="sm" variant="primary">
                          Yoklama Al
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <div className="empty-title">Bugün ders yok</div>
                  <div className="empty-description">Dinlenme günü! Yarın için hazırlanabilirsiniz.</div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-section">
            <Card.Header>
              <Card.Title>Hızlı İşlemler</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="quick-actions">
                <Button 
                  className="quick-action-btn"
                  variant="outline"
                  onClick={() => showSuccess('Yeni ders ekleme özelliği yakında!')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Yeni Ders Ekle
                </Button>
                
                <Button 
                  className="quick-action-btn"
                  variant="outline"
                  onClick={() => showSuccess('Rapor oluşturma özelliği yakında!')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  Rapor Oluştur
                </Button>
                
                <Button 
                  className="quick-action-btn"
                  variant="outline"
                  onClick={() => showSuccess('Öğrenci listesi yükleme özelliği yakında!')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  Liste Yükle
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="dashboard-section">
            <Card.Header>
              <Card.Title>Yaklaşan Görevler</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="tasks-list">
                {upcomingTasks.map(task => (
                  <div key={task.id} className={`task-item task-item--${task.priority}`}>
                    <div className="task-info">
                      <div className="task-title">{task.title}</div>
                      <div className="task-deadline">{task.deadline} kaldı</div>
                    </div>
                    <div className={`task-priority task-priority--${task.priority}`}>
                      {task.priority === 'high' && '🔴'}
                      {task.priority === 'medium' && '🟡'}
                      {task.priority === 'low' && '🟢'}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Recent Activities */}
          <Card className="dashboard-section">
            <Card.Header>
              <Card.Title>Son Aktiviteler</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-info">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-details">
                        {activity.course} • {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* My Courses Overview */}
          <Card className="dashboard-section courses-overview">
            <Card.Header>
              <Card.Title>Derslerim</Card.Title>
              <Button variant="ghost" size="sm">
                Tümünü Gör
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course.id} className="course-card">
                    <div 
                      className="course-header"
                      style={{ backgroundColor: course.color }}
                    >
                      <div className="course-code">{course.code}</div>
                      <div className="course-section">Bölüm {course.section}</div>
                    </div>
                    <div className="course-body">
                      <div className="course-name">{course.name}</div>
                      <div className="course-details">
                        <div className="course-detail">
                          <span className="detail-icon">👥</span>
                          {course.studentCount} öğrenci
                        </div>
                        <div className="course-detail">
                          <span className="detail-icon">📊</span>
                          %{course.attendanceRate} devam
                        </div>
                      </div>
                    </div>
                    <div className="course-footer">
                      <Button size="sm" variant="outline" fullWidth>
                        Detaylar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Academic Calendar */}
          <Card className="dashboard-section academic-calendar-section">
            <Card.Header>
              <Card.Title>Akademik Takvim</Card.Title>
            </Card.Header>
            <Card.Body>
              <AcademicCalendar />
            </Card.Body>
          </Card>

          {/* Getting Started */}
          <Card className="dashboard-section getting-started">
            <Card.Header>
              <Card.Title>Başlangıç Rehberi</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="getting-started-steps">
                <div className="step-item completed">
                  <div className="step-number">✅</div>
                  <div className="step-content">
                    <div className="step-title">Hesap Oluşturuldu</div>
                    <div className="step-description">Başarıyla giriş yaptınız</div>
                  </div>
                </div>
                
                <div className="step-item active">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <div className="step-title">Profil Tamamla</div>
                    <div className="step-description">Profil bilgilerinizi güncelleyin</div>
                  </div>
                  <Button size="sm" variant="primary">
                    Tamamla
                  </Button>
                </div>
                
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <div className="step-title">İlk Dersinizi Ekleyin</div>
                    <div className="step-description">Ders programınızı oluşturun</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;