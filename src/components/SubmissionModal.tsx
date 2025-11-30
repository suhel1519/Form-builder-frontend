import { useTheme } from '../context/ThemeContext';
import { Submission } from '../types';

interface SubmissionModalProps {
  submission: Submission;
  onClose: () => void;
}

function SubmissionModal({ submission, onClose }: SubmissionModalProps) {
  const { darkMode } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Submission Details</h2>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium">ID:</span> {submission.id}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium">Created:</span>{' '}
              {new Date(submission.createdAt).toLocaleString()}
            </p>
          </div>

          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Form Data</h3>
            <dl className="space-y-3">
              {Object.entries(submission.data).map(([key, value]) => (
                <div key={key} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} pb-2`}>
                  <dt className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmissionModal;
