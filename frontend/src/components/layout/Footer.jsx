import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side - Copyright */}
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            <p>© {currentYear} Teacher Attendance System. Tüm hakları saklıdır.</p>
          </div>

          {/* Right side - Links */}
          <div className="flex space-x-6 text-sm">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Gizlilik Politikası
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Kullanım Şartları
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Destek
            </a>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="mb-2 md:mb-0">
              <p>Akademik personel için geliştirilmiş yoklama yönetim sistemi</p>
            </div>
            <div className="flex items-center space-x-4">
              <span>Versiyon 1.0.0</span>
              <span>•</span>
              <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer