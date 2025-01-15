import { IoClose } from "react-icons/io5";
export default function PestDetailsModal({ pest, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Pest Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{pest.name}</h3>
            <p className="text-sm text-gray-500 italic">{pest.scientificName}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{pest.description}</p>
          </div>

          {pest.symptoms && pest.symptoms.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Symptoms</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {pest.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
          )}

          {pest.controlMethods && pest.controlMethods.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Control Methods</h4>
              <div className="space-y-4">
                {pest.controlMethods.map((method, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Method: {method.method}</h5>
                    <p className="text-sm text-gray-600 mb-2">Description: {method.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Effectiveness:</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        method.effectiveness === 'high' 
                          ? 'bg-green-100 text-green-800'
                          : method.effectiveness === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {method.effectiveness.toUpperCase()}
                      </span>
                    </div>
                    {method.applicationFrequency && (
                      <p className="text-sm text-gray-600 mt-2">
                        Application: {method.applicationFrequency}
                      </p>
                    )}
                    {method.precautions && method.precautions.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Precautions:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {method.precautions.map((precaution, idx) => (
                            <li key={idx}>{precaution}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 