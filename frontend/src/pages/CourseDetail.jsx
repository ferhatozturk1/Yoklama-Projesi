import React from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'

const CourseDetail = () => {
  const { courseId } = useParams()
  
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ders Detayı</h1>
            <p className="text-gray-600">
              Ders ID: {courseId}
            </p>
          </div>

          {/* Course Info Card */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">BIL101 - Bilgisayar Programlama I</h2>
                <p className="text-gray-600">Şube: 1 | Derslik: A-201 | Pazartesi 09:00-11:00</p>
              </div>
              <div className="flex space-x-3">
                <button className="btn btn-primary">
                  Yoklama Başlat
                </button>
                <button className="btn btn-secondary">
                  QR Kod
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">32</div>
                <div className="text-sm text-gray-600">Kayıtlı Öğrenci</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Yapılan Ders</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">%85</div>
                <div className="text-sm text-gray-600">Ortalama Devam</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-sm text-gray-600">Telafi Dersi</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                  Öğrenci Listesi
                </button>
                <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Yoklama Geçmişi
                </button>
                <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Raporlar
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Öğrenci Listesi</h3>
              <button className="btn btn-secondary">
                Liste Yükle
              </button>
            </div>

            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium mb-2">Öğrenci listesi yüklenmemiş</p>
              <p className="text-sm">Excel veya PDF dosyası yükleyerek öğrenci listesini ekleyin</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CourseDetail