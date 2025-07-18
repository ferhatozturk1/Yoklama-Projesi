import React, { useState } from 'react'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'

const StudentImportPreview = ({ isOpen, onClose, importData, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState(importData.map((_, index) => index))
  const [selectAll, setSelectAll] = useState(true)

  // Check for potential duplicates
  const potentialDuplicates = importData.map((student, index) => {
    const duplicateIndices = importData.reduce((acc, s, i) => {
      if (i !== index && s.studentNumber === student.studentNumber) {
        acc.push(i)
      }
      return acc
    }, [])
    
    return {
      index,
      hasDuplicate: duplicateIndices.length > 0,
      duplicateIndices
    }
  })

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedRows(importData.map((_, index) => index))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (index, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, index])
    } else {
      setSelectedRows(selectedRows.filter(i => i !== index))
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    
    try {
      // Filter selected students
      const selectedStudents = importData.filter((_, index) => selectedRows.includes(index))
      
      // In a real app, we would save this to the backend
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Call the parent component's handler
      if (onConfirm) {
        onConfirm(selectedStudents)
      }
      
      onClose()
    } catch (error) {
      console.error('Error importing students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Öğrenci Listesi Önizleme"
      size="large"
    >
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Bilgi:</strong> İçe aktarılacak öğrenci listesini gözden geçirin. Eklemek istediğiniz öğrencileri seçin ve "İçe Aktar" düğmesine tıklayın.
            {potentialDuplicates.some(d => d.hasDuplicate) && (
              <span className="block mt-2">
                <strong>Uyarı:</strong> Bazı öğrenci numaraları tekrar ediyor. Lütfen kontrol edin.
              </span>
            )}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importData.map((student, index) => {
                const duplicate = potentialDuplicates[index]
                
                return (
                  <tr key={index} className={duplicate.hasDuplicate ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={(e) => handleSelectRow(index, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {duplicate.hasDuplicate ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Olası Çift Kayıt
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Geçerli
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedRows.length} / {importData.length} öğrenci seçildi
          </div>
          
          <div className="flex justify-end space-x-3">
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
              className="btn btn-primary"
              disabled={isLoading || selectedRows.length === 0}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  İçe Aktarılıyor...
                </div>
              ) : (
                `${selectedRows.length} Öğrenciyi İçe Aktar`
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default StudentImportPreview