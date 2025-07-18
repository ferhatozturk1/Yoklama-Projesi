import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../components/common/ToastNotification';
import './ScheduleManagement.css';

const ScheduleManagement = () => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [schedule, setSchedule] = useState(getInitialSchedule());
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [courseModal, setCourseModal] = useState({ show: false, slot: null });

  // Time slots for the schedule (8:00 AM to 6:00 PM)
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Days of the week
  const weekDays = [
    { key: 'monday', label: 'Pazartesi', short: 'Pzt' },
    { key: 'tuesday', label: 'Salı', short: 'Sal' },
    { key: 'wednesday', label: 'Çarşamba', short: 'Çar' },
    { key: 'thursday', label: 'Perşembe', short: 'Per' },
    { key: 'friday', label: 'Cuma', short: 'Cum' }
  ];

  // Academic courses based on the provided schedule
  const availableCourses = [
    { 
      id: '1', 
      code: 'BIL101', 
      name: 'Bilgisayar Programlama I', 
      section: '1', 
      classroom: 'A-201', 
      color: '#3B82F6',
      instructor: 'Dr. Ahmet Yılmaz',
      students: 35
    },
    { 
      id: '2', 
      code: 'BIL102', 
      name: 'Veri Yapıları ve Algoritmalar', 
      section: '2', 
      classroom: 'A-202', 
      color: '#10B981',
      instructor: 'Dr. Mehmet Demir',
      students: 28
    },
    { 
      id: '3', 
      code: 'MAT201', 
      name: 'Matematik II (Calculus)', 
      section: '1', 
      classroom: 'B-101', 
      color: '#F59E0B',
      instructor: 'Prof. Dr. Ayşe Kaya',
      students: 42
    },
    { 
      id: '4', 
      code: 'BIL201', 
      name: 'Algoritma Analizi', 
      section: '1', 
      classroom: 'A-301', 
      color: '#EF4444',
      instructor: 'Dr. Fatma Özkan',
      students: 31
    },
    { 
      id: '5', 
      code: 'BIL301', 
      name: 'Yazılım Mühendisliği', 
      section: '1', 
      classroom: 'A-401', 
      color: '#8B5CF6',
      instructor: 'Dr. Can Özdemir',
      students: 24
    }
  ];

  function getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    return startOfWeek;
  }

  function getInitialSchedule() {
    return {
      monday: {
        '09:00': { courseId: '1', duration: 1 } // BIL101 A-201 Şube: 1
      },
      tuesday: {
        '10:00': { courseId: '3', duration: 1 } // MAT201 B-101 Şube: 1
      },
      wednesday: {
        '13:00': { courseId: '2', duration: 1 } // BIL102 A-202 Şube: 2
      },
      thursday: {
        '14:00': { courseId: '4', duration: 1 } // BIL201 A-301 Şube: 1
      }
    };
  }

  const getCourseById = (courseId) => {
    return availableCourses.find(course => course.id === courseId);
  };

  const formatTime = (time) => {
    return time;
  };

  const getEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSlotClick = (day, time) => {
    if (!isEditing) return;
    
    const slotKey = `${day}-${time}`;
    setSelectedSlot(slotKey);
    setCourseModal({ show: true, slot: { day, time } });
  };

  const handleAddCourse = (courseId, duration = 2) => {
    if (!selectedSlot || !courseModal.slot) return;

    const { day, time } = courseModal.slot;
    
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: { courseId, duration }
      }
    }));

    setCourseModal({ show: false, slot: null });
    setSelectedSlot(null);
    showSuccess('Ders başarıyla eklendi!');
  };

  const handleRemoveCourse = (day, time) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      if (newSchedule[day]) {
        delete newSchedule[day][time];
      }
      return newSchedule;
    });
    showSuccess('Ders başarıyla kaldırıldı!');
  };

  const isSlotOccupied = (day, time) => {
    return schedule[day] && schedule[day][time];
  };

  const getSlotCourse = (day, time) => {
    const slot = schedule[day] && schedule[day][time];
    if (!slot) return null;
    return getCourseById(slot.courseId);
  };

  const shouldShowSlot = (day, time, courseSlot) => {
    if (!courseSlot) return true;
    
    const timeIndex = timeSlots.indexOf(time);
    const slotStartIndex = timeSlots.findIndex(t => schedule[day][t] && schedule[day][t].courseId === courseSlot.courseId);
    
    return timeIndex === slotStartIndex;
  };

  const getSlotSpan = (day, time) => {
    const slot = schedule[day] && schedule[day][time];
    return slot ? slot.duration : 1;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setSelectedWeek(newWeek);
  };

  const formatWeekRange = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    return `${startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  return (
    <Layout showSidebar={true}>
      <div className="schedule-management">
        {/* Header */}
        <div className="schedule-header">
          <div className="header-content">
            <h1 className="page-title">Ders Programı Yönetimi</h1>
            <p className="page-subtitle">
              Haftalık ders programınızı oluşturun ve düzenleyin
            </p>
          </div>
          <div className="header-actions">
            <Button
              variant={isEditing ? 'success' : 'primary'}
              onClick={() => setIsEditing(!isEditing)}
              icon={
                isEditing ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                )
              }
            >
              {isEditing ? 'Düzenlemeyi Bitir' : 'Düzenle'}
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <Card className="week-navigation-card">
          <div className="week-navigation">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek(-1)}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"/>
                </svg>
              }
            >
              Önceki Hafta
            </Button>
            
            <div className="current-week">
              <h3 className="week-title">Haftalık Program</h3>
              <p className="week-range">{formatWeekRange(selectedWeek)}</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek(1)}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              }
              iconPosition="right"
            >
              Sonraki Hafta
            </Button>
          </div>
        </Card>

        {/* Schedule Table */}
        <Card className="schedule-table-card">
          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="time-header">Saat</th>
                  {weekDays.map(day => (
                    <th key={day.key} className="day-header">
                      <div className="day-info">
                        <span className="day-name">{day.label}</span>
                        <span className="day-short">{day.short}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="time-row">
                    <td className="time-cell">
                      <div className="time-slot">
                        <span className="time-start">{formatTime(time)}</span>
                        <span className="time-end">{formatTime(getEndTime(time, 1))}</span>
                      </div>
                    </td>
                    {weekDays.map(day => {
                      const courseSlot = schedule[day.key] && schedule[day.key][time];
                      const course = courseSlot ? getCourseById(courseSlot.courseId) : null;
                      const shouldShow = shouldShowSlot(day.key, time, courseSlot);
                      const rowSpan = courseSlot ? getSlotSpan(day.key, time) : 1;

                      if (!shouldShow) return null;

                      return (
                        <td
                          key={`${day.key}-${time}`}
                          className={`schedule-cell ${course ? 'has-course' : 'empty-cell'} ${isEditing ? 'editable' : ''}`}
                          rowSpan={rowSpan}
                          onClick={() => handleSlotClick(day.key, time)}
                        >
                          {course ? (
                            <div 
                              className="course-block"
                              style={{ backgroundColor: course.color }}
                            >
                              <div className="course-header">
                                <span className="course-code">{course.code}</span>
                                {isEditing && (
                                  <button
                                    className="remove-course-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveCourse(day.key, time);
                                    }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <line x1="18" y1="6" x2="6" y2="18"/>
                                      <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="course-name">{course.name}</div>
                              <div className="course-details">
                                <span className="course-section">Şube: {course.section}</span>
                                <span className="course-classroom">{course.classroom}</span>
                              </div>
                              <div className="course-instructor">{course.instructor}</div>
                              <div className="course-time">
                                {formatTime(time)} - {formatTime(getEndTime(time, courseSlot.duration))}
                              </div>
                            </div>
                          ) : (
                            isEditing && (
                              <div className="empty-slot">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="12" y1="5" x2="12" y2="19"/>
                                  <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                <span>Ders Ekle</span>
                              </div>
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Schedule Statistics */}
        <div className="schedule-stats-grid">
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon stat-icon--primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-number">{Object.keys(schedule).reduce((total, day) => total + Object.keys(schedule[day]).length, 0)}</div>
                <div className="stat-label">Haftalık Ders Sayısı</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon stat-icon--success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-number">{Object.keys(schedule).reduce((total, day) => total + Object.keys(schedule[day]).reduce((dayTotal, time) => dayTotal + schedule[day][time].duration, 0), 0)}</div>
                <div className="stat-label">Haftalık Ders Saati</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon stat-icon--warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-number">{availableCourses.reduce((total, course) => total + (course.students || 0), 0)}</div>
                <div className="stat-label">Toplam Öğrenci</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Course Selection Modal */}
        {courseModal.show && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Ders Seçin</h3>
                <button
                  className="modal-close"
                  onClick={() => setCourseModal({ show: false, slot: null })}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="course-selection-grid">
                  {availableCourses.map(course => (
                    <div
                      key={course.id}
                      className="course-option"
                      onClick={() => handleAddCourse(course.id)}
                    >
                      <div 
                        className="course-color-indicator"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="course-info">
                        <div className="course-code">{course.code}</div>
                        <div className="course-name">{course.name}</div>
                        <div className="course-details">
                          Şube: {course.section} • {course.classroom}
                        </div>
                        <div className="course-instructor-info">
                          {course.instructor} • {course.students} öğrenci
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScheduleManagement;