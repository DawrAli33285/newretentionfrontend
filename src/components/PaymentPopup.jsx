import React, { useState } from 'react';

function PaymentPopup({ isOpen, onClose, onDownload }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Report Locked
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Your report has been processed successfully! To download it, please complete the payment. You will receive a passcode to unlock your report.
            </p>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 font-semibold mb-2">Report Ready!</p>
              <p className="text-blue-700 text-sm">Complete payment to receive your unlock passcode</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onDownload}
              className="w-full px-6 py-3 rounded-full font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
            >
              Proceed to Payment
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 rounded-full font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default PaymentPopup