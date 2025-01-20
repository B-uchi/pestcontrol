import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function ActivityReport() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportData, setReportData] = useState(null);
  const { token } = useAuth();

  const generateReport = async () => {
    try {
      const {data} = await api.get('/admin/reports/activity', {params: dateRange});
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  console.log(reportData);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
        <button
          onClick={generateReport}
          className="btn-primary"
        >
          Generate Report
        </button>
      </div>

      {reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">New Registrations</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600">
                {reportData.newUsers}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">New Crops</h3>
              <p className="mt-2 text-3xl font-semibold text-green-600">
                {reportData.newCrops}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Pest Reports</h3>
              <p className="mt-2 text-3xl font-semibold text-blue-600">
                {reportData.pestReports}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
            <BarChart
              width={800}
              height={300}
              data={reportData.timeline}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="crops" fill="#059669" name="New Crops" />
              <Bar dataKey="pests" fill="#4F46E5" name="Pest Reports" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
} 