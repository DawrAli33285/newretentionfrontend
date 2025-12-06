// import React, { useEffect, useState } from 'react';
// import ConfirmationPopup from './components/ConfirmationPopup';
// import PasscodePopup from './components/PasscodePopup';
// import PaymentPopup from './components/PaymentPopup';
// import StripePaymentPopup from './components/StripePaymentPopup';

// import { BASE_URL } from './baseurl';
// function UploadFile() {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [sameFile, setSameFile] = useState(null);
//   const [showSampleFormat, setShowSampleFormat] = useState(false);
  
//   // Popup states
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false);
//   const [showPasscodePopup, setShowPasscodePopup] = useState(false);
//   const [passcodeError, setPasscodeError] = useState('');
//   const [isReportLocked, setIsReportLocked] = useState(false);
//   const [correctPasscode,setCorrectPasscode] = useState('DEMO2024');
//   const [recordCount, setRecordCount] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [showStripePayment, setShowStripePayment] = useState(false);
//   const [credits,setCredits]=useState(0)
//   const [originalAmount, setOriginalAmount] = useState(0);

//   const handleFileChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     const allowedTypes = [
//       'text/csv',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     ];
    
//     if (selectedFile && allowedTypes.includes(selectedFile.type)) {
//       setFile(selectedFile);
      
//       // Count records with Employee Name in the file
//       try {
//         const text = await selectedFile.text();
//         const lines = text.trim().split('\n');
        
//         if (lines.length <= 1) {
//           setRecordCount(0);
//           return;
//         }
        
//         // Get header row and find Employee Name column index
//         const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
//         const employeeNameIndex = headers.findIndex(h => 
//           h.toLowerCase().includes('employee name')
//         );
        
//         if (employeeNameIndex === -1) {
//           alert('Error: Could not find "Employee Name" column in the file');
//           setFile(null);
//           setRecordCount(0);
//           return;
//         }
        
//         // Count rows that have a non-empty Employee Name
//         let validCount = 0;
//         for (let i = 1; i < lines.length; i++) {
//           const columns = lines[i].split(',');
//           const employeeName = columns[employeeNameIndex]?.trim().replace(/['"]/g, '');
          
//           if (employeeName && employeeName.length > 0) {
//             validCount++;
//           }
//         }
        
//         setRecordCount(validCount);
//       } catch (error) {
//         console.error('Error parsing file:', error);
//         alert('Error reading file. Please ensure it is a valid CSV file.');
//         setFile(null);
//         setRecordCount(0);
//       }
//     } else {
//       alert('Please upload a CSV or Excel file');
//     }
//   };

  


//   const calculateCategoryAverages = () => {
//     if (!result || result.length === 0) return [];
    
//     const categories = [
//       { apiKey: 'WorkLifeBalance', displayName: 'Work-Life Balance' },
//       { apiKey: 'Communication', displayName: 'Communication' },
//       { apiKey: 'Financial', displayName: 'Money & Compensation' },
//       { apiKey: 'Schedule', displayName: 'Schedule & Workload' }
//     ];

//     const categoryTotals = {};
//     const categoryCounts = {};
    
//     categories.forEach(({ apiKey, displayName }) => {
//       categoryTotals[displayName] = 0;
//       categoryCounts[displayName] = 0;
//     });
    
//     result.forEach(employee => {
//       categories.forEach(({ apiKey, displayName }) => {
//         const score = employee[apiKey] || 0;
//         categoryTotals[displayName] += score;
//         categoryCounts[displayName] += 1;
//       });
//     });
    
//     return categories.map(({ displayName }) => {
//       const average = categoryCounts[displayName] > 0 
//         ? categoryTotals[displayName] / categoryCounts[displayName]
//         : 0;
//       return {
//         name: displayName,
//         score: parseFloat(average.toFixed(1))
//       };
//     });
//   };
  
//   const categoryAverages = calculateCategoryAverages();

// useEffect(()=>{
// getCredits();
// },[])

// const getCredits=async()=>{
//   try{
//     let token = localStorage.getItem('token');

//     let response = await fetch(`${BASE_URL}/getCurrentCredits`, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       } 
//     });
    
//     // Convert the response to JSON
//     let data = await response.json();
    
//     console.log(data);
//     setCredits(data.user.credits)
    
//   }catch(e){
//     console.log(e.message)
//   }
// }

// const handleUploadClick = async () => {
//   if (!file) return;

//   // Add this validation
//   if (recordCount === 0) {
//     alert('No valid employee records found in the file. Please ensure your file contains records with Employee Names.');
//     return;
//   }

//   try {
//     let token = localStorage.getItem('token');
//     const response = await fetch(`${BASE_URL}/calculate-price`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ recordCount })
//     });
    
//     const { totalAmount } = await response.json();
    
//     setOriginalAmount(totalAmount);
    
//     const creditsInCents = credits * 100;
    
//     let finalAmount = totalAmount;
//     let creditsToUse = 0;
    
//     if (creditsInCents > 0) {
//       if (creditsInCents >= totalAmount) {
//         creditsToUse = totalAmount / 100;
//         finalAmount = 0;
//       } else {
//         creditsToUse = credits;
//         finalAmount = totalAmount - creditsInCents;
//       }
//     }
    
//     setTotalAmount(finalAmount);
    
//     if (finalAmount === 0) {
//       handleFreeProcessing(creditsToUse);
//     } else {
//       setShowConfirmation(true);
//     }
//   } catch (error) {
//     console.error('Error calculating price:', error);
//     alert('Error calculating price');
//   }
// };


// // const handleUploadClick = async () => {
// //   if (!file) return;

// //   try {
// //     let token = localStorage.getItem('token');
// //     const response = await fetch(`${BASE_URL}/calculate-price`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({ recordCount })
// //     });
    
// //     const { totalAmount } = await response.json();
    
  
// //     setOriginalAmount(totalAmount);
    
   
// //     const creditsInCents = credits * 100;
    
// //     let finalAmount = totalAmount;
// //     let creditsToUse = 0;
    
// //     if (creditsInCents > 0) {
// //       if (creditsInCents >= totalAmount) {
      
// //         creditsToUse = totalAmount / 100;
// //         finalAmount = 0;
// //       } else {
        
// //         creditsToUse = credits;
// //         finalAmount = totalAmount - creditsInCents;
// //       }
// //     }
    
// //     setTotalAmount(finalAmount);
    
  
// //     if (finalAmount === 0) {
// //       handleFreeProcessing(creditsToUse);
// //     } else {
// //       setShowConfirmation(true);
// //     }
// //   } catch (error) {
// //     console.error('Error calculating price:', error);
// //     alert('Error calculating price');
// //   }
// // };

// const handleFreeProcessing = async (creditsUsed) => {
//   setIsLoading(true);
  
//   try {
//     const formData = new FormData();

//     formData.append("employeeFile", file);
//     formData.append("recordCount", recordCount);
//     formData.append("creditsUsed", creditsUsed);
//     setSameFile(file);

//     let token = localStorage.getItem('token');

//     const res = await fetch(`${BASE_URL}/api/enrich`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData
//     });
    
//     const data = await res.json();
//     setCorrectPasscode(data.passcode);
//     setResult(data.results);
//     setIsReportLocked(false);
    
//     // Refresh credits
//     await getCredits();
    
//     alert('File processed successfully using your credits!');
//   } catch (error) {
//     console.error('Upload error:', error);
//     alert('Error uploading file');
//   } finally {
//     setIsLoading(false);
//   }
// };

// const handleConfirmUpload = async () => {
//   setShowConfirmation(false);
//   setIsLoading(true);
  
//   try {
//     const formData = new FormData();
//     formData.append("employeeFile", file);
    
//     // Calculate how many credits SHOULD be deducted based on the price
//     // This is the cost in credits, regardless of what user has
//     const requiredCredits = originalAmount / 100; // Convert cents to dollars
    
//     // Always send the required credits amount - backend will validate
//     formData.append("creditsUsed", requiredCredits.toString());
//     formData.append("amountPaid", (totalAmount / 100).toString());
    
//     setSameFile(file);

//     let token = localStorage.getItem('token');

//     const res = await fetch(`${BASE_URL}/api/enrich`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData
//     });
    
//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.error || 'Failed to process file');
//     }
    
//     const data = await res.json();
//     setCorrectPasscode(data.passcode);
//     setResult(data.results);
//     setIsReportLocked(false);
    
//     // Refresh credits
//     await getCredits();
    
