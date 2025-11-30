import { Routes, Route, Link } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import FormPage from './pages/FormPage';
import SubmissionsPage from './pages/SubmissionsPage';

function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } border-b-2 border-transparent hover:border-gray-300`}
              >
                Form
              </Link>
              <Link
                to="/submissions"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } border-b-2 border-transparent hover:border-gray-300`}
              >
                Submissions
              </Link>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md ${
                  darkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                } transition-colors duration-200`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
