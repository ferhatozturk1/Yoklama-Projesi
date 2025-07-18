import React, { useState } from 'react'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'

const SessionEndModal = ({ isOpen, onClose, onConfirm, session, attendanceData, students }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      
      // In demo mode, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the parent component's handler
      if (onConfirm) {
        onConfirm(notes)
      }
      
      onClose()
    } catch (error) {
      console.error('Error ending session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate attendance statistics
  const presentCount = attendanceData.filter(a => a.status === 'present').length
  const absentCount = attendanceData.filter(a => a.status === 'absent').length
  const excusedCount = attendanceData.filter(a => a.status === 'excused').length
  const notMarkedCount = students.length - attendanceData.length
  
  // Calculate attendance percentage
  const attendancePercentage = students.length > 0 
    ? Math.round((presentCount / students.length) * 100) 
    : 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dersi Sonlandır"
      size="medium"
    >
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">
            <strong>Uyarı:</strong> Dersi sonlandırdığınızda, yoklama kaydı tamamlanacak ve öğrenciler artık QR kodu okutamayacaktır.
          </p>
        </div>

        {/* Attendance Summary */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Yoklama Özeti</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-xl font-bold text-green-800">{presentCount}</div>
              <div className="text-sm text-green-600">Var</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-xl font-bold text-red-800">{absentCount}</div>
              <div className="text-sm text-red-600">Yok</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <div className="text-xl font-bold text-yellow-800">{excusedCount}</div>
              <div className="text-sm text-yellow-600">Mazeretli</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-xl font-bold text-gray-800">{notMarkedCount}</div>
              <div className="text-sm text-gray-600">İşaretlenmemiş</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-800">
              Katılım Oranı: %{attendancePercentage}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes" className="form-label">Ders Notları (İsteğe Bağlı)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input"
            rows="3"
            placeholder="Ders hakkında notlar..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn btn-danger"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                Sonlandırılıyor...
              </div>
            ) : (
              'Dersi Sonlandır'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SessionEndModal