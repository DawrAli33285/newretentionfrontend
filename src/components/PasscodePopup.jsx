import React, { useState } from 'react';

function PasscodePopup({ isOpen, onClose, onSubmit, error }) {
    const [passcode, setPasscode] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(passcode);
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Enter Passcode
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Please enter the passcode you received after payment to unlock and download your report.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter your passcode"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center text-lg font-mono mb-4"
              autoFocus
            />
            
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">
                {error}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 transition-all duration-300"
              >
                Unlock Report
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  

  export default PasscodePopup