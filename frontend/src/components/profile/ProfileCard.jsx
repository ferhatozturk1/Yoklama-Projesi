import React from 'react'
import { formatDate } from '../../utils/dateHelpers'

const ProfileCard = ({ user, onEdit, onDownloadPDF }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {user?.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              getInitials(user?.firstName, user?.lastName)
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {user?.title} {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600 mb-2">{user?.email}</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {user?.university}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              {user?.faculty}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              {user?.department}
            </span>
          </div>
          {user?.createdAt && (
            <p className="text-xs text-gray-400 mt-2">
              Üyelik: {formatDate(user.createdAt)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onEdit}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Düzenle
          </button>
          <button 
            onClick={onDownloadPDF}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF İndir
          </button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">Aktif Ders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-sm text-gray-600">Toplam Öğrenci</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">0</div>
          <div className="text-sm text-gray-600">Yapılan Yoklama</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">%0</div>
          <div className="text-sm text-gray-600">Ortalama Devam</div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard