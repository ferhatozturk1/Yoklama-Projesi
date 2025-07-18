import React from 'react'
import Layout from '../components/layout/Layout'

const AttendanceManagement = () => {
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yoklama Yönetimi</h1>
            <p className="text-gray-600">
              Tüm derslerinizin yoklama durumunu görüntüleyin ve yönetin
            </p>
          </div>

          {/* Filter Bar */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ders</label>
                <select className="form-input w-full">
                  <option value="">Tüm Dersler</option>
                  <option value="bil101">BIL101 - Bilgisayar Programlama I</option>
                  <option value="bil102">BIL102 - Bilgisayar Programlama II</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Aralığı</label>
                <div className="flex space-x-2">
                  <input type="date" className="form-input flex-1" />
                  <input type="date" className="form-input flex-1" />
                </div>
              </div>
              <div className="flex items-end">
                <button className="btn btn-primary">
                  Filtrele
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aktif Yoklama Oturumları</h2>
            
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Şu anda aktif yoklama oturumu bulunmuyor</p>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Son Yoklamalar</h2>
              <button className="btn btn-secondary">
                Tümünü Görüntüle
              </button>
            </div>

            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium mb-2">Henüz yoklama alınmamış</p>
              <p className="text-sm">Derslerinizden birinde yoklama almaya başlayın</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AttendanceManagement