import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { showSuccess, showError } from '../components/common/ToastNotification';
import './CalendarSettings.css';

const CalendarSettings = () => {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semesterDates, setSemesterDates] = useState({
    fallStart: '2024-09-16',
    fallEnd: '2025-01-31',
    springStart: '2025-02-17',
    springEnd: '2025-06-20'
  });

  const [holidays, setHolidays] = useState([
    { id: 1, date: '2024-01-01', name: 'Yılbaşı', type: 'national' },
    { id: 2, date: '2024-04-23', name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı', type: 'national' },
    { id: 3, date: '2024-05-01', name: '1 Mayıs İşçi Bayramı', type: 'national' },
    { id: 4, date: '2024-05-19', name: '19 Mayıs Atatürk\'ü Anma Gençlik ve Spor Bayramı', type: 'national' },
    { id: 5, date: '2024-06-15', name: 'Kurban Bayramı Arifesi', type: 'religious' },
    { id: 6, date: '2024-06-16', name: 'Kurban Bayramı 1. Gün', type: 'religious' },
    { id: 7, date: '2024-06-17', name: 'Kurban Bayramı 2. Gün', type: 'religious' },
    { id: 8, date: '2024-06-18', name: 'Kurban Bayramı 3. Gün', type: 'religious' },
    { id: 9, date: '2024-06-19', name: 'Kurban Bayramı 4. Gün', type: 'religious' },
    { id: 10, date: '2024-08-30', name: '30 Ağustos Zafer Bayramı', type: 'national' },
    { id: 11, date: '2024-10-29', name: '29 Ekim Cumhuriyet Bayramı', type: 'national' },
    { id: 12, date: '2024-11-10', name: 'Atatürk\'ü Anma Günü', type: 'national' }
  ]);

  const [examPeriods, setExamPeriods] = useState([
    { id: 1, name: 'Güz Dönemi Ara Sınav', startDate: '2024-11-04', endDate: '2024-11-15', semester: 'fall' },
    { id: 2, name: 'Güz Dönemi Final Sınav', startDate: '2024-12-16', endDate: '2024-12-27', semester: 'fall' },
    { id: 3, name: 'Bahar Dönemi Ara Sınav', startDate: '2025-04-14', endDate: '2025-04-25', semester: 'spring' },
    { id: 4, name: 'Bahar Dönemi Final Sınav', startDate: '2025-06-02', endDate: '2025-06-13', semester: 'spring' }
  ]);

  const [newHoliday, setNewHoliday] = useState({
    date: '',
    name: '',
    type: 'national'
  });

  const [newExamPeriod, setNewExamPeriod] = useState({
    name: '',
    startDate: '',
    endDate: '',
    semester: 'fall'
  });

  const [activeTab, setActiveTab] = useState('semester');

  const handleSemesterDateChange = (field, value) => {
    setSemesterDates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHoliday = () => {
    if (!newHoliday.date || !newHoliday.name) {
      showError('Lütfen tarih ve tatil adını giriniz!');
      return;
    }

    const holiday = {
      id: Date.now(),
      ...newHoliday
    };

    setHolidays(prev => [...prev, holiday].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewHoliday({ date: '', name: '', type: 'national' });
    showSuccess('Tatil başarıyla eklendi!');
  };

  const removeHoliday = (id) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== id));
    showSuccess('Tatil silindi!');
  };

  const addExamPeriod = () => {
    if (!newExamPeriod.name || !newExamPeriod.startDate || !newExamPeriod.endDate) {
      showError('Lütfen tüm alanları doldurunuz!');
      return;
    }

    if (new Date(newExamPeriod.startDate) >= new Date(newExamPeriod.endDate)) {
      showError('Başlangıç tarihi bitiş tarihinden önce olmalıdır!');
      return;
    }

    const examPeriod = {
      id: Date.now(),
      ...newExamPeriod
    };

    setExamPeriods(prev => [...prev, examPeriod].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
    setNewExamPeriod({ name: '', startDate: '', endDate: '', semester: 'fall' });
    showSuccess('Sınav dönemi başarıyla eklendi!');
  };

  const removeExamPeriod = (id) => {
    setExamPeriods(prev => prev.filter(period => period.id !== id));
    showSuccess('Sınav dönemi silindi!');
  };

  const saveSettings = () => {
    // Burada ayarları kaydetme işlemi yapılacak
    const settings = {
      academicYear,
      semesterDates,
      holidays,
      examPeriods
    };
    
    localStorage.setItem('academicCalendarSettings', JSON.stringify(settings));
    showSuccess('Takvim ayarları başarıyla kaydedildi!');
  };

  const resetToDefaults = () => {
    if (window.confirm('Tüm ayarlar varsayılan değerlere sıfırlanacak. Emin misiniz?')) {
      // Varsayılan değerleri yükle
      setAcademicYear('2024-2025');
      setSemesterDates({
        fallStart: '2024-09-16',
        fallEnd: '2025-01-31',
        springStart: '2025-02-17',
        springEnd: '2025-06-20'
      });
      // Tatilleri ve sınav dönemlerini de sıfırla
      showSuccess('Ayarlar varsayılan değerlere sıfırlandı!');
    }
  };

  const getHolidayTypeIcon = (type) => {
    switch (type) {
      case 'national': return '🇹🇷';
      case 'religious': return '🕌';
      case 'academic': return '🎓';
      default: return '📅';
    }
  };

  const getHolidayTypeText = (type) => {
    switch (type) {
      case 'national': return 'Ulusal Bayram';
      case 'religious': return 'Dini Bayram';
      case 'academic': return 'Akademik Tatil';
      default: return 'Diğer';
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="calendar-settings">
        <div className="settings-header">
          <h1>Akademik Takvim Ayarları</h1>
          <p>Dönem tarihleri, tatiller ve sınav dönemlerini yönetin</p>
        </div>

        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'semester' ? 'active' : ''}`}
            onClick={() => setActiveTab('semester')}
          >
            📚 Dönem Bilgileri
          </button>
          <button 
            className={`tab-button ${activeTab === 'holidays' ? 'active' : ''}`}
            onClick={() => setActiveTab('holidays')}
          >
            🎉 Tatiller
          </button>
          <button 
            className={`tab-button ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            📝 Sınav Dönemleri
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'semester' && (
            <Card className="settings-card">
              <Card.Header>
                <Card.Title>Akademik Yıl ve Dönem Tarihleri</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Akademik Yıl</label>
                    <Input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="2024-2025"
                    />
                  </div>
                </div>

                <div className="semester-section">
                  <h3>🍂 Güz Dönemi</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Başlangıç Tarihi</label>
                      <Input
                        type="date"
                        value={semesterDates.fallStart}
                        onChange={(e) => handleSemesterDateChange('fallStart', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Bitiş Tarihi</label>
                      <Input
                        type="date"
                        value={semesterDates.fallEnd}
                        onChange={(e) => handleSemesterDateChange('fallEnd', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="semester-section">
                  <h3>🌸 Bahar Dönemi</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Başlangıç Tarihi</label>
                      <Input
                        type="date"
                        value={semesterDates.springStart}
                        onChange={(e) => handleSemesterDateChange('springStart', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Bitiş Tarihi</label>
                      <Input
                        type="date"
                        value={semesterDates.springEnd}
                        onChange={(e) => handleSemesterDateChange('springEnd', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'holidays' && (
            <div className="holidays-section">
              <Card className="settings-card">
                <Card.Header>
                  <Card.Title>Yeni Tatil Ekle</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Tarih</label>
                      <Input
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tatil Adı</label>
                      <Input
                        type="text"
                        value={newHoliday.name}
                        onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Tatil adını giriniz"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tür</label>
                      <select 
                        value={newHoliday.type}
                        onChange={(e) => setNewHoliday(prev => ({ ...prev, type: e.target.value }))}
                        className="form-select"
                      >
                        <option value="national">Ulusal Bayram</option>
                        <option value="religious">Dini Bayram</option>
                        <option value="academic">Akademik Tatil</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <Button onClick={addHoliday} variant="primary">
                        Tatil Ekle
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="settings-card">
                <Card.Header>
                  <Card.Title>Mevcut Tatiller</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="holidays-list">
                    {holidays.map(holiday => (
                      <div key={holiday.id} className="holiday-item">
                        <div className="holiday-info">
                          <span className="holiday-icon">{getHolidayTypeIcon(holiday.type)}</span>
                          <div className="holiday-details">
                            <div className="holiday-name">{holiday.name}</div>
                            <div className="holiday-meta">
                              {new Date(holiday.date).toLocaleDateString('tr-TR')} • {getHolidayTypeText(holiday.type)}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeHoliday(holiday.id)}
                        >
                          Sil
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="exams-section">
              <Card className="settings-card">
                <Card.Header>
                  <Card.Title>Yeni Sınav Dönemi Ekle</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Sınav Dönemi Adı</label>
                      <Input
                        type="text"
                        value={newExamPeriod.name}
                        onChange={(e) => setNewExamPeriod(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Örn: Güz Dönemi Ara Sınav"
                      />
                    </div>
                    <div className="form-group">
                      <label>Dönem</label>
                      <select 
                        value={newExamPeriod.semester}
                        onChange={(e) => setNewExamPeriod(prev => ({ ...prev, semester: e.target.value }))}
                        className="form-select"
                      >
                        <option value="fall">Güz Dönemi</option>
                        <option value="spring">Bahar Dönemi</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Başlangıç Tarihi</label>
                      <Input
                        type="date"
                        value={newExamPeriod.startDate}
                        onChange={(e) => setNewExamPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Bitiş Tarihi</label>
                      <Input
                        type="date"
                        value={newExamPeriod.endDate}
                        onChange={(e) => setNewExamPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <Button onClick={addExamPeriod} variant="primary">
                        Sınav Dönemi Ekle
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="settings-card">
                <Card.Header>
                  <Card.Title>Mevcut Sınav Dönemleri</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="exams-list">
                    {examPeriods.map(exam => (
                      <div key={exam.id} className="exam-item">
                        <div className="exam-info">
                          <span className="exam-icon">📝</span>
                          <div className="exam-details">
                            <div className="exam-name">{exam.name}</div>
                            <div className="exam-meta">
                              {new Date(exam.startDate).toLocaleDateString('tr-TR')} - {new Date(exam.endDate).toLocaleDateString('tr-TR')} • 
                              {exam.semester === 'fall' ? ' Güz Dönemi' : ' Bahar Dönemi'}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeExamPeriod(exam.id)}
                        >
                          Sil
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>

        <div className="settings-actions">
          <Button variant="outline" onClick={resetToDefaults}>
            Varsayılana Sıfırla
          </Button>
          <Button variant="primary" onClick={saveSettings}>
            Ayarları Kaydet
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarSettings;