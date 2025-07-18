import React, { useState, useEffect } from 'react';
import './AcademicCalendar.css';

const AcademicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarSettings, setCalendarSettings] = useState(null);

  // Varsayılan ayarları yükle
  const defaultSettings = {
    academicYear: '2024-2025',
    semesterDates: {
      fallStart: '2024-09-16',
      fallEnd: '2025-01-31',
      springStart: '2025-02-17',
      springEnd: '2025-06-20'
    },
    holidays: [
      { id: 1, date: '2024-01-01', name: 'Yılbaşı', type: 'national' },
      { id: 2, date: '2024-04-23', name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı', type: 'national' },
      { id: 3, date: '2024-05-01', name: '1 Mayıs İşçi Bayramı', type: 'national' },
      { id: 4, date: '2024-05-19', name: '19 Mayıs Atatürk\'ü Anma Gençlik ve Spor Bayramı', type: 'national' },
      { id: 5, date: '2024-08-30', name: '30 Ağustos Zafer Bayramı', type: 'national' },
      { id: 6, date: '2024-10-29', name: '29 Ekim Cumhuriyet Bayramı', type: 'national' },
      { id: 7, date: '2024-11-10', name: 'Atatürk\'ü Anma Günü', type: 'national' }
    ],
    examPeriods: [
      { id: 1, name: 'Güz Dönemi Ara Sınav', startDate: '2024-11-04', endDate: '2024-11-15', semester: 'fall' },
      { id: 2, name: 'Güz Dönemi Final Sınav', startDate: '2024-12-16', endDate: '2024-12-27', semester: 'fall' }
    ]
  };

  // Ayarları localStorage'dan yükle
  useEffect(() => {
    const savedSettings = localStorage.getItem('academicCalendarSettings');
    if (savedSettings) {
      setCalendarSettings(JSON.parse(savedSettings));
    } else {
      setCalendarSettings(defaultSettings);
    }
  }, []);

  if (!calendarSettings) {
    return <div>Takvim yükleniyor...</div>;
  }

  // Tatilleri obje formatına çevir
  const holidays = {};
  calendarSettings.holidays.forEach(holiday => {
    holidays[holiday.date] = holiday.name;
  });

  // Sınav dönemlerini obje formatına çevir
  const examPeriods = {};
  calendarSettings.examPeriods.forEach(exam => {
    examPeriods[exam.startDate] = `${exam.name} Başlangıcı`;
    examPeriods[exam.endDate] = `${exam.name} Sonu`;
  });

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date) => {
    const dateStr = formatDate(date);
    return holidays[dateStr];
  };

  const getDayType = (date) => {
    if (isHoliday(date)) return 'holiday';
    if (isWeekend(date)) return 'weekend';
    return 'school';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        day: prevDate.getDate()
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        day: day
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        day: day
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="academic-calendar">
      <div className="calendar-header">
        <h2>Akademik Takvim {calendarSettings.academicYear}</h2>
        <div className="calendar-navigation">
          <button 
            className="nav-button"
            onClick={() => navigateMonth(-1)}
          >
            ‹
          </button>
          <h3>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button 
            className="nav-button"
            onClick={() => navigateMonth(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-table">
        <table className="calendar-grid">
          <thead>
            <tr className="calendar-header-row">
              {dayNames.map(day => (
                <th key={day} className="day-header">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
              <tr key={weekIndex} className="calendar-week">
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayInfo, dayIndex) => {
                  const dayType = getDayType(dayInfo.date);
                  const holiday = isHoliday(dayInfo.date);
                  const isToday = formatDate(dayInfo.date) === formatDate(new Date());
                  
                  return (
                    <td
                      key={dayIndex}
                      className={`calendar-day ${dayType} ${
                        !dayInfo.isCurrentMonth ? 'other-month' : ''
                      } ${isToday ? 'today' : ''}`}
                    >
                      <div className="day-content">
                        <span className="day-number">{dayInfo.day}</span>
                        {holiday && (
                          <div className="day-event holiday-event">
                            {holiday}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="calendar-legend">
        <h4>Açıklamalar</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color school-day"></span>
            <span>Okul Günleri (Beyaz)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color weekend-day"></span>
            <span>Hafta Sonu (Açık Gri)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color holiday-day"></span>
            <span>Resmi Tatiller (Koyu Gri)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;