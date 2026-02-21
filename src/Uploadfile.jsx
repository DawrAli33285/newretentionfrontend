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
    const [showFilterPopup, setShowFilterPopup] = useState(false);
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
    const [activeTab, setActiveTab] = useState('prehire');

    // NEW: Filter states
  // NEW: Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedJobClass, setSelectedJobClass] = useState('all');
  const [selectedHireDate, setSelectedHireDate] = useState('all');
  const [selectedTermDate, setSelectedTermDate] = useState('all');
  const [selectedOrganization, setSelectedOrganization] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('all');

  const [filters] = useState({
    Organization: ['Healthcare Services'],
    Division: ['Clinical Operations'],
    Department: ['Administration', 'Physical Therapy', 'Nursing'],
    'Job Class': ['Receptionist', 'Therapist', 'Nurse'],
    'Hire Date': ['03/20/2025', '03/20/2023', '03/20/2022', '03/20/2021', '03/20/2020'],
    'Term Date': ['01/10/2025'],
    'Salary Range': ['40k-50k', '60k-80k', '70k-90k']
  });

  const [filteredResult, setFilteredResult] = useState([]);
  const [filteredEmployeesData, setFilteredEmployeesData] = useState(null);

    const HARDCODED_DATA = [
      {
        employeeNumber: 3321,
        name: 'Abernathy, Rita K.',
        address: '9790 North 100 West',
        salaryRange: '40k-50k',
        cityStateZip: 'Fountaintown, IN 46130',
        email: 'rabernathy@hancockregional.org',
        alternateEmail: '',
        phone: '(317) 752-2091',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        hireDate: '03/20/2025',
        categoryScores: {
          'finances': 7,
          'work life': 6,
          'schedule': 3,
          'family': 6
        },
        overallScore: 5.5,
        totalScore: 5.5,
        improvementArea: 'Financial',
        jobClass: 'Receptionist',
        department: 'Administration'
      },
      {
        employeeNumber: 7051,
        name: 'Abram, Crystal M.',
        address: '4082 Congaree Ln',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        hireDate: '03/20/2023',
        salaryRange: '70k-90k',
        cityStateZip: 'Indianapolis, IN 46235',
        email: 'cabram@hancockregional.org',
        alternateEmail: 'crystalabram45@gmail.com',
        phone: '(317) 640-9743',
        categoryScores: {
          'finances': 4,
          'work life': 5,
          'schedule': 9,
          'family': 8
        },
        overallScore: 6.5,
        totalScore: 6.5,
        improvementArea: 'Work Life Balance',
        jobClass: 'Receptionist',
        department: 'Administration'
      },
      {
        employeeNumber: 8866,
        name: 'Abrams, Tina J.',
        address: '8538 S. Co. Rd. 200 W',
        cityStateZip: 'Spiceland, IN 47385',
        salaryRange: '70k-90k',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        email: 'tabrams@hancockregional.org',
        termDate: '01/10/2025',
        hireDate: '03/20/2021',
        alternateEmail: 'tabrams8688@gmail.com',
        phone: '(765) 524-8688',
        categoryScores: {
          'finances': 8,
          'work life': 5,
          'schedule': 8,
          'family': 7
        },
        overallScore: 7,
        totalScore: 7,
        improvementArea: 'None',
        jobClass: 'Therapist',
        department: 'Physical Therapy'
      },
      {
        employeeNumber: 8368,
        name: 'Abu Manneh, Rona',
        address: '10550 Geist View Drive',
        cityStateZip: 'McCordsville, IN 46055',
        organization: 'Healthcare Services',
        termDate: '01/10/2025',
        salaryRange: '60k-80k',
        division: 'Clinical Operations',
        hireDate: '03/20/2022',
        email: 'rabu-manneh@hancockregional.org',
        alternateEmail: '',
        phone: '',
        categoryScores: {
          'finances': 5,
          'work life': 2,
          'schedule': 4,
          'family': 3
        },
        overallScore: 3.5,
        totalScore: 3.5,
        improvementArea: 'Communication, Financial, Schedule',
        jobClass: 'Therapist',
        department: 'Physical Therapy'
      },
      {
        employeeNumber: 6885,
        name: 'Acosta, Caitlin',
        address: '2915 Sheffield Dr',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        salaryRange: '60k-80k',
        cityStateZip: 'Indianapolis, IN 46229',
        hireDate: '03/20/2020',
        email: '',
        termDate: '01/10/2025',
        alternateEmail: '',
        phone: '(608) 839-9957',
        categoryScores: {
          'finances': 7,
          'work life': 8,
          'schedule': 1,
          'family': 8
        },
        overallScore: 6,
        totalScore: 6,
        improvementArea: 'Financial',
        jobClass: 'Therapist',
        department: 'Physical Therapy'
      },
      {
        employeeNumber: 900003,
        name: 'Adams, Debra',
        address: '801 N. State St.',
        cityStateZip: 'Greenfield, IN 46140',
        hireDate: '03/20/2020',
        email: '',
        salaryRange: '40k-50k',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        alternateEmail: '',
        phone: '',
        categoryScores: {
          'finances': 10,
          'work life': 8,
          'schedule': 1,
          'family': 2
        },
        overallScore: 5.25,
        totalScore: 5.25,
        improvementArea: 'Financial, Schedule',
        jobClass: 'Nurse',
        department: 'Nursing'
      },
      {
        employeeNumber: 7579,
        name: 'Adams, Natalie N.',
        address: '1611 Whisler Drive',
        cityStateZip: 'Greenfield, IN 46140',
        email: 'nadams@hancockhealth.org',
        hireDate: '03/20/2020',
        alternateEmail: 'nadams@hancockhealth.org',
        phone: '(317) 414-4477',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        categoryScores: {
          'finances': 3,
          'work life': 1,
          'schedule': 1,
          'family': 10
        },
        overallScore: 3.75,
        totalScore: 3.75,
        improvementArea: 'Work Life Balance, Communication, Financial',
        jobClass: 'Nurse',
        department: 'Nursing'
      },
      {
        employeeNumber: 5706,
        name: 'Adolay, Jennifer L.',
        address: '9917 Wild Turkey Row',
        cityStateZip: 'McCordsville, IN 46055',
        hireDate: '03/20/2020',
        email: 'jadolay@hancockregional.org',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        alternateEmail: 'adolayp@comcast.net',
        phone: '',
        categoryScores: {
          'finances': 7,
          'work life': 8,
          'schedule': 1,
          'family': 9
        },
        overallScore: 6.25,
        totalScore: 6.25,
        improvementArea: 'Financial',
        jobClass: 'Nurse',
        department: 'Nursing'
      },
      {
        employeeNumber: 6725,
        name: 'Aitken, Madison O.',
        address: '4029 E 1100 N',
        cityStateZip: 'Pendleton, IN 46064',
        email: 'MGELLINGER@HANCOCKREGIONAL.ORG',
        organization: 'Healthcare Services',
        division: 'Clinical Operations',
        hireDate: '03/20/2020',
        alternateEmail: 'madisongellinger2016@gmail.com',
        phone: '(317) 617-8903',
        categoryScores: {
          'finances': 8,
          'work life': 5,
          'schedule': 8,
          'family': 4
        },
        overallScore: 6.25,
        totalScore: 6.25,
        improvementArea: 'Schedule',
        jobClass: 'Nurse',
        department: 'Nursing'
      }
    ];

    // NEW: Apply filters whenever result, selectedDepartment, or selectedJobClass changes
    useEffect(() => {
      applyFilters();
    }, [result, selectedDepartment, selectedJobClass, selectedHireDate, selectedTermDate, selectedOrganization, selectedDivision, selectedSalaryRange]);

    // NEW: Function to apply filters
    const applyFilters = () => {
      let filtered = [...result];
    
      // Filter by department
      if (selectedDepartment !== 'all') {
        filtered = filtered.filter(emp => emp.department === selectedDepartment);
      }
    
      // Filter by job class
      if (selectedJobClass !== 'all') {
        filtered = filtered.filter(emp => emp.jobClass === selectedJobClass);
      }
    
      // Filter by organization
      if (selectedOrganization !== 'all') {
        filtered = filtered.filter(emp => emp.organization === selectedOrganization);
      }
    
      // Filter by division
      if (selectedDivision !== 'all') {
        filtered = filtered.filter(emp => emp.division === selectedDivision);
      }
    
      // Filter by hire date
      if (selectedHireDate !== 'all') {
        filtered = filtered.filter(emp => emp.hireDate === selectedHireDate);
      }
    
      // Filter by term date
      if (selectedTermDate !== 'all') {
        filtered = filtered.filter(emp => emp.termDate === selectedTermDate);
      }
    
      // Filter by salary range
      if (selectedSalaryRange !== 'all') {
        filtered = filtered.filter(emp => emp.salaryRange === selectedSalaryRange);
      }
    
      setFilteredResult(filtered);
    };

    // NEW: Get unique job classes from result


  // ADD THESE NEW FUNCTIONS:



  // ADD THIS NEW FUNCTION:
  const getUniqueSalaryRanges = () => {
    const salaryRanges = [...new Set(result.map(emp => emp.salaryRange).filter(Boolean))];
    return salaryRanges.sort();
  };

  const getUniqueOrganizations = () => {
    const organizations = [...new Set(result.map(emp => emp.organization).filter(Boolean))];
    return organizations.sort();
  };

  const getUniqueDivisions = () => {
    const divisions = [...new Set(result.map(emp => emp.division).filter(Boolean))];
    return divisions.sort();
  };

  const getUniqueHireDates = () => {
    const hireDates = [...new Set(result.map(emp => emp.hireDate).filter(Boolean))];
    return hireDates.sort();
  };

  const getUniqueTermDates = () => {
    const termDates = [...new Set(result.map(emp => emp.termDate).filter(Boolean))];
    return termDates.sort();
  };

    // NEW: Get unique departments from result
    const getUniqueDepartments = () => {
      const departments = [...new Set(result.map(emp => emp.department).filter(Boolean))];
      return departments.sort();
    };

    // NEW: Get unique job classes from result
    const getUniqueJobClasses = () => {
      const jobClasses = [...new Set(result.map(emp => emp.jobClass).filter(Boolean))];
      return jobClasses.sort();
    };


    // Add this NEW function
