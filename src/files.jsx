import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, User, Lock } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from './baseurl';

function PaymentPopup({ isOpen, onClose, onDownload }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Locked</h2>
          <p className="text-gray-600 text-sm">
            Your report has been processed successfully! To download it, please complete the payment. You will receive a passcode to unlock your report.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-2">
            <FileText className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-lg font-semibold text-gray-700">Report Ready!</span>
          </div>
          <p className="text-center text-sm text-gray-600">
            Complete payment to receive your unlock passcode
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onDownload}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Proceed to Payment
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function PasscodePopup({ isOpen, onClose, onSubmit, error }) {
  const [passcode, setPasscode] = useState('');

  const handleSubmit = () => {
    onSubmit(passcode);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Passcode</h2>
          <p className="text-gray-600 text-sm">
            Please enter the passcode you received after payment to unlock and download your report.
          </p>
        </div>

        <div>
          <input
            type="text"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your passcode"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center text-lg font-mono mb-4"
            autoFocus
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              Unlock Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showPasscodePopup, setShowPasscodePopup] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      let token = localStorage.getItem('token');
      let response = await axios.get(`${BASE_URL}/get-files`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("FETCH");
      console.log(response.data);
      
      // Fix: response.data is an object with a 'files' property
      const filesArray = response.data.files || [];
      
      // Transform the API response to match the component's expected structure
      const transformedFiles = filesArray.map(file => ({
        id: file._id,
        fileName: file.file,
        userEmail: file.user.email,
        uploadDate: file.createdAt,
        passcode: file.passcode,
        paid: file.paid,
        outputUrl: file.output
      }));
      
      setFiles(transformedFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
    } catch (e) {
      console.error('Error fetching files:', e);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = async (file) => {
    // Download the file directly from the output URL
    try {
      const link = document.createElement('a');
      link.href = file.outputUrl;
      link.download = `output_${file.id}.csv`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Download started for ${file.fileName}`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentPopup(false);
    setShowPasscodePopup(true);
  };

  const handlePasscodeSubmit = async (enteredPasscode) => {
    if (!selectedFile) return;

    if (enteredPasscode === selectedFile.passcode) {
      setPasscodeError('');
      setShowPasscodePopup(false);
      
      // Download the file from the output URL
      try {
        const link = document.createElement('a');
        link.href = selectedFile.outputUrl;
        link.download = selectedFile.fileName.replace('.csv', '.xlsx');
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Download started for ${selectedFile.fileName}`);
        
        // Optionally update the paid status on the backend
        // await axios.post(`${BASE_URL}/mark-as-paid/${selectedFile.id}`, {}, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        
      } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download file. Please try again.');
      }
      
      setSelectedFile(null);
    } else {
      setPasscodeError('Invalid passcode. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className='flex justify-center items-center text-center'>
  <img 
    src="/logo.jpg" 
    alt="Company Logo" 
    className="h-20 sm:h-24 lg:h-32 w-auto object-contain"
  />
</div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Files</h1>
          <p className="text-gray-600">Manage and download your uploaded files</p>
        </div>

        {files.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No files yet</h3>
            <p className="text-gray-500">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                        {file.fileName}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1.5 text-gray-400" />
                          <span className="truncate">{file.userEmail}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                          <span>{formatDate(file.uploadDate)}</span>
                        </div>

                        {file.paid && (
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Paid
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownloadClick(file)}
                    className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center space-x-2 flex-shrink-0"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={() => {
          setShowPaymentPopup(false);
          setSelectedFile(null);
        }}
        onDownload={handlePaymentComplete}
      />

      <PasscodePopup
        isOpen={showPasscodePopup}
        onClose={() => {
          setShowPasscodePopup(false);
          setSelectedFile(null);
          setPasscodeError('');
        }}
        onSubmit={handlePasscodeSubmit}
        error={passcodeError}
      />
    </div>
  );
}

export default FilesPage;