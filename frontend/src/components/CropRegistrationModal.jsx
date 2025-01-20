import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

export default function CropRegistrationModal({ onClose, onSuccess }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    plantingDate: '',
    location: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await api.post('/crops', formData);
      onSuccess();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 h-[100vh] bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Register New Crop</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-500 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Crop Name
            </label>
            <input
              type="text"
              required
              className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variety
            </label>
            <input
              type="text"
              className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.variety}
              onChange={(e) => setFormData({...formData, variety: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Planting Date
            </label>
            <input
              type="date"
              required
              className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.plantingDate}
              onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              required
              className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Register Crop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 