const getFilteredRecordCount = () => {
  if (!file) return 0;
  
  let count = recordCount; // Start with total records
  
  // This is a simplified count - you'd need to actually parse the file
  // For now, just return the filtered result length if available
  if (result.length > 0) {
    return filteredResult.length;
  }
  
  return count;
};

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
        // Get header row and find Employee Name column index
const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
const employeeNameIndex = headers.findIndex(h => 
  h.toLowerCase().includes('employee name')
);

console.log('Headers:', headers);
console.log('Employee Name Index:', employeeNameIndex);

// If Employee Name column not found, count all non-empty rows
if (employeeNameIndex === -1) {
  console.warn('Employee Name column not found, counting all rows');
  setRecordCount(lines.length - 1); // All rows except header
} else {
  // Count rows that have a non-empty Employee Name
  let validCount = 0;
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',');
    const employeeName = columns[employeeNameIndex]?.trim().replace(/['"]/g, '');
    
    if (employeeName && employeeName.length > 0) {
      validCount++;
    }
  }
  
  console.log('Valid employee count:', validCount);
  setRecordCount(validCount);
}
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

    

    const LoadingOverlay = () => {
      console.log('LoadingOverlay rendered, recordCount:', recordCount);
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your File</h3>
              <p className="text-gray-600 text-center mb-4">
                Analyzing {recordCount} employee record{recordCount !== 1 ? 's' : ''}...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-4">This may take a few moments</p>
            </div>
          </div>
        </div>
      );
    };


    const calculateCategoryAverages = () => {
      if (!filteredResult || filteredResult.length === 0) return [];
      
      const categories = [
        { apiKey: 'finances', displayName: 'Finances' },
        { apiKey: 'work life', displayName: 'Work Life' },
        { apiKey: 'schedule', displayName: 'Schedule' },
        { apiKey: 'family', displayName: 'Family' }
      ];
      const categoryTotals = {};
      const categoryCounts = {};
      
      categories.forEach(({ displayName }) => {
        categoryTotals[displayName] = 0;
        categoryCounts[displayName] = 0;
      });
      
      filteredResult.forEach(employee => {
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
  
    if (recordCount === 0) {
      alert('No valid employee records found in the file. Please ensure your file contains records with Employee Names.');
      return;
    }
    
    setIsLoading(true);
  
    try {
      let token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      
      // Add filters to form data
      const filters = {
        department: selectedDepartment,
        jobClass: selectedJobClass,
        hireDate: selectedHireDate,
        termDate: selectedTermDate,
        organization: selectedOrganization,
        division: selectedDivision,
        salaryRange: selectedSalaryRange
      };
      formData.append('filters', JSON.stringify(filters));
      
      // Call the NEW filter-and-count endpoint
      const response = await fetch(`${BASE_URL}/filter-and-count`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
    
      const { recordCount: filteredCount, totalAmount, originalCount, tempId, filteredEmployees } = await response.json();

      console.log('=== FILTER AND COUNT RESPONSE ===');
      console.log('Filtered Count:', filteredCount);
      console.log('Original Count:', originalCount);
      console.log('Total Amount:', totalAmount);
      console.log('Temp ID:', tempId);
      console.log('Filtered Employees:', filteredEmployees);
      
    
      setFilteredEmployeesData(filteredEmployees);
if (filteredCount === 0) {
  setIsLoading(false);
  setShowFilterPopup(true);
  alert(`No records match the selected filters. Found 0 records out of ${originalCount} total records. Please adjust your filters and try again.`);
  return; 
}


setRecordCount(filteredCount);
setOriginalAmount(totalAmount);


localStorage.setItem('tempId', tempId);

const creditsInCents = credits * 100;
let finalAmount = totalAmount;

console.log('Credits in cents:', creditsInCents);

if (creditsInCents > 0) {
  if (creditsInCents >= totalAmount) {
    finalAmount = 0;
  } else {
    finalAmount = totalAmount - creditsInCents;
  }
}

console.log('Final Amount:', finalAmount);

setTotalAmount(finalAmount);
setIsLoading(false);

if (finalAmount > 0 && creditsInCents === 0) {
  alert(`Insufficient Credits. Filtered ${filteredCount} out of ${originalCount} records. Please contact admin support rsmith@prognosticare.org`);
} else if (finalAmount > 0 && creditsInCents > 0) {
  alert(`Insufficient Credits. Filtered ${filteredCount} out of ${originalCount} records. Please contact admin support rsmith@prognosticare.org`);
} else if (finalAmount === 0) {
  console.log('Opening confirmation popup...');
  setShowConfirmation(true);
}
    } catch (error) {
      console.error('Error calculating price:', error);
      setIsLoading(false);
      alert('Error calculating price');
    }
  };

  const handleFreeProcessing = async (creditsUsed) => {
    setIsLoading(true);
    
    try {
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



  const FilterPopup = () => {
    if (!showFilterPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Filter Data Before Processing</h2>
              <p className="text-sm text-gray-600 mt-1">Select filters to apply to your {recordCount} employee records</p>
            </div>
            <button
              onClick={() => setShowFilterPopup(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Organization Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Organization
                </label>
                <select
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Organizations</option>
                  {filters.Organization.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Division
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Divisions</option>
                  {filters.Division.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Departments</option>
                  {filters.Department.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Class Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Job Class
                </label>
                <select
                  value={selectedJobClass}
                  onChange={(e) => setSelectedJobClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Job Classes</option>
                  {filters['Job Class'].map((jobClass) => (
                    <option key={jobClass} value={jobClass}>
                      {jobClass}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hire Date Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Hire Date
                </label>
                <select
                  value={selectedHireDate}
                  onChange={(e) => setSelectedHireDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Hire Dates</option>
                  {filters['Hire Date'].map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>

              {/* Term Date Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Term Date
                </label>
                <select
                  value={selectedTermDate}
                  onChange={(e) => setSelectedTermDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Term Dates</option>
                  {filters['Term Date'].map((date) => (
                    <option key={date} value={date}>
                      {date || 'Active'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Salary Range
                </label>
                <select
                  value={selectedSalaryRange}
                  onChange={(e) => setSelectedSalaryRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Salary Ranges</option>
                  {filters['Salary Range'].map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedDepartment !== 'all' || selectedJobClass !== 'all' || selectedHireDate !== 'all' || 
              selectedTermDate !== 'all' || selectedOrganization !== 'all' || selectedDivision !== 'all' || 
              selectedSalaryRange !== 'all') && (
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedJobClass('all');
                  setSelectedHireDate('all');
                  setSelectedTermDate('all');
                  setSelectedOrganization('all');
                  setSelectedDivision('all');
                  setSelectedSalaryRange('all');
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
 
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilterPopup(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowFilterPopup(false);
                  handleUploadClick();
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Proceed to Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    
    try {
      let token = localStorage.getItem('token');
      
      console.log('Calling bulk upload API...');
      console.log('Filtered employees to upload:', filteredEmployeesData?.length);
     
      const uploadResponse = await fetch(`${BASE_URL}/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employees: filteredEmployeesData,
          recordCount: recordCount
        })
      });
      const uploadData = await uploadResponse.json();

   
      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload file');
      }

      console.log('Upload summary:', uploadData);

 
      if (uploadData.duplicates && uploadData.duplicates.length > 0) {
        throw new Error(`Some employees have already been processed within the last month:\n${uploadData.duplicates.map(d => d.name).join(', ')}`);
      }

     
      if (totalAmount === 0) {
       
        const creditsToUse = originalAmount / 100;
        
        console.log('Deducting credits:', creditsToUse);
        
        const deductResponse = await fetch(`${BASE_URL}/deductCredits`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ creditsToDeduct: creditsToUse })
        });

        if (!deductResponse.ok) {
       
          throw new Error('Upload successful but failed to deduct credits. Please contact support with this error.');
        }

        console.log('Credits deducted successfully');
      } else {
       
        if (credits > 0) {
          const creditsToUse = credits;
          
          console.log('Deducting partial credits:', creditsToUse);
          
          const deductResponse = await fetch(`${BASE_URL}/deductCredits`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ creditsToDeduct: creditsToUse })
          });

          if (!deductResponse.ok) {
            throw new Error('Upload successful but failed to deduct credits. Please contact support with this error.');
          }

          console.log('Partial credits deducted successfully');
        }
      }

      setCorrectPasscode('DEMO2024');
      setResult(HARDCODED_DATA);
      setIsReportLocked(false);
      
     
      await getCredits();
      
     
    } catch (error) {
      console.error('Upload error:', error.message);
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
        { apiKey: 'finances', displayName: 'Finances' },
        { apiKey: 'work life', displayName: 'Work Life' },
        { apiKey: 'schedule', displayName: 'Schedule' },
        { apiKey: 'family', displayName: 'Family' }
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
      if (score >= 7) return 'High Risk';
      if (score >= 4) return 'Medium Risk';
      return 'Low Risk';
    };
    
    const getCategoryRiskLevel = (score) => {
      if (score >= 7) return 'HIGH RISK';
      if (score >= 4) return 'MEDIUM RISK';
      return 'LOW RISK';
    };
    
    const getCategoryRiskColor = (score) => {
      if (score >= 7) return 'text-[#fb0000]';
      if (score >= 4) return 'text-[#fdc002]';
      return 'text-[#41d756]';
    };


    const getImprovementArea = (employee) => {
      if (!employee || !employee.categoryScores) return 'N/A';
      
      const categories = [
        { apiKey: 'finances', displayName: 'Finances' },
        { apiKey: 'work life', displayName: 'Work Life' },
        { apiKey: 'schedule', displayName: 'Schedule' },
        { apiKey: 'family', displayName: 'Family' }
      ];
      const improvementAreas = [];
    
      categories.forEach(({ apiKey, displayName }) => {
        const score = employee.categoryScores[apiKey] || 0;
        if (score >= 5) {
          improvementAreas.push(displayName);
        }
      });
    
      return improvementAreas.length > 0 ? improvementAreas.join(', ') : 'None';
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
                  Your file must include all of the following columns. Optional columns are listed separately below.
                </p>
              </div>

              {/* Required Columns Table */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 overflow-x-auto">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">REQUIRED</span>
                  <span className="text-sm text-red-700 font-semibold">These columns must be present in your file</span>
                </div>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-300">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Column Name</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Employee Name (Last Suffix, First MI)</td>
                      <td className="py-2 px-3">Full name in format: Last, First MI</td>
                      <td className="py-2 px-3 text-gray-600">Abernathy, Rita K.</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Address Line 1 + Address Line 2</td>
                      <td className="py-2 px-3">Complete address</td>
                      <td className="py-2 px-3 text-gray-600">9790 North 100 West</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">City, State Zip Code (Formatted)</td>
                      <td className="py-2 px-3">City, state and zip code</td>
                      <td className="py-2 px-3 text-gray-600">Fountaintown IN 46130</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">E-mail Address</td>
                      <td className="py-2 px-3">Work email</td>
                      <td className="py-2 px-3 text-gray-600">rabernathy@company.org</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Hire Date</td>
                      <td className="py-2 px-3">Employee hire date</td>
                      <td className="py-2 px-3 text-gray-600">03/20/2020</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Term Date</td>
                      <td className="py-2 px-3">Termination date (if applicable)</td>
                      <td className="py-2 px-3 text-gray-600">-</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Organization</td>
                      <td className="py-2 px-3">Organization name</td>
                      <td className="py-2 px-3 text-gray-600">Healthcare Services</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Division</td>
                      <td className="py-2 px-3">Division name</td>
                      <td className="py-2 px-3 text-gray-600">Clinical Operations</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Department</td>
                      <td className="py-2 px-3">Department name</td>
                      <td className="py-2 px-3 text-gray-600">Emergency Services</td>
                    </tr>
                    <tr className="border-b border-red-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Job Class</td>
                      <td className="py-2 px-3">Job classification</td>
                      <td className="py-2 px-3 text-gray-600">Registered Nurse</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Optional Columns Table */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Optional Columns:</h3>
                <p className="text-sm text-gray-600 mb-4">
                  These columns are optional but recommended for better data quality:
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 overflow-x-auto">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">OPTIONAL</span>
                  <span className="text-sm text-gray-600 font-semibold">Include these if available</span>
                </div>
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
                      <td className="py-2 px-3 font-mono text-xs bg-white">Home Phone (Formatted)</td>
                      <td className="py-2 px-3">Contact number with formatting</td>
                      <td className="py-2 px-3 text-gray-600">(317) 752-2091</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Employee Number</td>
                      <td className="py-2 px-3">Unique employee identifier</td>
                      <td className="py-2 px-3 text-gray-600">3321</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-mono text-xs bg-white">Date of Birth</td>
                      <td className="py-2 px-3">Employee birth date</td>
                      <td className="py-2 px-3 text-gray-600">01/15/1985</td>
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
  {`Employee Name (Last Suffix, First MI),E-mail Address,Address Line 1 + Address Line 2,City, State Zip Code (Formatted),Hire Date,Term Date,Organization,Division,Department,Job Class,Home Phone (Formatted)
  Abernathy, Rita K.,rabernathy@company.org,9790 North 100 West,Fountaintown IN 46130,03/20/2020,,Healthcare Services,Clinical Ops,Emergency,Registered Nurse,(317) 752-2091
  Abram, Crystal M.,cabram@company.org,4082 Congaree Ln,Indianapolis IN 46235,01/15/2019,,Healthcare Services,Admin,Reception,Receptionist,(317) 640-9743
  Abrams, Tina J.,tabrams@company.org,8538 S. Co. Rd. 200 W,Spiceland IN 47385,05/10/2021,,Healthcare Services,Admin,Reception,Receptionist,(765) 524-8688`}
                  </pre>
                </div>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: '#fef3e2', border: '1px solid #fdc002' }}>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#fdc002' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#b88a00' }}>Important Notes:</p>
                    <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: '#996f00' }}>
                      <li>File must be in CSV or Excel (.xlsx) format</li>
                      <li>First row must contain exact column headers as shown above</li>
                      <li><strong>All required columns must be present</strong> or upload will fail</li>
                      <li>Column names must match exactly (case-sensitive)</li>
                      <li>Optional fields can be left empty</li>
                      <li>Term Date can be blank for active employees</li>
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
    
      if (!filteredResult || filteredResult.length === 0) {
        alert('No data to export');
        return;
      }
    
      const headers = [
        'Employee Number',
        'Employee Name (Last Suffix, First MI)',
        'Address Line 1 + Address Line 2',
        'City, State Zip Code (Formatted)',
        'E-mail Address',
        'Alternate Email',
        'Home Phone (Formatted)',
        'Organization',
        'Division',
        'Department',
        'Job Class',
        'Hire Date',
        'Term Date',
        'Salary Range',
        'Finances',
        'Work Life',
        'Schedule',
        'Family',
        'Final Score',
        'Improvement Areas'
      ];
    
      const csvRows = filteredResult.map((emp, index) => {
        return [
          emp.employeeNumber || (3321 + index),
          emp.name || 'Unknown',
          emp.address || '',
          emp.cityStateZip || '',
          emp.email || '',
          emp.alternateEmail || '',
          emp.phone || '',
          emp.organization || '',
          emp.division || '',
          emp.department || '',
          emp.jobClass || '',
          emp.hireDate || '',
          emp.termDate || '',
          emp.salaryRange || '',
          emp.categoryScores?.['finances'] || 0,
          emp.categoryScores?.['work life'] || 0,
          emp.categoryScores?.['schedule'] || 0,
          emp.categoryScores?.['family'] || 0,
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
        if (risk >= 7) return 'bg-red-500';
        if (risk >= 4) return 'bg-yellow-500';
        return 'bg-green-500';
      };
    
      const getRetentionPercentage = (score) => {
        const percentage = Math.round((score - 5) * 10);
        
        if (percentage === 0) return 'Neutral';
        if (percentage > 0) return 'Promoter';
        return 'Detractor';
      };
    
      const getNPSLabel = (score) => {
        if (score >= 7) return 'Promoter';
        if (score >= 4) return 'Neutral';
        return 'Detractor';
      };
    
      const getNPSColor = (score) => {
        if (score >= 7) return 'text-white';
        if (score >= 4) return 'text-white';
        return 'text-white';
      };
  

      const getDomainColor = (score) => {
        if (score >= 7) return '';
        if (score >= 4) return '';
        return '';
      };


    
      const totalAverage = filteredResult.length > 0 
        ? Math.round(filteredResult.reduce((sum, employee) => sum + (employee.totalScore || 0), 0) / filteredResult.length)
        : 0;
      const [expandedEmployee, setExpandedEmployee] = useState(null);
      
      return (
        <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
          <div className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div 
    className="
      w-20 h-20
      sm:w-24 sm:h-24
      md:w-28 md:h-28
      lg:w-32 lg:h-32
      rounded-full
      flex items-center justify-center
      text-white
      font-bold
      text-[10px] sm:text-sm md:text-base lg:text-lg
      text-center
      leading-tight
      px-2
      flex-shrink-0
    "
    style={{
      backgroundColor: 
        totalAverage >= 7 ? '#41d756' : 
        totalAverage >= 4 ? '#fdc002' : 
        '#fb0000'
    }}
  >
    {getRiskLevel(totalAverage)}
  </div>
      
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">
                Employee Sentiment Dashboard
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-1 leading-tight">
                Overall Sentiment Risk Score
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Showing {filteredResult.length} of {result.length} employees
              </p>
            </div>
          </div>

          {/* NEW: Filter Section */}
        {/* NEW: Filter Section */}
  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Results</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Organization Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Organization
        </label>
        <select
          value={selectedOrganization}
          onChange={(e) => setSelectedOrganization(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Organizations</option>
          {getUniqueOrganizations().map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>
      </div>

      {/* Division Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Division
        </label>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Divisions</option>
          {getUniqueDivisions().map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>
      </div>

      {/* Department Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Department
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Departments</option>
          {getUniqueDepartments().map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Job Class Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Job Class
        </label>
        <select
          value={selectedJobClass}
          onChange={(e) => setSelectedJobClass(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Job Classes</option>
          {getUniqueJobClasses().map((jobClass) => (
            <option key={jobClass} value={jobClass}>
              {jobClass}
            </option>
          ))}
        </select>
      </div>

      {/* Hire Date Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Hire Date
        </label>
        <select
          value={selectedHireDate}
          onChange={(e) => setSelectedHireDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Hire Dates</option>
          {getUniqueHireDates().map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* Term Date Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Term Date
        </label>
        <select
          value={selectedTermDate}
          onChange={(e) => setSelectedTermDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Term Dates</option>
          {getUniqueTermDates().map((date) => (
            <option key={date} value={date}>
              {date || 'Active'}
            </option>
          ))}
        </select>
      </div>

      

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Salary Range
        </label>
        <select
          value={selectedSalaryRange}
          onChange={(e) => setSelectedSalaryRange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="all">All Salary Ranges</option>
          {getUniqueSalaryRanges().map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Clear Filters Button */}
    {(selectedDepartment !== 'all' || selectedJobClass !== 'all' || selectedHireDate !== 'all' || 
    selectedTermDate !== 'all' || selectedOrganization !== 'all' || selectedDivision !== 'all' || 
    selectedSalaryRange !== 'all') && (
    <button
      onClick={() => {
        setSelectedDepartment('all');
        setSelectedJobClass('all');
        setSelectedHireDate('all');
        setSelectedTermDate('all');
        setSelectedOrganization('all');
        setSelectedDivision('all');
        setSelectedSalaryRange('all');
      }}
      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      Clear all filters
    </button>
  )}
  </div>
          {isReportLocked && (
    <div className="mb-6 rounded-lg p-4 flex items-center gap-3" style={{ backgroundColor: '#fef3e2', border: '2px solid #fdc002' }}>
      <svg className="w-6 h-6 flex-shrink-0" style={{ color: '#fdc002' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="flex-1">
    <p className="font-semibold" style={{ color: '#b88a00' }}>Report Locked</p>
    <p className="text-sm" style={{ color: '#996f00' }}>Complete payment to unlock and download</p>
  </div>
            </div>
          )}
      
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">Applicant</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">Department</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">Job Class</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600 text-sm">Retention Likelihood</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600 text-sm">Net Promoter Score</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600 text-sm">Domains</th>
                </tr>
              </thead>
              <tbody>
                {filteredResult?.map((employee, index) => (
                  <React.Fragment key={index}>
                    <tr 
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedEmployee(expandedEmployee === index ? null : index)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                            👤
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {employee?.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {employee?.employeeNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-700 text-sm">
                        {employee?.department || 'N/A'}
                      </td>
      
                      <td className="py-4 px-4 text-gray-700 text-sm">
                        {employee?.jobClass || 'N/A'}
                      </td>
      
                      <td className="py-4 px-4">
    <div className="flex justify-center">
      <span 
        className="inline-block px-5 py-2 rounded-full font-semibold text-sm text-white"
        style={{
          backgroundColor: 
            (employee?.totalScore || 0) >= 7 ? '#41d756' : 
            (employee?.totalScore || 0) >= 4 ? '#fdc002' : 
            '#fb0000'
        }}
      >
        {getRetentionPercentage(employee?.totalScore || 0)}
      </span>
    </div>
  </td>
      
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                        <span 
    className={`inline-block px-5 py-2 rounded-full font-semibold text-sm ${getNPSColor(employee?.totalScore || 0)}`}
    style={{
      backgroundColor: 
        (employee?.totalScore || 0) >= 7 ? '#41d756' : 
        (employee?.totalScore || 0) >= 4 ? '#fdc002' : 
        '#fb0000'
    }}
  >
    {getNPSLabel(employee?.totalScore || 0)}
  </span>
                        </div>
                      </td>
      
                      <td className="py-4 px-4">
    <div className="flex flex-col gap-2">
      {Object.entries(employee?.categoryScores || {}).map(([category, score]) => (
        <span 
          key={category}
          className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold"
          style={{
            backgroundColor: 
              score >= 7 ? '#41d756' : 
              score >= 4 ? '#fdc002' : 
              '#fb0000'
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      ))}
    </div>
  </td>
                    </tr>
      
                    {expandedEmployee === index && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="p-6 border-b border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Employee Number</p>
                              <p className="text-sm font-medium text-gray-900">{employee?.employeeNumber || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Name</p>
                              <p className="text-sm font-medium text-gray-900">{employee?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Department</p>
                              <p className="text-sm font-medium text-gray-900">{employee?.department || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Job Class</p>
                              <p className="text-sm font-medium text-gray-900">{employee?.jobClass || 'N/A'}</p>
                            </div>
                          </div>
      
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Category Scores</p>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600">Finances</span>
                                  <span className={`font-bold ${getCategoryRiskColor(employee?.categoryScores?.['finances'] || 0)}`}>
                                    {getCategoryRiskLevel(employee?.categoryScores?.['finances'] || 0)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="h-2 rounded-full transition-all"
      style={{ 
        width: `${(employee?.categoryScores?.['finances'] || 0) * 10}%`,
        backgroundColor: 
          (employee?.categoryScores?.['finances'] || 0) >= 7 ? '#fb0000' : 
          (employee?.categoryScores?.['finances'] || 0) >= 4 ? '#fdc002' : 
          '#41d756'
      }}
    />
  </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600">Work Life</span>
                                  <span className={`font-bold ${getCategoryRiskColor(employee?.categoryScores?.['work life'] || 0)}`}>
                                    {getCategoryRiskLevel(employee?.categoryScores?.['work life'] || 0)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="h-2 rounded-full transition-all"
      style={{ 
        width: `${(employee?.categoryScores?.['work life'] || 0) * 10}%`,
        backgroundColor: 
          (employee?.categoryScores?.['work life'] || 0) >= 7 ? '#fb0000' : 
          (employee?.categoryScores?.['work life'] || 0) >= 4 ? '#fdc002' : 
          '#41d756'
      }}
    />
  </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600">Schedule</span>
                                  <span className={`font-bold ${getCategoryRiskColor(employee?.categoryScores?.['schedule'] || 0)}`}>
                                    {getCategoryRiskLevel(employee?.categoryScores?.['schedule'] || 0)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="h-2 rounded-full transition-all"
      style={{ 
        width: `${(employee?.categoryScores?.['schedule'] || 0) * 10}%`,
        backgroundColor: 
          (employee?.categoryScores?.['schedule'] || 0) >= 7 ? '#fb0000' : 
          (employee?.categoryScores?.['schedule'] || 0) >= 4 ? '#fdc002' : 
          '#41d756'
      }}
    />
  </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600">Family</span>
                                  <span className={`font-bold ${getCategoryRiskColor(employee?.categoryScores?.['family'] || 0)}`}>
                                    {getCategoryRiskLevel(employee?.categoryScores?.['family'] || 0)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="h-2 rounded-full transition-all"
      style={{ 
        width: `${(employee?.categoryScores?.['family'] || 0) * 10}%`,
        backgroundColor: 
          (employee?.categoryScores?.['family'] || 0) >= 7 ? '#fb0000' : 
          (employee?.categoryScores?.['family'] || 0) >= 4 ? '#fdc002' : 
          '#41d756'
      }}
    />
  </div>
                              </div>
                            </div>
                          </div>
      
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Total Score</p>
                                <p className={`text-lg font-bold ${getCategoryRiskColor(employee?.totalScore || 0)}`}>
                                  {getCategoryRiskLevel(employee?.totalScore || 0)}
                                </p>
                              </div>
                              <div>
    <p className="text-xs text-gray-500 mb-1">Improvement Area</p>
    <p className="text-sm font-semibold" style={{ color: '#fb0000' }}>{getImprovementArea(employee)}</p>
  </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {isLoading && <LoadingOverlay />}
        <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
        <div className='flex justify-center items-center text-center mb-4'>
    <img 
      src="/logo.jpg" 
      alt="Company Logo" 
      className="h-20 sm:h-24 lg:h-32 w-auto object-contain"
    />
  </div>

  <div className="flex justify-center mb-4">
    <div className="rounded-full px-6 py-2 shadow-lg" style={{ background: 'linear-gradient(to right, #41d756, #2ebd47)' }}>
      <p className="text-white font-semibold text-sm sm:text-base">
      Available Credits: {credits.toFixed(2)}
      </p>
    </div>
  </div>

  <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
  

  <div className="flex gap-2">
    <button 
      onClick={() => setActiveTab('prehire')}
      className={`px-4 py-2 text-sm sm:text-base font-medium text-white rounded ${
        activeTab === 'prehire' ? 'bg-blue-600' : 'bg-blue-400'
      } hover:bg-blue-700`}
    >
      Prehire
    </button>
    
  </div>

  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center">
    Staff Retention Application
  </h2>
  <button 
    onClick={() => setActiveTab('current')}
    className={`px-4 py-2 text-sm sm:text-base font-medium text-white rounded ${
      activeTab === 'current' ? 'bg-green-600' : 'bg-green-400'
    } hover:bg-green-700`}
  >
    Current Staff
  </button>

  </div>
  
  {activeTab === 'current' && (
    <>
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
    onClick={() => setShowFilterPopup(true)} 
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
    </>
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
      Contact Rate: 2.95
      Amount: ${isNaN(originalAmount) || originalAmount === 0 ? '0.00' : (originalAmount / 100).toFixed(2)}
      
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
  <FilterPopup />
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
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}</style>
      </div>
    );
  }

  export default UploadFile;