import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { IoClose } from "react-icons/io5";


export default function PestUpdateModal({ pest, crops, onClose, onSuccess }) {
  const { token } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    symptoms: [],
    controlMethods: [{
      method: '',
      description: '',
      effectiveness: 'medium',
      applicationFrequency: '',
      precautions: []
    }],
    affectedCrops: []
  });

  useEffect(() => {
    if (pest) {
      setFormData({
        name: pest.name || '',
        scientificName: pest.scientificName || '',
        description: pest.description || '',
        symptoms: pest.symptoms || [],
        controlMethods: pest.controlMethods || [{
          method: '',
          description: '',
          effectiveness: 'medium',
          applicationFrequency: '',
          precautions: []
        }],
        affectedCrops: pest.affectedCrops?.map(crop => crop._id) || []
      });
    }
  }, [pest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = `${import.meta.env.VITE_API_URL}/pests${pest ? `/${pest._id}` : ''}`;
      const method = pest ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save pest');
      }

      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleControlMethodChange = (index, field, value) => {
    const updatedMethods = [...formData.controlMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value
    };
    setFormData({
      ...formData,
      controlMethods: updatedMethods
    });
  };

  const addControlMethod = () => {
    setFormData({
      ...formData,
      controlMethods: [
        ...formData.controlMethods,
        {
          method: '',
          description: '',
          effectiveness: 'medium',
          applicationFrequency: '',
          precautions: []
        }
      ]
    });
  };

  const removeControlMethod = (index) => {
    setFormData({
      ...formData,
      controlMethods: formData.controlMethods.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {pest ? 'Edit Pest' : 'Add New Pest'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-500 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pest Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Scientific Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.scientificName}
                onChange={(e) => setFormData({...formData, scientificName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Affected Crops
              </label>
              <select
                multiple
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.affectedCrops}
                onChange={(e) => setFormData({
                  ...formData,
                  affectedCrops: Array.from(e.target.selectedOptions, option => option.value)
                })}
              >
                {crops.map((crop) => (
                  <option key={crop._id} value={crop._id}>
                    {crop.name} ({crop.farmerId.name}'s farm)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Symptoms (comma-separated)
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.symptoms.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Control Methods
                </label>
                <button
                  type="button"
                  onClick={addControlMethod}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Add Method
                </button>
              </div>

              {formData.controlMethods.map((method, index) => (
                <div key={index} className="border rounded p-4 mb-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeControlMethod(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <IoClose className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Method Name
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={method.method}
                        onChange={(e) => handleControlMethodChange(index, 'method', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows="2"
                        value={method.description}
                        onChange={(e) => handleControlMethodChange(index, 'description', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Effectiveness
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={method.effectiveness}
                        onChange={(e) => handleControlMethodChange(index, 'effectiveness', e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (pest ? 'Update Pest' : 'Add Pest')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}