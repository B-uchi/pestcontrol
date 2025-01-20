import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PestUpdateModal from "../components/PestUpdateModal";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import api from "../utils/api";

export default function PestControlDashboard() {
  const { token } = useAuth();
  const [crops, setCrops] = useState([]);
  const [pests, setPests] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedPest, setSelectedPest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllCrops();
    fetchAllPests();
  }, []);

  const fetchAllCrops = async () => {
    try {
      const {data} = await api.get('/crops');
      setCrops(data);
    } catch (error) {
      setError("Error fetching crops");
    }
  };

  const fetchAllPests = async () => {
    try {
      const { data } = await api.get('/pests');
      setPests(data);
    } catch (error) {
      setError("Error fetching pests");
    }
  };

  const handleDeletePest = async (pestId) => {
    if (!confirm("Are you sure you want to delete this pest?")) return;

    try {
      const {data} = await api.delete(`/pests/${pestId}`);

      setPests(pests.filter((pest) => pest._id !== pestId));
    } catch (error) {
      setError("Error deleting pest");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Pest Control Dashboard
        </h1>
        <button
          onClick={() => {
            setSelectedPest(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          Add New Pest
        </button>
      </div>

      {/* Pests Management Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4" >
            Managed Pests
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pest Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scientific Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affected Crops
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pests.map((pest) => (
                  <tr key={pest._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pest.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {pest.scientificName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {pest.affectedCrops?.length || 0} crops
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedPest(pest);
                            setIsModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaPencilAlt className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePest(pest._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PestUpdateModal
          pest={selectedPest}
          crops={crops}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPest(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedPest(null);
            fetchAllPests();
          }}
        />
      )}
    </div>
  );
}
