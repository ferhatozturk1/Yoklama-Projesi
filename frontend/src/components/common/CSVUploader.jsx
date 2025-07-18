import React, { useState } from 'react'
import FileUploader from './FileUploader'
import { parseCSVFile, validateStudentCSV, FILE_TYPES, FILE_SIZE_LIMITS } from '../../utils/fileUtils'
import { showError, showSuccess, showWarning } from './ToastNotification'

/**
 * CSV file uploader component specifically for student list imports
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onDataParsed - Callback when CSV data is successfully parsed and validated
 * @param {Function} props.onUploadComplete - Callback when upload is complete
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the uploader is disabled
 */
const CSVUploader = ({
  onDataParsed,
  onUploadComplete,
  className = '',
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])
  const [previewData, setPreviewData] = useState([])

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file) return

    try {
      setIsProcessing(true)
      setValidationErrors([])
      setParsedData(null)
      setPreviewData([])

      // Parse CSV file
      const csvData = await parseCSVFile(file)
      
      if (csvData.length === 0) {
        showError('CSV dosyası boş veya geçersiz')
        return
      }

      // Validate CSV structure
      const validation = validateStudentCSV(csvData)
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors)
        showError('CSV dosyası doğrulama hatası')
        return
      }

      // Set parsed data and preview
      setParsedData(csvData)
      setPreviewData(csvData.slice(0, 5)) // Show first 5 rows as preview
      
      // Call callback
      if (onDataParsed) {
        onDataParsed(csvData)
      }

      showSuccess(`${csvData.length} öğrenci başarıyla yüklendi`)

    } catch (error) {
      console.error('Error processing CSV file:', error)
      showError('CSV dosyası işlenirken hata oluştu: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle upload completion
  const handleUploadComplete = (result) => {
    if (onUploadComplete) {
      onUploadComplete(result, parsedData)
    }
  }

  // Clear data
  const handleClear = () => {
    setParsedData(null)
    setValidationErrors([])
    setPreviewData([])
  }

  return (
    <div className={`csv-uploader ${className}`}>
      <FileUploader
        onFileSelect={handleFileSelect}
        onFileUpload={handleUploadComplete}
        acceptedFileTypes={FILE_TYPES.SPREADSHEETS}
        maxFileSize={FILE_SIZE_LIMITS.MEDIUM}
        multiple={false}
        uploadButtonText="Öğrenci Listesini Yükle"
        dropzoneText="CSV dosyasını yüklemek için tıklayın veya sürükleyin"
        dropzoneActiveText="CSV dosyasını buraya bırakın"
        autoUpload={false}
        showPreview={false}
        disabled={disabled || isProcessing}
      />

      {/* Processing indicator */}
      {isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700">CSV dosyası işleniyor...</span>
          </div>
        </div>
      )}

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-medium mb-2">Doğrulama Hataları:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data preview */}
      {previewData.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              Veri Önizlemesi ({parsedData?.length} öğrenci)
            </h4>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Temizle
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(previewData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate"
                        title={value}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {parsedData && parsedData.length > 5 && (
            <p className="text-xs text-gray-500 mt-2">
              ... ve {parsedData.length - 5} öğrenci daha
            </p>
          )}
        </div>
      )}

      {/* CSV format help */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">CSV Dosya Formatı:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• İlk satır başlık satırı olmalıdır</p>
          <p>• Gerekli alanlar: <code className="bg-gray-200 px-1 rounded">name</code>, <code className="bg-gray-200 px-1 rounded">studentId</code></p>
          <p>• İsteğe bağlı alanlar: <code className="bg-gray-200 px-1 rounded">email</code>, <code className="bg-gray-200 px-1 rounded">phone</code></p>
          <p>• Örnek format:</p>
          <pre className="bg-gray-200 p-2 rounded text-xs mt-2 overflow-x-auto">
{`name,studentId,email
Ahmet Yılmaz,12345,ahmet@example.com
Ayşe Demir,12346,ayse@example.com`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CSVUploader