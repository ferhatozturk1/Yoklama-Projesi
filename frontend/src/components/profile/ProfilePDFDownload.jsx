import React, { useState } from 'react'
import { generateProfilePDF, downloadPDF } from '../../utils/pdfGenerator'
import { showError, showSuccess } from '../common/ToastNotification'
import LoadingSpinner from '../common/LoadingSpinner'

const ProfilePDFDownload = ({ user, courses = [] }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      
      // Prepare user data with courses
      const userData = {
        ...user,
        courses: courses
      }
      
      // Generate PDF
      const doc = generateProfilePDF(userData)
      
      // Download PDF
      const filename = `profil_${user.firstName}_${user.lastName}_${new Date().toISOString().split('T')[0]}.pdf`
      downloadPDF(doc, filename)
      
      showSuccess('Profil PDF\'i başarıyla indirildi!')
      
    } catch (error) {
      console.error('PDF generation error:', error)
      showError('PDF oluşturulurken hata oluştu.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profil Belgesi</h3>
          <p className="text-sm text-gray-600">
            Profil bilgilerinizi PDF formatında indirin
          </p>
        </div>
        
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <LoadingSpinner size="small" className="mr-2" />
              Oluşturuluyor...
            </div>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF İndir
            </>
          )}
        </button>
      </div>

      {/* PDF Preview Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">PDF İçeriği:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Kişisel bilgiler (ad, soyad, ünvan)</li>
          <li>• İletişim bilgileri</li>
          <li>• Akademik bilgiler (üniversite, fakülte, bölüm)</li>
          <li>• Verilen dersler listesi</li>
          <li>• Belge oluşturma tarihi</li>
        </ul>
      </div>
    </div>
  )
}

export default ProfilePDFDownload