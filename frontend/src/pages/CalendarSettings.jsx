import React from 'react'
import Layout from '../components/layout/Layout'
import CalendarManagement from '../components/dashboard/CalendarManagement'
import CalendarRestrictionCheck from '../components/dashboard/CalendarRestrictionCheck'

const CalendarSettings = () => {
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Akademik Takvim Ayarları</h1>
            <p className="text-gray-600">
              Dönem tarihlerini, tatilleri ve sınav dönemlerini yönetin
            </p>
          </div>

          {/* Calendar Management */}
          <CalendarManagement />
          
          {/* Calendar Restriction Check */}
          <div className="mt-8">
            <CalendarRestrictionCheck />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CalendarSettings