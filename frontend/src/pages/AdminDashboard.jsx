import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  DocumentChartBarIcon 
} from '@heroicons/react/24/outline';
import UsersList from '../components/admin/UsersList';
import ActivityReport from '../components/admin/ActivityReport';
import api from '../utils/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('farmers');
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalAgents: 0,
    totalCrops: 0,
    totalPests: 0
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const {data} = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'farmers':
        return <UsersList role="farmer" />;
      case 'agents':
        return <UsersList role="pestcontrol" />;
      case 'reports':
        return <ActivityReport />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UsersIcon className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-indigo-600 font-medium">Total Farmers</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{stats.totalFarmers}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              <span className="ml-2 text-green-600 font-medium">Pest Control Agents</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{stats.totalAgents}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-blue-600 font-medium">Registered Crops</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{stats.totalCrops}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DocumentChartBarIcon className="h-6 w-6 text-purple-600" />
              <span className="ml-2 text-purple-600 font-medium">Managed Pests</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{stats.totalPests}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex min-w-full">
            <button
              onClick={() => setActiveTab('farmers')}
              className={`${
                activeTab === 'farmers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 sm:px-6 border-b-2 font-medium text-sm flex-shrink-0`}
            >
              Farmers
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`${
                activeTab === 'agents'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 sm:px-6 border-b-2 font-medium text-sm flex-shrink-0`}
            >
              Pest Control Agents
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`${
                activeTab === 'reports'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 sm:px-6 border-b-2 font-medium text-sm flex-shrink-0`}
            >
              Activity Reports
            </button>
          </nav>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 