//     alert('File processed successfully!');
//   } catch (error) {
//     console.error('Upload error:', error);
//     alert(error.message || 'Error uploading file');
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const handlePaymentSuccess = async (paymentIntentId) => {
//     setShowStripePayment(false);
//     setIsLoading(true);
    
//     try {
//       const formData = new FormData();
//       formData.append("employeeFile", file);
//       formData.append("paymentIntentId", paymentIntentId);
//       setSameFile(file);
  
//       let token = localStorage.getItem('token');
  
//       const res = await fetch(`${BASE_URL}/api/enrich`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData
//       });
      
//       const data = await res.json();
//       setCorrectPasscode(data.passcode);
//       setResult(data.results);
//       setIsReportLocked(false);
      
//       // Refresh credits after payment
//       await getCredits();
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Error uploading file');
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   const getTopCategory = (employee) => {
//     if (!employee) return null;
    
//     const categories = [
//       { apiKey: 'WorkLifeBalance', displayName: 'Work-Life Balance' },
//       { apiKey: 'Communication', displayName: 'Communication' },
//       { apiKey: 'Financial', displayName: 'Money & Compensation' },
//       { apiKey: 'Schedule', displayName: 'Schedule & Workload' }
//     ];

//     let maxScore = -1;
//     let topCategory = null;

//     categories.forEach(({ apiKey, displayName }) => {
//       const score = employee[apiKey] || 0;
//       if (score > maxScore) {
//         maxScore = score;
//         topCategory = displayName;
//       }
//     });

//     return topCategory;
//   };

//   const getRiskLevel = (score) => {
//     if (score >= 20) return 'High';
//     if (score >= 10) return 'Medium';
//     return 'Low';
//   };

//   const getImprovementArea = (employee) => {
//     if (!employee) return 'N/A';
    
//     const categories = [
//       { apiKey: 'WorkLifeBalance', displayName: 'Work-Life Balance' },
//       { apiKey: 'Communication', displayName: 'Communication' },
//       { apiKey: 'Financial', displayName: 'Money & Compensation' },
//       { apiKey: 'Schedule', displayName: 'Schedule & Workload' }
//     ];
    
//     let maxScore = -1;
//     let improvementArea = 'N/A';
//     let allZeros = true;
  
//     categories.forEach(({ apiKey, displayName }) => {
//       const score = employee[apiKey] || 0;
//       if (score > 0) allZeros = false;
//       if (score > maxScore) {
//         maxScore = score;
//         improvementArea = displayName;
//       }
//     });
  
//     return allZeros ? 'N/A' : improvementArea;
//   };

//   const calculateImprovedScore = (currentScore) => {
//     return Math.round(currentScore * 0.8);
//   };

//   const handleProceedToPayment = () => {
//     setShowPaymentPopup(false);
//     alert('Redirecting to payment gateway...\n\nAfter payment, you will receive passcode: DEMO2024');
//     setShowPasscodePopup(true);
//   };

//   const handlePasscodeSubmit = (passcode) => {
//     console.log("CORRECt")
//     console.log(correctPasscode)
//     if (passcode === correctPasscode) {
//       setPasscodeError('');
//       setShowPasscodePopup(false);
//       setIsReportLocked(false);
//       alert('Report unlocked successfully! You can now download your report.');
//     } else {
//       setPasscodeError('Invalid passcode. Please try again.');
//     }
//   };


//   const SampleFormatModal = () => {
//     if (!showSampleFormat) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
//           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-gray-900">Sample File Format</h2>
//             <button
//               onClick={() => setShowSampleFormat(false)}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
          
//           <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">Required Columns:</h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Your CSV file should include the following columns (in any order):
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4 mb-6 overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-gray-300">
//                     <th className="text-left py-2 px-3 font-semibold text-gray-700">Column Name</th>
//                     <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
//                     <th className="text-left py-2 px-3 font-semibold text-gray-700">Example</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Employee Name (Last Suffix, First MI)</td>
//     <td className="py-2 px-3">Full name in format: Last, First MI</td>
//     <td className="py-2 px-3 text-gray-600">Abernathy, Rita K.</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">E-mail Address</td>
//     <td className="py-2 px-3">Work email</td>
//     <td className="py-2 px-3 text-gray-600">rabernathy@company.org</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Home Phone (Formatted)</td>
//     <td className="py-2 px-3">Contact number with formatting</td>
//     <td className="py-2 px-3 text-gray-600">(317) 752-2091</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Company Name</td>
//     <td className="py-2 px-3">Employer company name</td>
//     <td className="py-2 px-3 text-gray-600">Acme Corporation</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Date of Birth</td>
//     <td className="py-2 px-3">Employee birth date</td>
//     <td className="py-2 px-3 text-gray-600">01/15/1985</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Last Hire Date</td>
//     <td className="py-2 px-3">Most recent hire date</td>
//     <td className="py-2 px-3 text-gray-600">03/20/2020</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Job Title</td>
//     <td className="py-2 px-3">Current position</td>
//     <td className="py-2 px-3 text-gray-600">Marketing Manager</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Department</td>
//     <td className="py-2 px-3">Department name</td>
//     <td className="py-2 px-3 text-gray-600">Marketing</td>
//   </tr>
//   <tr className="border-b border-gray-200">
//     <td className="py-2 px-3 font-mono text-xs bg-white">Employment Status</td>
//     <td className="py-2 px-3">Current status</td>
//     <td className="py-2 px-3 text-gray-600">Active</td>
//   </tr>
// </tbody>
//               </table>
//             </div>

//             <div className="mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">Sample Data Preview:</h3>
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-x-auto">
//                 <pre className="text-xs font-mono whitespace-pre">
// {`Employee Number,Employee Name,E-mail Address,Address Line 1,City State Zip,Home Phone
// 3321,Abernathy Rita K.,rabernathy@company.org,9790 North 100 West,Fountaintown IN 46130,(317) 752-2091
// 7051,Abram Crystal M.,cabram@company.org,4082 Congaree Ln,Indianapolis IN 46235,(317) 640-9743
// 8866,Abrams Tina J.,tabrams@company.org,8538 S. Co. Rd. 200 W,Spiceland IN 47385,(765) 524-8688`}
//                 </pre>
//               </div>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <div>
//                   <p className="font-semibold text-yellow-900 mb-1">Important Notes:</p>
//                   <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
//                     <li>File must be in CSV or Excel (.xlsx) format</li>
//                     <li>First row should contain column headers</li>
//                     <li>Email addresses are required for analysis</li>
//                     <li>Empty fields are allowed but may affect analysis quality</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 border-t border-gray-200 flex justify-end">
//             <button
//               onClick={() => setShowSampleFormat(false)}
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
//             >
//               Got it
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };



//   const exportToCSV = () => {
//     if (isReportLocked) {
//       setShowPasscodePopup(true);
//       return;
//     }

//     if (!result || result.length === 0) {
//       alert('No data to export');
//       return;
//     }
  
//     const categories = [
//       'Work Life Balance',
//       'Communication',
//       'Financial',
//       'Schedule'
//     ];
  
//     const headers = [
//       'Employee Number',
//       'Employee Name',
//       'Email',
//       'Last Hire Date',
//       'Job Start Date',
//       'Termination Date',
//       'Termination Reason',
//       'Employment Status',
//       'Date of Birth',
//       'Job Title',
//       'Department',
//       'Facility',
//       ...categories,
//       'Final Score',
//       'Improvement Area',
//       'Risk Level',
//       'Possible Improved Score',
//       'Phone'
//     ];
  
//     const csvRows = result.map((emp, index) => {
//       const improvementArea = getImprovementArea(emp);
//       const riskLevel = emp.riskLevel || getRiskLevel(emp.totalScore);
//       let improvedScore = calculateImprovedScore(emp.totalScore);
//       if(!improvedScore){
//         improvedScore=0;
//       }
//       return [
//         index + 1,
//         emp.name || 'Unknown',
//         emp.email || '',
//         emp.last_hire_date || '',
//         emp.job_start || '',
//         emp.termination_date || '',
//         emp.termination_reason || '',
//         emp.employement_status || '',
//         emp.date_of_birth || '',
//         emp.job_title || '',
//         emp.department || '',
//         emp.facility || '',
//         ...categories.map(cat => emp[cat] || 0),
//         emp.totalScore || 0,
//         improvementArea,
//         riskLevel,
//         improvedScore,
//         emp.phone
//       ];
//     });
  
//     const csvContent = [headers, ...csvRows]
//       .map(row => row.map(cell => `"${cell}"`).join(','))
//       .join('\n');
  
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
    
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `employee_engagement_report_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const EmployeeDashboard = () => {
//     const getRiskColor = (risk) => {
//       if (risk >= 70) return 'bg-red-500';
//       if (risk >= 50) return 'bg-yellow-500';
//       return 'bg-green-500';
//     };

//     const totalAverage = result.length > 0 
//       ? Math.round(result.reduce((sum, employee) => sum + (employee.totalScore || 0), 0) / result.length)
//       : 0;

//     return (
//       <div className="mt-8">
//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
       
//           <div className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
//             <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">
//               {totalAverage}%
//             </div>
//             <div className="flex-1 min-w-0">
             
//               <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">
//                 Employee Sentiment Dashboard
//               </h1>
//               <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-1 leading-tight">
//                 Overall Sentiment Risk Score
//               </p>
//               <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight">
//                 Team: Marketing • Last 30 Days
//               </p>
//             </div>
//           </div>

//           {isReportLocked && (
//             <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-center gap-3">
//               <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//               <div className="flex-1">
//                 <p className="font-semibold text-yellow-900">Report Locked</p>
//                 <p className="text-sm text-yellow-700">Complete payment to unlock and download</p>
//               </div>
//             </div>
//           )}

//           <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 text-gray-600 font-medium text-sm">
//             <div className="col-span-1 text-center">#</div>
//             <div className="col-span-5">Employee</div>
//             <div className="col-span-3 text-center">Risk Score</div>
//             <div className="col-span-3 text-center">Top Category</div>
//           </div>

//           <div className="space-y-0">
//             {result?.map((employee, index) => (
//               <div key={index} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors">
//                 <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center px-4 py-4">
//                   <div className="col-span-1 flex justify-center">
//                     <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium text-xs">
//                       👤
//                     </div>
//                   </div>
//                   <div className="col-span-5">
//                     <h3 className="font-semibold text-gray-900 text-base">
//                       {employee?.name || 'Unknown'}
//                     </h3>
//                   </div>
//                   <div className="col-span-3 flex justify-center items-center gap-2">
//                     <div className={`w-10 h-10 ${getRiskColor(employee?.totalScore || 0)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
//                       {employee?.totalScore || 0}
//                     </div>
//                     <span className="font-semibold text-gray-700 text-sm">
//                       {employee?.totalScore || 0}%
//                     </span>
//                   </div>
//                   <div className="col-span-3 text-center">
//                     <span className="font-semibold text-gray-900 text-sm">
//                       {getTopCategory(employee) || "No categories"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
//           <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">
//             Average Risk Score by Category
//           </h2>
          
//           <div className="space-y-3 sm:space-y-4">
//             {categoryAverages.map((category, index) => (
//               <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
//                 <div className="w-full sm:w-32 md:w-36 lg:w-40 flex-shrink-0">
//                   <span className="font-medium text-gray-700 text-sm sm:text-base">
//                     {category.name}
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   <div className="relative">
//                     <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8 lg:h-10">
//                       <div 
//                         className="bg-blue-500 h-6 sm:h-8 lg:h-10 rounded-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-500 ease-out"
//                         style={{ width: `${Math.max(category.score * 2, 5)}%` }}
//                       >
//                         <span className="text-white font-bold text-xs sm:text-sm">
//                           {category.score}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 sm:mt-6 flex justify-between text-xs sm:text-sm text-gray-500 px-4 sm:px-8 lg:px-32">
//             <span>0</span>
//             <span>25</span>
//             <span>50</span>
//             <span>75</span>
//             <span>100</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
//       <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
//       <div className='flex justify-center items-center text-center mb-4'>
//   <img 
//     src="/logo.jpg" 
//     alt="Company Logo" 
//     className="h-20 sm:h-24 lg:h-32 w-auto object-contain"
//   />
// </div>

// {/* Add this credits badge */}
// <div className="flex justify-center mb-4">
//   <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full px-6 py-2 shadow-lg">
//     <p className="text-white font-semibold text-sm sm:text-base">
//       💰 Available Credits: ${credits.toFixed(2)}
//     </p>
//   </div>
// </div>

//   <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
   
//     <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center">
//       Employee Engagement Insights
//     </h2>
//   </div>
          
//           <div className="mb-3 flex justify-end">
//             <button
//               onClick={() => setShowSampleFormat(true)}
//               className="text-sm text-blue-600 hover:text-blue-700 underline"
//             >
//               View sample file format
//             </button>
//           </div>

//           <div 
//             className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6 transition-all duration-300 ${
//               isDragging 
//                 ? 'border-blue-500 bg-blue-50' 
//                 : 'border-blue-300 bg-white hover:border-blue-400 hover:bg-blue-50'
//             }`}
//           >
//             <input 
//               type="file" 
//               id="fileInput" 
//               onChange={handleFileChange} 
//               accept=".csv, .xlsx"
//               className="hidden"
//             />
//             <label htmlFor="fileInput" className="cursor-pointer">
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 width="40" 
//                 height="40" 
//                 viewBox="0 0 24 24"
//                 fill="#3B82F6"
//                 className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
//               >
//                 <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
//               </svg>
//               <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-2">
//                 Drag and drop your CSV/Excel file here or click to browse
//               </p>
//               {file && (
//                 <p className="text-blue-600 font-medium text-sm sm:text-base mt-2">
//                   Selected file: {file.name}
//                 </p>
//               )}
//             </label>
//           </div>

//           <button 
//             onClick={handleUploadClick} 
//             disabled={!file || isLoading}
//             className={`w-full sm:w-auto mx-auto block px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
//               !file || isLoading
//                 ? 'bg-gray-400 text-white cursor-not-allowed' 
//                 : 'bg-blue-500 text-white hover:bg-blue-600 hover:transform hover:scale-105 active:scale-95'
//             }`}
//           >
//             {isLoading ? 'Processing...' : 'Upload & Analyze'}
//           </button>

//           {result.length > 0 && (
//             <button 
//               onClick={exportToCSV}
//               className={`w-full sm:w-auto mx-auto block mt-3 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
//                 isReportLocked 
//                   ? 'bg-gray-400 text-white cursor-not-allowed' 
//                   : 'bg-purple-500 text-white hover:bg-purple-600 hover:transform hover:scale-105 active:scale-95'
//               }`}
//             >
//               {isReportLocked ? '🔒 Export Locked' : 'Export CSV'}
//             </button>
//           )}
//         </div>

//         {result.length > 0 && <EmployeeDashboard />}
//       </div>

//       <ConfirmationPopup
//   isOpen={showConfirmation}
//   onClose={() => setShowConfirmation(false)}
//   onConfirm={handleConfirmUpload}
//   isLoading={isLoading}
//   title="Confirm File Processing"
//   message={`
//     File Count: ${recordCount} contact${recordCount !== 1 ? 's' : ''}
//     Contact Rate: $2.95
//     Amount: $${isNaN(originalAmount) || originalAmount === 0 ? '0.00' : (originalAmount / 100).toFixed(2)}
    
//     Are you sure you want to proceed?
//   `}
// />

//       <PaymentPopup
//         isOpen={showPaymentPopup}
//         onClose={() => setShowPaymentPopup(false)}
//         onDownload={handleProceedToPayment}
//       />

//       <PasscodePopup
//         isOpen={showPasscodePopup}
//         onClose={() => {
//           setShowPasscodePopup(false);
//           setPasscodeError('');
//         }}
//         onSubmit={handlePasscodeSubmit}
//         error={passcodeError}
//       />
//       <StripePaymentPopup
//         isOpen={showStripePayment}
//         onClose={() => setShowStripePayment(false)}
//         onSuccess={handlePaymentSuccess}
//         amount={totalAmount}
//         recordCount={recordCount}
//       />

// <SampleFormatModal />
//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default UploadFile;










import React, { useEffect, useState } from 'react';
import ConfirmationPopup from './components/ConfirmationPopup';
import PasscodePopup from './components/PasscodePopup';
import PaymentPopup from './components/PaymentPopup';
import StripePaymentPopup from './components/StripePaymentPopup';

import { BASE_URL } from './baseurl';
function UploadFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sameFile, setSameFile] = useState(null);
  const [showSampleFormat, setShowSampleFormat] = useState(false);
  
  // Popup states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showPasscodePopup, setShowPasscodePopup] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');
  const [isReportLocked, setIsReportLocked] = useState(false);
  const [correctPasscode,setCorrectPasscode] = useState('DEMO2024');
  const [recordCount, setRecordCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [credits,setCredits]=useState(0)
  const [originalAmount, setOriginalAmount] = useState(0);

  const HARDCODED_DATA = [
    {
      name: 'Abernathy, Rita K.',
      email: 'rabernathy@hancockregional.org',
      phone: '(317) 752-2091',
      categoryScores: {
        'family & work-life balance': 7,
        'communication & leadership': 6,
        'money & compensation': 3,
        'schedule & workload': 6
      },
      overallScore: 5.5,
      totalScore: 5.5,
      improvementArea: 'Financial'
    },
    {
      name: 'Abram, Crystal M.',
      email: 'cabram@hancockregional.org',
      phone: '(317) 640-9743',
      categoryScores: {
        'family & work-life balance': 4,
        'communication & leadership': 5,
        'money & compensation': 9,
        'schedule & workload': 8
      },
      overallScore: 6.5,
      totalScore: 6.5,
      improvementArea: 'Money & Compensation' // Changed from 'Work Life Balance'
    },
    {
      name: 'Abrams, Tina J.',
      email: 'tabrams@hancockregional.org',
      phone: '(765) 524-8688',
      categoryScores: {
        'family & work-life balance': 8,
        'communication & leadership': 5,
        'money & compensation': 8,
        'schedule & workload': 7
      },
      overallScore: 7,
      totalScore: 7,
      improvementArea: 'None'
    },
    {
      name: 'Abu Manneh, Rona',
      email: 'rabu-manneh@hancockregional.org',
      phone: '',
      categoryScores: {
        'family & work-life balance': 5,
        'communication & leadership': 2,
        'money & compensation': 4,
        'schedule & workload': 3
      },
      overallScore: 3.5,
      totalScore: 3.5,
      improvementArea: 'Communication, Money & Compensation, Schedule & Workload' // Changed
    },
    {
      name: 'Acosta, Caitlin',
      email: '',
      phone: '(608) 839-9957',
      categoryScores: {
        'family & work-life balance': 7,
        'communication & leadership': 8,
        'money & compensation': 1,
        'schedule & workload': 8
      },
      overallScore: 6,
      totalScore: 6,
      improvementArea: 'Money & Compensation' // Changed from 'Financial'
    },
    {
      name: 'Adams, Debra',
      email: '',
      phone: '',
      categoryScores: {
        'family & work-life balance': 10,
        'communication & leadership': 8,
        'money & compensation': 1,
        'schedule & workload': 2
      },
      overallScore: 5.25,
      totalScore: 5.25,
      improvementArea: 'Money & Compensation, Schedule & Workload' // Changed
    },
    {
      name: 'Adams, Natalie N.',
      email: 'nadams@hancockhealth.org',
      phone: '(317) 414-4477',
      categoryScores: {
        'family & work-life balance': 3,
        'communication & leadership': 1,
        'money & compensation': 1,
        'schedule & workload': 10
      },
      overallScore: 3.75,
      totalScore: 3.75,
      improvementArea: 'Work-Life Balance, Communication, Money & Compensation' // Changed
    },
    {
      name: 'Adolay, Jennifer L.',
      email: 'jadolay@hancockregional.org',
      phone: '',
      categoryScores: {
        'family & work-life balance': 7,
        'communication & leadership': 8,
        'money & compensation': 1,
        'schedule & workload': 9
      },
      overallScore: 6.25,
      totalScore: 6.25,
      improvementArea: 'Money & Compensation' // Changed from 'Financial'
    },
    {
      name: 'Aitken, Madison O.',
      email: 'MGELLINGER@HANCOCKREGIONAL.ORG',
      phone: '(317) 617-8903',
      categoryScores: {
        'family & work-life balance': 8,
        'communication & leadership': 5,
        'money & compensation': 8,
        'schedule & workload': 4
      },
      overallScore: 6.25,
      totalScore: 6.25,
      improvementArea: 'Schedule & Workload' // Changed from 'Schedule'
    }
  ];
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    
    
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      
      // Count records with Employee Name in the file
      try {
        const text = await selectedFile.text();
        const lines = text.trim().split('\n');
        
        if (lines.length <= 1) {
          setRecordCount(0);
          return;
        }
        
        // Get header row and find Employee Name column index
        const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
        const employeeNameIndex = headers.findIndex(h => 
          h.toLowerCase().includes('employee name')
        );
        
        if (employeeNameIndex === -1) {
          alert('Error: Could not find "Employee Name" column in the file');
          setFile(null);
          setRecordCount(0);
          return;
        }
        
        // Count rows that have a non-empty Employee Name
        let validCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split(',');
          const employeeName = columns[employeeNameIndex]?.trim().replace(/['"]/g, '');
          
          if (employeeName && employeeName.length > 0) {
            validCount++;
          }
        }
        
        setRecordCount(validCount);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error reading file. Please ensure it is a valid CSV file.');
        setFile(null);
        setRecordCount(0);
      }
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };

  


  const calculateCategoryAverages = () => {
    if (!result || result.length === 0) return [];
    
    const categories = [
      { apiKey: 'family & work-life balance', displayName: 'Work-Life Balance' },
      { apiKey: 'communication & leadership', displayName: 'Communication' },
      { apiKey: 'money & compensation', displayName: 'Money & Compensation' },
      { apiKey: 'schedule & workload', displayName: 'Schedule & Workload' }
    ];
  
    const categoryTotals = {};
    const categoryCounts = {};
    
    categories.forEach(({ displayName }) => {
      categoryTotals[displayName] = 0;
      categoryCounts[displayName] = 0;
    });
    
    result.forEach(employee => {
      if (employee.categoryScores) {
        categories.forEach(({ apiKey, displayName }) => {
          const score = employee.categoryScores[apiKey] || 0;
          categoryTotals[displayName] += score;
          categoryCounts[displayName] += 1;
        });
      }
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

useEffect(()=>{
getCredits();
},[])

const getCredits=async()=>{
  try{
    let token = localStorage.getItem('token');

    let response = await fetch(`${BASE_URL}/getCurrentCredits`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      } 
    });
    
    // Convert the response to JSON
    let data = await response.json();
    
    console.log(data);
    setCredits(data.user.credits)
    
  }catch(e){
    console.log(e.message)
  }
}

const handleUploadClick = async () => {
  if (!file) return;

  // Add this validation
  if (recordCount === 0) {
    alert('No valid employee records found in the file. Please ensure your file contains records with Employee Names.');
    return;
  }

  try {
    let token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/calculate-price`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recordCount })
    });
    
    const { totalAmount } = await response.json();
    
    setOriginalAmount(totalAmount);
    
    const creditsInCents = credits * 100;
    
    let finalAmount = totalAmount;
    let creditsToUse = 0;
    
    if (creditsInCents > 0) {
      if (creditsInCents >= totalAmount) {
        creditsToUse = totalAmount / 100;
        finalAmount = 0;
      } else {
        creditsToUse = credits;
        finalAmount = totalAmount - creditsInCents;
      }
    }
    
    setTotalAmount(finalAmount);
    
    // CHECK IF USER HAS SUFFICIENT CREDITS OR PAYMENT ABILITY
    if (finalAmount > 0 && creditsInCents === 0) {
      // No credits at all, need full payment
      alert(`Insufficient credits! You need $${(totalAmount / 100).toFixed(2)} but have $0.00 in credits. Please add credits or proceed to payment.`);
    
    } else if (finalAmount > 0 && creditsInCents > 0) {
      // Has some credits but not enough
      alert(`Low credits! You have $${credits.toFixed(2)} in credits. After using your credits, you'll need to pay $${(finalAmount / 100).toFixed(2)}.`);

    } else if (finalAmount === 0) {
      // Has enough credits - SHOW CONFIRMATION FIRST
      setShowConfirmation(true);
    }
  } catch (error) {
    console.error('Error calculating price:', error);
    alert('Error calculating price');
  }
};

// const handleUploadClick = async () => {
//   if (!file) return;

//   try {
//     let token = localStorage.getItem('token');
//     const response = await fetch(`${BASE_URL}/calculate-price`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ recordCount })
//     });
    
//     const { totalAmount } = await response.json();
    
  
//     setOriginalAmount(totalAmount);
    
   
//     const creditsInCents = credits * 100;
    
//     let finalAmount = totalAmount;
//     let creditsToUse = 0;
    
//     if (creditsInCents > 0) {
//       if (creditsInCents >= totalAmount) {
      
//         creditsToUse = totalAmount / 100;
//         finalAmount = 0;
//       } else {
        
//         creditsToUse = credits;
//         finalAmount = totalAmount - creditsInCents;
//       }
//     }
    
//     setTotalAmount(finalAmount);
    
  
//     if (finalAmount === 0) {
//       handleFreeProcessing(creditsToUse);
//     } else {
//       setShowConfirmation(true);
//     }
//   } catch (error) {
//     console.error('Error calculating price:', error);
//     alert('Error calculating price');
//   }
// };

const handleFreeProcessing = async (creditsUsed) => {
  setIsLoading(true);
  
  try {
    // COMMENT OUT API CALL - Using hardcoded data instead
    /*
    const formData = new FormData();
    formData.append("employeeFile", file);
    formData.append("recordCount", recordCount);
    formData.append("creditsUsed", creditsUsed);
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
    setCorrectPasscode(data.passcode);
    setResult(data.results);
    */
    
    // HARDCODED DATA - Comment out and uncomment above when ready to use API
    setSameFile(file);
    setCorrectPasscode('DEMO2024');
    setResult(HARDCODED_DATA);
    setIsReportLocked(false);
    
    await getCredits();
    
  
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading file');
  } finally {
    setIsLoading(false);
  }
};


const handleConfirmUpload = async () => {
  setShowConfirmation(false);
  setIsLoading(true);
  
  try {
    let token = localStorage.getItem('token');
    
    // Check if this is a free processing (user has enough credits)
    if (totalAmount === 0) {
      // Free processing with credits
      const creditsToUse = originalAmount / 100;
      
      // DEDUCT CREDITS VIA API
      const deductResponse = await fetch(`${BASE_URL}/deductCredits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ creditsToDeduct: creditsToUse })
      });

      if (!deductResponse.ok) {
        throw new Error('Failed to deduct credits');
      }

      // COMMENT OUT API CALL - Using hardcoded data instead
      /*
      const formData = new FormData();
      formData.append("employeeFile", file);
      formData.append("recordCount", recordCount);
      formData.append("creditsUsed", creditsToUse);
      setSameFile(file);

      const res = await fetch(`${BASE_URL}/api/enrich`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      const data = await res.json();
      setCorrectPasscode(data.passcode);
      setResult(data.results);
      */
      
      // HARDCODED DATA - Comment out and uncomment above when ready to use API
      setSameFile(file);
      setCorrectPasscode('DEMO2024');
      setResult(HARDCODED_DATA);
      setIsReportLocked(false);
      
      // Refresh credits to show updated balance
      await getCredits();
      
      alert('File processed successfully using your credits!');
    } else {
      // Paid processing (partial credits + payment)
      
      // If user has some credits, deduct them first
      if (credits > 0) {
        const creditsToUse = credits; // Use all available credits
        
        const deductResponse = await fetch(`${BASE_URL}/deductCredits`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ creditsToDeduct: creditsToUse })
        });

        if (!deductResponse.ok) {
          throw new Error('Failed to deduct credits');
        }
      }
      
      // COMMENT OUT API CALL - Using hardcoded data instead
      /*
      const formData = new FormData();
      formData.append("employeeFile", file);
      const requiredCredits = originalAmount / 100;
      formData.append("creditsUsed", requiredCredits.toString());
      formData.append("amountPaid", (totalAmount / 100).toString());
      setSameFile(file);

      const res = await fetch(`${BASE_URL}/api/enrich`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process file');
      }
      
      const data = await res.json();
      setCorrectPasscode(data.passcode);
      setResult(data.results);
      */
      
      // HARDCODED DATA - Comment out and uncomment above when ready to use API
      setSameFile(file);
      setCorrectPasscode('DEMO2024');
      setResult(HARDCODED_DATA);
      setIsReportLocked(false);
      
      // Refresh credits to show updated balance
      await getCredits();
      
      alert('File processed successfully!');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert(error.message || 'Error uploading file');
  } finally {
    setIsLoading(false);
  }
};

  const handlePaymentSuccess = async (paymentIntentId) => {
    setShowStripePayment(false);
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("employeeFile", file);
      formData.append("paymentIntentId", paymentIntentId);
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
      setCorrectPasscode(data.passcode);
      setResult(data.results);
      setIsReportLocked(false);
      
      // Refresh credits after payment
      await getCredits();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };



  const getTopCategory = (employee) => {
    if (!employee || !employee.categoryScores) return 'No categories';
    
    const categories = [
      { apiKey: 'family & work-life balance', displayName: 'Work-Life Balance' },
      { apiKey: 'communication & leadership', displayName: 'Communication' },
      { apiKey: 'money & compensation', displayName: 'Money & Compensation' },
      { apiKey: 'schedule & workload', displayName: 'Schedule & Workload' }
    ];
  
    let minScore = Infinity;
    let topCategory = 'No categories';
  
    categories.forEach(({ apiKey, displayName }) => {
      const score = employee.categoryScores[apiKey] || 0;
      if (score < minScore) {
        minScore = score;
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
    if (!employee || !employee.categoryScores) return 'N/A';
    
    const categories = [
      { apiKey: 'family & work-life balance', displayName: 'Work-Life Balance' },
      { apiKey: 'communication & leadership', displayName: 'Communication' },
      { apiKey: 'money & compensation', displayName: 'Money & Compensation' },
      { apiKey: 'schedule & workload', displayName: 'Schedule & Workload' }
    ];
    
    let maxScore = -1;
    let improvementArea = 'N/A';
    let allZeros = true;
  
    categories.forEach(({ apiKey, displayName }) => {
      const score = employee.categoryScores[apiKey] || 0;
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


  const SampleFormatModal = () => {
    if (!showSampleFormat) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Sample File Format</h2>
            <button
              onClick={() => setShowSampleFormat(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Required Columns:</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your CSV file should include the following columns (in any order):
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Column Name</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Example</th>
                  </tr>
                </thead>
                <tbody>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Employee Name (Last Suffix, First MI)</td>
    <td className="py-2 px-3">Full name in format: Last, First MI</td>
    <td className="py-2 px-3 text-gray-600">Abernathy, Rita K.</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">E-mail Address</td>
    <td className="py-2 px-3">Work email</td>
    <td className="py-2 px-3 text-gray-600">rabernathy@company.org</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Home Phone (Formatted)</td>
    <td className="py-2 px-3">Contact number with formatting</td>
    <td className="py-2 px-3 text-gray-600">(317) 752-2091</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Company Name</td>
    <td className="py-2 px-3">Employer company name</td>
    <td className="py-2 px-3 text-gray-600">Acme Corporation</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Date of Birth</td>
    <td className="py-2 px-3">Employee birth date</td>
    <td className="py-2 px-3 text-gray-600">01/15/1985</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Last Hire Date</td>
    <td className="py-2 px-3">Most recent hire date</td>
    <td className="py-2 px-3 text-gray-600">03/20/2020</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Job Title</td>
    <td className="py-2 px-3">Current position</td>
    <td className="py-2 px-3 text-gray-600">Marketing Manager</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Department</td>
    <td className="py-2 px-3">Department name</td>
    <td className="py-2 px-3 text-gray-600">Marketing</td>
  </tr>
  <tr className="border-b border-gray-200">
    <td className="py-2 px-3 font-mono text-xs bg-white">Employment Status</td>
    <td className="py-2 px-3">Current status</td>
    <td className="py-2 px-3 text-gray-600">Active</td>
  </tr>
</tbody>
              </table>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sample Data Preview:</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre">
{`Employee Number,Employee Name,E-mail Address,Address Line 1,City State Zip,Home Phone
3321,Abernathy Rita K.,rabernathy@company.org,9790 North 100 West,Fountaintown IN 46130,(317) 752-2091
7051,Abram Crystal M.,cabram@company.org,4082 Congaree Ln,Indianapolis IN 46235,(317) 640-9743
8866,Abrams Tina J.,tabrams@company.org,8538 S. Co. Rd. 200 W,Spiceland IN 47385,(765) 524-8688`}
                </pre>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Important Notes:</p>
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>File must be in CSV or Excel (.xlsx) format</li>
                    <li>First row should contain column headers</li>
                    <li>Email addresses are required for analysis</li>
                    <li>Empty fields are allowed but may affect analysis quality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setShowSampleFormat(false)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
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
  
    const headers = [
      'Employee Number',
      'Employee Name',
      'Email',
      'Phone',
      'Work Life Balance',
      'Communication',
      'Financial',
      'Schedule',
      'Final Score',
      'Improvement Area'
    ];
  
    const csvRows = result.map((emp, index) => {
      return [
        index + 1,
        emp.name || 'Unknown',
        emp.email || '',
        emp.phone || '',
        emp.categoryScores?.['family & work-life balance'] || 0,
        emp.categoryScores?.['communication & leadership'] || 0,
        emp.categoryScores?.['money & compensation'] || 0,
        emp.categoryScores?.['schedule & workload'] || 0,
        emp.overallScore || emp.totalScore || 0,
        emp.improvementArea || 'N/A'
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
      <div className='flex justify-center items-center text-center mb-4'>
  <img 
    src="/logo.jpg" 
    alt="Company Logo" 
    className="h-20 sm:h-24 lg:h-32 w-auto object-contain"
  />
</div>

{/* Add this credits badge */}
<div className="flex justify-center mb-4">
  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full px-6 py-2 shadow-lg">
    <p className="text-white font-semibold text-sm sm:text-base">
      💰 Available Credits: ${credits.toFixed(2)}
    </p>
  </div>
</div>

  <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
   
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center">
      Employee Engagement Insights
    </h2>
  </div>
          
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => setShowSampleFormat(true)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              View sample file format
            </button>
          </div>

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
  message={`
    File Count: ${recordCount} contact${recordCount !== 1 ? 's' : ''}
    Contact Rate: $2.95
    Amount: $${isNaN(originalAmount) || originalAmount === 0 ? '0.00' : (originalAmount / 100).toFixed(2)}
    
    Are you sure you want to proceed?
  `}
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
      <StripePaymentPopup
        isOpen={showStripePayment}
        onClose={() => setShowStripePayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={totalAmount}
        recordCount={recordCount}
      />

<SampleFormatModal />
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
