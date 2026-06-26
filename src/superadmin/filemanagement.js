import React, { useEffect, useState } from 'react';
import { Upload, Download, File, Search, Trash2, Filter, FileText, Image, Video, Music, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { BASE_URL } from '../baseurl';
import axios from 'axios'

export default function FileManagement({ users }) {
  const [files, setFiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingFor, setUploadingFor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getFiles();
  }, []);

  // Fetch all files from backend
  const getFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/getFiles`);
      const data = await response.json();
      console.log(data);
      setFiles(data.files || []);
    } catch (e) {
      console.error('Error fetching files:', e);
      setError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update file (e.g., toggle paid status, update output, etc.)
  const handleUpdateFile = async (id, updateData) => {
    try {
      const response = await fetch(`${BASE_URL}/updateFile/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      console.log(data.message);
      await getFiles();
      return true;
    } catch (e) {
      console.error('Error updating file:', e);
      setError('Failed to update file.');
      return false;
    }
  };

  // Filter files based on user selection and search term
  const filteredFiles = (files || []).filter(file => {
    // Handle nested user object structure
    const fileUserId = file.user?._id || file.user;
    const matchesUser = selectedUser === 'all' || fileUserId === selectedUser;
    const matchesSearch = file.file?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesSearch;
  });

  // Get appropriate icon based on file extension
  const getFileIcon = (fileName) => {
    if (!fileName) return <FileText className="w-5 h-5" style={{ color: '#5a5f6b' }} />;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
      return <Image className="w-5 h-5" style={{ color: '#233dff' }} />;
    }
    if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(ext)) {
      return <Video className="w-5 h-5" style={{ color: '#12229d' }} />;
    }
    if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) {
      return <Music className="w-5 h-5" style={{ color: '#000000' }} />;
    }
    return <FileText className="w-5 h-5" style={{ color: '#5a5f6b' }} />;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingFor) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user', uploadingFor);
      formData.append('passcode', Math.random().toString(36).substring(7));

      const response = await fetch(`${BASE_URL}/uploadFile`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload successful:', data);
      
      await getFiles();
      setUploadingFor(null);
      e.target.value = null;
    } catch (e) {
      console.error('Error uploading file:', e);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await fetch(`${BASE_URL}/deleteFile/${fileId}`, {
        method: 'DELETE',
      });
      await getFiles();
    } catch (e) {
      console.error('Error deleting file:', e);
      setError('Failed to delete file.');
    }
  };

  // Handle file download
  const handleDownload = (outputUrl, fileName) => {
    if (!outputUrl) {
      setError('No download link available for this file.');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = outputUrl;
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Error downloading file:', e);
      setError('Failed to download file.');
    }
  };

  // Toggle paid status
  const togglePaidStatus = async (fileId, currentStatus) => {
    await handleUpdateFile(fileId, { paid: !currentStatus });
  };

  const sendPasscode=async(file)=>{
    try{
let response=await axios.post(`${BASE_URL}/sendPassCode`,{id:file._id,email:file.user.email})
setFiles(prev => {
  return prev.map(f =>
    f._id === file._id
      ? { ...f, paid: true }
      : f
  );
});
alert("Pass code sent sucessfully")
}catch(e){
if(e?.response?.data?.error){
  setError(e?.response?.data?.error)
}else{
  setError("Error while trying to send pass code")
}
    }
  }

  return (
  <>

  {/* Brand fonts: Anton (display) + Poppins (body) */}
  <link
    href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600&display=swap"
    rel="stylesheet"
  />

  <div
    className="min-h-screen p-6"
    style={{ background: '#f5f6fa', fontFamily: "'Poppins', sans-serif" }}
  >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
          >
            FILE MANAGEMENT
          </h1>
          <p style={{ color: '#5a5f6b' }}>Upload and manage files for all users</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
            style={{ background: '#fdeeee', border: '1px solid #f3c9c9', color: '#a13333' }}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
              style={{ color: '#a13333' }}
            >
              ×
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div
          className="rounded-xl shadow-sm p-6 mb-6"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                style={{ border: '1px solid #d1d5db', boxShadow: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = '#233dff'; e.target.style.boxShadow = '0 0 0 2px rgba(35,61,255,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5" style={{ color: '#9ca3af' }} />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none appearance-none"
                style={{ border: '1px solid #d1d5db', background: '#ffffff', boxShadow: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = '#233dff'; e.target.style.boxShadow = '0 0 0 2px rgba(35,61,255,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="all">All Users</option>
                {users?.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      
        {/* Files Table */}
        <div
          className="rounded-xl shadow-sm overflow-hidden"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#233dff' }} />
              <span className="ml-3" style={{ color: '#5a5f6b' }}>Loading files...</span>
            </div>
          ) : (
            <>
              {filteredFiles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ background: '#f5f6fa', borderBottom: '1px solid #e5e7eb' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>File Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Passcode</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Records</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Upload Date</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: '#000000' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                      {filteredFiles.map((file) => {
                        return (
                          <tr
                            key={file._id}
                            className="transition-colors"
                            style={{ borderBottom: '1px solid #e5e7eb' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {getFileIcon(file.file)}
                                <div>
                                  <p className="font-medium" style={{ color: '#000000' }}>{file.file}</p>
                                  {file.output && (
                                    <p className="text-xs mt-1 hover:underline cursor-pointer" style={{ color: '#233dff' }}>
                                      <a href={file.output} target="_blank" rel="noopener noreferrer">
                                        View Output
                                      </a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm" style={{ color: '#5a5f6b' }}>
                                {file.user?.email || 'Unknown User'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="text-sm font-mono px-2 py-1 rounded"
                                style={{ color: '#000000', background: '#f5f6fa' }}
                              >
                                {file.passcode || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium" style={{ color: '#5a5f6b' }}>
                                {file.recordCount || '0'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => togglePaidStatus(file._id, file.paid)}
                                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                                style={
                                  file.paid
                                    ? { background: '#e3f3e9', color: '#1e7a44' }
                                    : { background: '#fdf3df', color: '#9a6b0c' }
                                }
                              >
                                {file.paid ? 'Paid' : 'Unpaid'}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm" style={{ color: '#5a5f6b' }}>
                                {formatDate(file.createdAt)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                             {file?.paid==false? <button
                                  onClick={()=>sendPasscode(file)}
                                  className="p-2 rounded-lg transition-colors"
                                  style={{ color: '#12229d' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e6ebff'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Send passcode"
                                >
                                  <CreditCard className="w-5 h-5" />
                                </button>:''}
                                <button
                                  onClick={() => handleDownload(file.output, file.file)}
                                  disabled={!file.output}
                                  className="p-2 rounded-lg transition-colors"
                                  style={file.output ? { color: '#233dff', cursor: 'pointer' } : { color: '#9ca3af', cursor: 'not-allowed' }}
                                  onMouseEnter={(e) => { if (file.output) e.currentTarget.style.background = '#e6ebff'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title={file.output ? 'Download' : 'No output available'}
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(file._id)}
                                  className="p-2 rounded-lg transition-colors"
                                  style={{ color: '#d64545' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fdeeee'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: '#9ca3af' }}>
                  <File className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                  <p className="text-lg font-medium" style={{ color: '#5a5f6b' }}>No files found</p>
                  <p className="text-sm mt-1">
                    {searchTerm || selectedUser !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Upload files to get started'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </>
  );
}