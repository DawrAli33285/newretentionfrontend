import React, { useState } from 'react';
import ConfirmationPopup from './components/ConfirmationPopup';
import PasscodePopup from './components/PasscodePopup';
import PaymentPopup from './components/PaymentPopup';
import { BASE_URL } from './baseurl';
function UploadFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sameFile, setSameFile] = useState(null);
  
  // Popup states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showPasscodePopup, setShowPasscodePopup] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');
  const [isReportLocked, setIsReportLocked] = useState(false);
  const [correctPasscode,setCorrectPasscode] = useState('DEMO2024'); // In production, this would come from your backend

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };

  const calculateCategoryAverages = () => {
    if (!result || result.length === 0) return [];
    
    const categories = [
      { apiKey: 'WorkLifeBalance', displayName: 'Work-Life Balance' },
      { apiKey: 'Communication', displayName: 'Communication' },
      { apiKey: 'Financial', displayName: 'Money & Compensation' },
      { apiKey: 'Schedule', displayName: 'Schedule & Workload' }
    ];

    const categoryTotals = {};
    const categoryCounts = {};
    
    categories.forEach(({ apiKey, displayName }) => {
      categoryTotals[displayName] = 0;
      categoryCounts[displayName] = 0;
    });
    
    result.forEach(employee => {
      categories.forEach(({ apiKey, displayName }) => {
        const score = employee[apiKey] || 0;
        categoryTotals[displayName] += score;
        categoryCounts[displayName] += 1;
      });
    });
    
    return categories.map(({ displayName }) => {
      const average = categoryCounts[displayName] > 0 
        ? categoryTotals[displayName] / categoryCounts[displayName]
        : 0;
      return {
        name: displayName,
        score: parseFloat(average.toFixed(1))
      };
    });
  };
  
  const categoryAverages = calculateCategoryAverages();

  const handleUploadClick = () => {
    if (!file) return;
    setShowConfirmation(true);
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("employeeFile", file);
      setSameFile(file); 

      let token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}/api/enrich`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
        
        },
        body: formData
      });
      
    
      const data = await res.json();
      console.log("DATA")
      console.log(data)
      setCorrectPasscode(data.passcode)
      setResult(data.results);
      setIsReportLocked(true);
      setShowPaymentPopup(true);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const getTopCategory = (employee) => {
    if (!employee) return null;
    
    const categories = [
      { apiKey: 'WorkLifeBalance', displayName: 'Work-Life Balance' },
      { apiKey: 'Communication', displayName: 'Communication' },
      { apiKey: 'Financial', displayName: 'Money & Compensation' },
      { apiKey: 'Schedule', displayName: 'Schedule & Workload' }
    ];

    let maxScore = -1;
    let topCategory = null;

    categories.forEach(({ apiKey, displayName }) => {
      const score = employee[apiKey] || 0;
      if (score > maxScore) {
        maxScore = score;
        topCategory = displayName;
      }
    });

    return topCategory;
  };

  const getRiskLevel = (score) => {
    if (score >= 20) return 'High';
    if (score >= 10) return 'Medium';
    return 'Low';
  };

  const getImprovementArea = (employee) => {
    if (!employee) return 'N/A';
    
    const categories = [
      { apiKey: 'WorkLifeBalance', displayName: 'Work-Life Balance' },
      { apiKey: 'Communication', displayName: 'Communication' },
      { apiKey: 'Financial', displayName: 'Money & Compensation' },
      { apiKey: 'Schedule', displayName: 'Schedule & Workload' }
    ];
    
    let maxScore = -1;
    let improvementArea = 'N/A';
    let allZeros = true;
  
    categories.forEach(({ apiKey, displayName }) => {
      const score = employee[apiKey] || 0;
      if (score > 0) allZeros = false;
      if (score > maxScore) {
        maxScore = score;
        improvementArea = displayName;
      }
    });
  
    return allZeros ? 'N/A' : improvementArea;
  };

  const calculateImprovedScore = (currentScore) => {
    return Math.round(currentScore * 0.8);
  };

  const handleProceedToPayment = () => {
    setShowPaymentPopup(false);
    alert('Redirecting to payment gateway...\n\nAfter payment, you will receive passcode: DEMO2024');
    setShowPasscodePopup(true);
  };

  const handlePasscodeSubmit = (passcode) => {
    console.log("CORRECt")
    console.log(correctPasscode)
    if (passcode === correctPasscode) {
      setPasscodeError('');
      setShowPasscodePopup(false);
      setIsReportLocked(false);
      alert('Report unlocked successfully! You can now download your report.');
    } else {
      setPasscodeError('Invalid passcode. Please try again.');
    }
  };

  const exportToCSV = () => {
    if (isReportLocked) {
      setShowPasscodePopup(true);
      return;
    }

    if (!result || result.length === 0) {
      alert('No data to export');
      return;
    }
  
    const categories = [
      'Work Life Balance',
      'Communication',
      'Financial',
      'Schedule'
    ];
  
    const headers = [
      'Employee Number',
      'Employee Name',
      'Email',
      'Last Hire Date',
      'Job Start Date',
      'Termination Date',
      'Termination Reason',
      'Employment Status',
      'Date of Birth',
      'Job Title',
      'Department',
      'Facility',
      ...categories,
      'Final Score',
      'Improvement Area',
      'Risk Level',
      'Possible Improved Score',
      'Phone'
    ];
  
    const csvRows = result.map((emp, index) => {
      const improvementArea = getImprovementArea(emp);
      const riskLevel = emp.riskLevel || getRiskLevel(emp.totalScore);
      let improvedScore = calculateImprovedScore(emp.totalScore);
      if(!improvedScore){
        improvedScore=0;
      }
      return [
        index + 1,
        emp.name || 'Unknown',
        emp.email || '',
        emp.last_hire_date || '',
        emp.job_start || '',
        emp.termination_date || '',
        emp.termination_reason || '',
        emp.employement_status || '',
        emp.date_of_birth || '',
        emp.job_title || '',
        emp.department || '',
        emp.facility || '',
        ...categories.map(cat => emp[cat] || 0),
        emp.totalScore || 0,
        improvementArea,
        riskLevel,
        improvedScore,
        emp.phone
      ];
    });
  
    const csvContent = [headers, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `employee_engagement_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const EmployeeDashboard = () => {
    const getRiskColor = (risk) => {
      if (risk >= 70) return 'bg-red-500';
      if (risk >= 50) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    const totalAverage = result.length > 0 
      ? Math.round(result.reduce((sum, employee) => sum + (employee.totalScore || 0), 0) / result.length)
      : 0;

    return (
      <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
          <div className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">
              {totalAverage}%
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">
                Employee Sentiment Dashboard
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-1 leading-tight">
                Overall Sentiment Risk Score
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight">
                Team: Marketing • Last 30 Days
              </p>
            </div>
          </div>

          {isReportLocked && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-yellow-900">Report Locked</p>
                <p className="text-sm text-yellow-700">Complete payment to unlock and download</p>
              </div>
            </div>
          )}

          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 text-gray-600 font-medium text-sm">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Employee</div>
            <div className="col-span-3 text-center">Risk Score</div>
            <div className="col-span-3 text-center">Top Category</div>
          </div>

          <div className="space-y-0">
            {result?.map((employee, index) => (
              <div key={index} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center px-4 py-4">
                  <div className="col-span-1 flex justify-center">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium text-xs">
                      👤
                    </div>
                  </div>
                  <div className="col-span-5">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {employee?.name || 'Unknown'}
                    </h3>
                  </div>
                  <div className="col-span-3 flex justify-center items-center gap-2">
                    <div className={`w-10 h-10 ${getRiskColor(employee?.totalScore || 0)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {employee?.totalScore || 0}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">
                      {employee?.totalScore || 0}%
                    </span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="font-semibold text-gray-900 text-sm">
                      {getTopCategory(employee) || "No categories"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">
            Average Risk Score by Category
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {categoryAverages.map((category, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="w-full sm:w-32 md:w-36 lg:w-40 flex-shrink-0">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    {category.name}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8 lg:h-10">
                      <div 
                        className="bg-blue-500 h-6 sm:h-8 lg:h-10 rounded-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(category.score * 2, 5)}%` }}
                      >
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {category.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 flex justify-between text-xs sm:text-sm text-gray-500 px-4 sm:px-8 lg:px-32">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
            Employee Engagement Insights
          </h2>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6 transition-all duration-300 ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-blue-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <input 
              type="file" 
              id="fileInput" 
              onChange={handleFileChange} 
              accept=".csv, .xlsx"
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24"
                fill="#3B82F6"
                className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-2">
                Drag and drop your CSV/Excel file here or click to browse
              </p>
              {file && (
                <p className="text-blue-600 font-medium text-sm sm:text-base mt-2">
                  Selected file: {file.name}
                </p>
              )}
            </label>
          </div>

          <button 
            onClick={handleUploadClick} 
            disabled={!file || isLoading}
            className={`w-full sm:w-auto mx-auto block px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
              !file || isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:transform hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? 'Processing...' : 'Upload & Analyze'}
          </button>

          {result.length > 0 && (
            <button 
              onClick={exportToCSV}
              className={`w-full sm:w-auto mx-auto block mt-3 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                isReportLocked 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-purple-500 text-white hover:bg-purple-600 hover:transform hover:scale-105 active:scale-95'
              }`}
            >
              {isReportLocked ? '🔒 Export Locked' : 'Export CSV'}
            </button>
          )}
        </div>

        {result.length > 0 && <EmployeeDashboard />}
      </div>

      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmUpload}
        isLoading={isLoading}
        title="Confirm File Processing"
        message="Are you sure you want to process this file? The report will be locked until payment is completed."
      />

      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        onDownload={handleProceedToPayment}
      />

      <PasscodePopup
        isOpen={showPasscodePopup}
        onClose={() => {
          setShowPasscodePopup(false);
          setPasscodeError('');
        }}
        onSubmit={handlePasscodeSubmit}
        error={passcodeError}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default UploadFile;