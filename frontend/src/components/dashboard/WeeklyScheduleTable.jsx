import React, { useState, useEffect } from 'react'
import { getWeekDays, generateTimeSlots } from '../../utils/dateHelpers'
import { 
  saveScheduleToStorage, 
  loadScheduleFromStorage, 
  validateSchedule, 
  detectScheduleConflicts,
  extendScheduleTo15Weeks 
} from '../../utils/scheduleHelpers'
import { showSuccess, showError, showWarning } from '../common/ToastNotification'

const WeeklyScheduleTable = ({ schedule = {}, onScheduleUpdate, onCreateSchedule }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingCell, setEditingCell] = useState(null)
  const [tempSchedule, setTempSchedule] = useState(schedule)
  const [conflicts, setConflicts] = useState([])
  const [showExtended, setShowExtended] = useState(false)

  useEffect(() => {
    // Load schedule from storage on component mount
    const savedSchedule = loadScheduleFromStorage()
    if (Object.keys(savedSchedule).length > 0 && Object.keys(schedule).length === 0) {
      setTempSchedule(savedSchedule)
      onScheduleUpdate(savedSchedule)
    }
  }, [])

  useEffect(() => {
    // Check for conflicts whenever schedule changes
    const scheduleConflicts = detectScheduleConflicts(tempSchedule)
    setConflicts(scheduleConflicts)
  }, [tempSchedule])

  const weekDays = getWeekDays()
  const timeSlots = generateTimeSlots(8, 18) // 8 AM to 6 PM

  const handleCellClick = (day, timeSlot) => {
    if (!isEditing) return
    
    setEditingCell({ day: day.key, timeSlot: timeSlot.start })
  }

  const handleCellSave = (day, timeSlot, courseData) => {
    const newSchedule = { ...tempSchedule }
    if (!newSchedule[day]) {
      newSchedule[day] = {}
    }
    
    if (courseData) {
      newSchedule[day][timeSlot] = courseData
    } else {
      delete newSchedule[day][timeSlot]
    }
    
    setTempSchedule(newSchedule)
    setEditingCell(null)
  }

  const handleSaveSchedule = () => {
    onScheduleUpdate(tempSchedule)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setTempSchedule(schedule)
    setIsEditing(false)
    setEditingCell(null)
  }

  const getCellContent = (day, timeSlot) => {
    const courseData = tempSchedule[day.key]?.[timeSlot.start]
    if (!courseData) return null

    return (
      <div className="p-2 bg-blue-100 border border-blue-200 rounded text-xs">
        <div className="font-medium text-blue-900">{courseData.code}</div>
        <div className="text-blue-700">{courseData.classroom}</div>
        <div className="text-blue-600">Şube: {courseData.section}</div>
      </div>
    )
  }

  const isEmpty = Object.keys(schedule).length === 0

  if (isEmpty && !isEditing) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Haftalık Program</h2>
          <button 
            onClick={onCreateSchedule}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Program Oluştur
          </button>
        </div>
        
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">Henüz program oluşturulmamış</p>
          <p className="text-sm">Haftalık ders programınızı oluşturmak için yukarıdaki butona tıklayın</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Haftalık Program</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button 
                onClick={handleSaveSchedule}
                className="btn btn-primary"
              >
                Kaydet
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Düzenle
            </button>
          )}
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 bg-gray-50 text-left text-sm font-medium text-gray-900 w-24">
                Saat
              </th>
              {weekDays.map(day => (
                <th key={day.key} className="border border-gray-200 p-2 bg-gray-50 text-center text-sm font-medium text-gray-900">
                  <div>{day.name}</div>
                  <div className="text-xs text-gray-500 font-normal">{day.short}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot.start}>
                <td className="border border-gray-200 p-2 bg-gray-50 text-sm font-medium text-gray-700">
                  <div>{timeSlot.start}</div>
                  <div className="text-xs text-gray-500">{timeSlot.end}</div>
                </td>
                {weekDays.map(day => (
                  <td 
                    key={`${day.key}-${timeSlot.start}`}
                    className={`border border-gray-200 p-1 h-20 align-top ${
                      isEditing ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={() => handleCellClick(day, timeSlot)}
                  >
                    {editingCell?.day === day.key && editingCell?.timeSlot === timeSlot.start ? (
                      <CourseEditForm
                        initialData={tempSchedule[day.key]?.[timeSlot.start]}
                        onSave={(data) => handleCellSave(day.key, timeSlot.start, data)}
                        onCancel={() => setEditingCell(null)}
                      />
                    ) : (
                      getCellContent(day, timeSlot)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      {isEditing && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Düzenleme Modu:</strong> Ders eklemek veya düzenlemek için hücrelere tıklayın. 
            Değişikliklerinizi kaydetmeyi unutmayın.
          </p>
        </div>
      )}
    </div>
  )
}

// Course Edit Form Component
const CourseEditForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    section: initialData?.section || '',
    classroom: initialData?.classroom || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.code.trim()) {
      onSave(formData)
    } else {
      onSave(null) // Remove course
    }
  }

  const handleDelete = () => {
    onSave(null)
  }

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-white border border-blue-300 rounded shadow-lg">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Ders Kodu"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full text-xs p-1 border border-gray-300 rounded"
          autoFocus
        />
        <input
          type="text"
          placeholder="Ders Adı"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full text-xs p-1 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Şube"
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          className="w-full text-xs p-1 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Derslik"
          value={formData.classroom}
          onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
          className="w-full text-xs p-1 border border-gray-300 rounded"
        />
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex space-x-1">
          <button
            type="submit"
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            İptal
          </button>
        </div>
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sil
          </button>
        )}
      </div>
    </form>
  )
}

export default WeeklyScheduleTable