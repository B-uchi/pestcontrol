import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 py-4 sm:py-0">
            <div className="flex items-center justify-start sm:justify-start">
              <span className="text-xl font-semibold text-indigo-600 sm:text-left">
                Farm Pest Manager
              </span>
            </div>
            {user && (
              <div className="flex items-center justify-start sm:justify-end space-x-4 mt-4 sm:mt-0">
                <span className="text-gray-700 text-sm sm:text-base">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 