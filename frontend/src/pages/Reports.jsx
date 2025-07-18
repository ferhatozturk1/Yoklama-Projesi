import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { showSuccess, showError } from '../components/common/ToastNotification';
import './Reports.css';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    {
      id: 'general',
      title: 'Genel Yoklama Raporu',
      description: 'Tüm dersler için kapsamlı yoklama özeti',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      color: 'primary',
      features: ['Tüm dersler', 'Devam oranları', 'Trend analizi', 'Grafik görünüm']
    },
    {
      id: 'course',
      title: 'Ders Bazlı Rapor',
      description: 'Belirli bir ders için detaylı yoklama analizi',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      color: 'success',
      features: ['Ders detayları', 'Öğrenci listesi', 'Devam durumu', 'Eksik öğrenciler']
    },
    {
      id: 'student',
      title: 'Öğrenci Bazlı Rapor',
      description: 'Öğrenci devam durumu ve performans analizi',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: 'warning',
      features: ['Bireysel analiz', 'Devam geçmişi', 'Risk analizi', 'Performans grafiği']
    },
    {
      id: 'attendance',
      title: 'Yoklama Geçmişi',
      description: 'Tarih bazlı yoklama kayıtları ve istatistikler',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <path d="M8 14h.01"/>
          <path d="M12 14h.01"/>
          <path d="M16 14h.01"/>
          <path d="M8 18h.01"/>
          <path d="M12 18h.01"/>
          <path d="M16 18h.01"/>
        </svg>
      ),
      color: 'info',
      features: ['Tarih aralığı', 'Yoklama kayıtları', 'Günlük istatistik', 'Karşılaştırma']
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'BIL101 - Haftalık Rapor',
      type: 'Ders Bazlı',
      date: '2024-01-15',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Genel Yoklama Özeti',
      type: 'Genel Rapor',
      date: '2024-01-10',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 3,
      title: 'Öğrenci Devam Analizi',
      type: 'Öğrenci Bazlı',
      date: '2024-01-08',
      status: 'processing',
      downloadUrl: null
    }
  ];

  const courses = [
    { id: '1', code: 'BIL101', name: 'Bilgisayar Programlama I' },
    { id: '2', code: 'BIL102', name: 'Bilgisayar Programlama II' },
    { id: '3', code: 'MAT201', name: 'Matematik I' }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      showError('Lütfen bir rapor türü seçin');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess('Rapor başarıyla oluşturuldu!');
      setSelectedReportType(null);
    } catch (error) {
      showError('Rapor oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportId) => {
    showSuccess('Rapor indiriliyor...');
  };

  return (
    <Layout showSidebar={true}>
      <div className="reports-page">
        {/* Header */}
        <div className="reports-header">
          <div className="header-content">
            <h1 className="page-title">Raporlar ve Analizler</h1>
            <p className="page-subtitle">
              Yoklama verilerinizi analiz edin ve detaylı raporlar oluşturun
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-number">24</div>
              <div className="stat-label">Toplam Rapor</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">89%</div>
              <div className="stat-label">Ortalama Devam</div>
            </div>
          </div>
        </div>

        <div className="reports-content">
          {/* Report Types */}
          <Card className="report-types-card">
            <Card.Header>
              <Card.Title>Rapor Türü Seçin</Card.Title>
              <Card.Description>
                İhtiyacınıza uygun rapor türünü seçerek detaylı analiz oluşturun
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="report-types-grid">
                {reportTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`report-type-card ${selectedReportType === type.id ? 'report-type-card--selected' : ''} report-type-card--${type.color}`}
                    onClick={() => setSelectedReportType(type.id)}
                  >
                    <div className="report-type-header">
                      <div className="report-type-icon">
                        {type.icon}
                      </div>
                      <div className="report-type-info">
                        <h3 className="report-type-title">{type.title}</h3>
                        <p className="report-type-description">{type.description}</p>
                      </div>
                    </div>
                    <div className="report-type-features">
                      {type.features.map((feature, index) => (
                        <span key={index} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                    {selectedReportType === type.id && (
                      <div className="selected-indicator">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Report Configuration */}
          {selectedReportType && (
            <Card className="report-config-card">
              <Card.Header>
                <Card.Title>Rapor Ayarları</Card.Title>
                <Card.Description>
                  Rapor parametrelerini belirleyin
                </Card.Description>
              </Card.Header>
              <Card.Body>
                <div className="config-form">
                  <div className="form-row">
                    <Input
                      label="Başlangıç Tarihi"
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                    <Input
                      label="Bitiş Tarihi"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>

                  {(selectedReportType === 'course' || selectedReportType === 'student') && (
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Ders Seçin</label>
                        <select
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          className="form-select"
                        >
                          <option value="">Ders seçin...</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {course.code} - {course.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedReportType(null)}
                    >
                      İptal
                    </Button>
                    <Button
                      variant="primary"
                      loading={loading}
                      onClick={handleGenerateReport}
                      icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7,10 12,15 17,10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      }
                    >
                      Rapor Oluştur
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Recent Reports */}
          <Card className="recent-reports-card">
            <Card.Header>
              <Card.Title>Son Raporlar</Card.Title>
              <Button variant="ghost" size="sm">
                Tümünü Gör
              </Button>
            </Card.Header>
            <Card.Body>
              {recentReports.length > 0 ? (
                <div className="reports-list">
                  {recentReports.map((report) => (
                    <div key={report.id} className="report-item">
                      <div className="report-info">
                        <div className="report-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                          </svg>
                        </div>
                        <div className="report-details">
                          <h4 className="report-title">{report.title}</h4>
                          <div className="report-meta">
                            <span className="report-type">{report.type}</span>
                            <span className="report-date">{new Date(report.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="report-actions">
                        <div className={`report-status report-status--${report.status}`}>
                          {report.status === 'completed' && '✅ Tamamlandı'}
                          {report.status === 'processing' && '⏳ İşleniyor'}
                          {report.status === 'failed' && '❌ Hata'}
                        </div>
                        {report.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReport(report.id)}
                            icon={
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                            }
                          >
                            İndir
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <div className="empty-title">Henüz rapor oluşturulmamış</div>
                  <div className="empty-description">
                    Yukarıdaki seçeneklerden birini kullanarak ilk raporunuzu oluşturun
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <div className="quick-stats-grid">
            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon stat-icon--primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-number">92%</div>
                  <div className="stat-label">Bu Ay Devam Oranı</div>
                </div>
              </div>
            </Card>

            <Card className="stat-card">
              <div className="stat-content">
                <div className="stat-icon stat-icon--success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-number">156</div>
                  <div className="stat-label">Toplam Yoklama</div>
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
                  <div className="stat-number">245</div>
                  <div className="stat-label">Toplam Öğrenci</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;