import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CropRegistrationModal from '../components/CropRegistrationModal';
import PestDetailsModal from '../components/PestDetailsModal';
import { FaInfoCircle } from 'react-icons/fa';

export default function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPest, setSelectedPest] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/crops/farmer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Crops</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          Register New Crop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div key={crop._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">{crop.name}</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-500">Variety: {crop.variety}</p>
              <p className="text-sm text-gray-500">
                Planting Date: {new Date(crop.plantingDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Location: {crop.location}</p>
              <p className="text-sm text-gray-500">Area: {crop.area} hectares</p>
            </div>
            {crop.pests && crop.pests.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Associated Pests:</h4>
                <div className="space-y-2">
                  {crop.pests.map((pest) => (
                    <div 
                      key={pest._id} 
                      className="flex items-center justify-between bg-gray-50 rounded-md p-2"
                    >
                      <span className="text-sm text-gray-600">{pest.name}</span>
                      <button
                        onClick={() => setSelectedPest(pest)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                      >
                        <FaInfoCircle className="h-5 w-5" />
                        <span className="text-sm">Details</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CropRegistrationModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCrops();
          }}
        />
      )}

      {selectedPest && (
        <PestDetailsModal
          pest={selectedPest}
          onClose={() => setSelectedPest(null)}
        />
      )}
    </div>
  );
} 