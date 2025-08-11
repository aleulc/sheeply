import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Barra de navegación */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/90 backdrop-blur-sm shadow-md py-1'
          : 'bg-transparent py-3'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent flex items-center"
              >
                <img
                  src="/favicon.ico"
                  alt="Icono"
                  className="w-8 h-8"
                />
                Sheeply
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-0.5 rounded-full">
                    <div className="bg-white p-1 rounded-full">
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-dashed flex items-center justify-center text-gray-400">
                        {user?.nombre?.charAt(0) || (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-indigo-600 transition-colors duration-300">
                    {user?.nombre || 'Usuario'}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 inline-block ml-1 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 ring-1 ring-black ring-opacity-5 animate-fadeIn z-50"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email || 'usuario@ejemplo.com'}</p>
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="transition-all duration-700 ease-out transform opacity-100 translate-y-0">
          <Outlet />
        </div>
      </main>

      {/* Pie de página */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <Link
                to="/dashboard"
                className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent flex items-center"
              >
               <img
                  src="/favicon.ico"
                  alt="Icono"
                  className="w-8 h-8"
                />
                Sheeply
              </Link>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Sheeply. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;