import React, { useEffect, useState } from 'react';
import { Upload, Download, File, Search, Trash2, Filter, FileText, Image, Video, Music, Loader2, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../baseurl';

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
    if (!fileName) return <FileText className="w-5 h-5 text-gray-600" />;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
      return <Image className="w-5 h-5 text-blue-600" />;
    }
    if (['mp4', 'avi', 'mov', 'webm', 'mkv'].includes(ext)) {
      return <Video className="w-5 h-5 text-purple-600" />;
    }
    if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) {
      return <Music className="w-5 h-5 text-green-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">File Management</h1>
          <p className="text-gray-600">Upload and manage files for all users</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading files...</span>
            </div>
          ) : (
            <>
              {filteredFiles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">File Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Passcode</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Upload Date</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFiles.map((file) => {
                        return (
                          <tr key={file._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {getFileIcon(file.file)}
                                <div>
                                  <p className="font-medium text-gray-800">{file.file}</p>
                                  {file.output && (
                                    <p className="text-xs text-blue-600 mt-1 hover:underline cursor-pointer">
                                      <a href={file.output} target="_blank" rel="noopener noreferrer">
                                        View Output
                                      </a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {file.user?.email || 'Unknown User'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {file.passcode || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => togglePaidStatus(file._id, file.paid)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  file.paid 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                              >
                                {file.paid ? 'Paid' : 'Unpaid'}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {formatDate(file.createdAt)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleDownload(file.output, file.file)}
                                  disabled={!file.output}
                                  className={`p-2 rounded-lg transition-colors ${
                                    file.output
                                      ? 'text-blue-600 hover:bg-blue-50'
                                      : 'text-gray-400 cursor-not-allowed'
                                  }`}
                                  title={file.output ? 'Download' : 'No output available'}
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(file._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <div className="text-center py-12 text-gray-500">
                  <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No files found</p>
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
  );
}