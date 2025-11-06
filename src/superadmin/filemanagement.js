import React, { useState } from 'react';
import { Upload, Download, File, Search, Trash2, Filter, FileText, Image, Video, Music } from 'lucide-react';

export default function FileManagement({ users, files, onUploadFile, onDownloadFile, onDeleteFile }) {
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingFor, setUploadingFor] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);

  const filteredFiles = (files || []).filter(file => {
    const matchesUser = selectedUser === 'all' || file.userId === selectedUser;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesSearch;
  });

  const getFileIcon = (type) => {
    if (type.includes('image')) return <Image className="w-5 h-5 text-blue-600" />;
    if (type.includes('video')) return <Video className="w-5 h-5 text-purple-600" />;
    if (type.includes('audio')) return <Music className="w-5 h-5 text-green-600" />;
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && uploadingFor) {
      onUploadFile(uploadingFor, {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString().split('T')[0]
      });
      setUploadingFor(null);
      setFileToUpload(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">File Management</h1>
        <p className="text-gray-600">Upload and manage files for all users</p>
      </div>

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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">All Users</option>
              {users?.map(user => (
                <option key={user.id} value={user.id}>{user.email}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upload File</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={uploadingFor || ''}
            onChange={(e) => setUploadingFor(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select User</option>
            {users?.map(user => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </select>
          <label className={`flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-colors ${
            uploadingFor 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}>
            <Upload className="w-5 h-5" />
            <span>Choose File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={!uploadingFor}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">File Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Size</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Upload Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles?.map((file) => {
                const user = users.find(u => u.id === file.userId);
                return (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{user?.email || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatFileSize(file.size)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{file.uploadDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onDownloadFile(file.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.id)}
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
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No files found</p>
          <p className="text-sm">Upload files to get started</p>
        </div>
      )}
    </div>
  );
}