import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');

  const courses = [
    {
      id: '1',
      code: 'BIL101',
      name: 'Bilgisayar Programlama I',
      section: '1',
      classroom: 'A-201',
      studentCount: 32,
      attendanceRate: 85,
      color: '#3B82F6',
      schedule: 'Pazartesi 09:00-11:00',
      semester: '2024-fall'
    },
    {
      id: '2',
      code: 'BIL102',
      name: 'Bilgisayar Programlama II',
      section: '2',
      classroom: 'A-202',
      studentCount: 28,
      attendanceRate: 92,
      color: '#10B981',
      schedule: 'Çarşamba 13:00-15:00',
      semester: '2024-fall'
    },
    {
      id: '3',
      code: 'MAT201',
      name: 'Matematik I',
      section: '1',
      classroom: 'B-101',
      studentCount: 25,
      attendanceRate: 78,
      color: '#F59E0B',
      schedule: 'Cuma 10:00-12:00',
      semester: '2024-fall'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || course.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <Layout>
      <div className="courses-page">
        <div className="courses-header">
          <div className="header-content">
            <h1 className="page-title">Derslerim</h1>
            <p className="page-subtitle">Verdiğiniz dersleri yönetin ve öğrenci listelerini düzenleyin</p>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }
          >
            Yeni Ders Ekle
          </Button>
        </div>

        <Card className="filters-card">
          <div className="filters-content">
            <Input
              placeholder="Ders ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              }
              clearable
            />
            <select 
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="semester-select"
            >
              <option value="all">Tüm Dönemler</option>
              <option value="2024-fall">2024 Güz</option>
              <option value="2024-spring">2024 Bahar</option>
            </select>
          </div>
        </Card>

        {filteredCourses.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3 className="empty-title">Henüz ders eklenmemiş</h3>
              <p className="empty-description">İlk dersinizi ekleyerek başlayın</p>
              <Button variant="primary" className="empty-action">
                Ders Ekle
              </Button>
            </div>
          </Card>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <Card 
                key={course.id} 
                className="course-card"
                hover
                clickable
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="course-header" style={{ backgroundColor: course.color }}>
                  <div className="course-code">{course.code}</div>
                  <div className="course-section">Bölüm {course.section}</div>
                </div>
                
                <Card.Body>
                  <Card.Title level={3}>{course.name}</Card.Title>
                  
                  <div className="course-info">
                    <div className="info-item">
                      <span className="info-icon">🏫</span>
                      <span>{course.classroom}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">👥</span>
                      <span>{course.studentCount} öğrenci</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📊</span>
                      <span>%{course.attendanceRate} devam</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">⏰</span>
                      <span>{course.schedule}</span>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer>
                  <div className="course-actions">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/attendance/${course.id}`);
                      }}
                    >
                      Yoklama Al
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${course.id}`);
                      }}
                    >
                      Detaylar
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;