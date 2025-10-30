import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { referenceId } = location.state || {};

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="bg-green-50 rounded-2xl p-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          
          <div className="p-2 mb-8 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Reference Number</p>
            <p className="text-2xl font-bold text-gray-900">{referenceId}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="bg-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:brightness-95"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;