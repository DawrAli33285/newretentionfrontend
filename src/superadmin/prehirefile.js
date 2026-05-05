import React, { useEffect, useState } from 'react';
import {
  Search, Filter, Loader2, AlertCircle, Trash2,
  FileText, RefreshCw, ChevronDown, ChevronUp, Mail
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../baseurl';

const STATUS_CONFIG = {
  Received: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  Processing: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  Complete: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  'Ready for Review': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
};

const STATUS_STEPS = ['Received', 'Processing', 'Complete', 'Ready for Review'];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Received'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

const StatusProgress = ({ currentStatus }) => {
  const idx = STATUS_STEPS.indexOf(currentStatus);
  const dotColors = {
    Received: '#3b82f6',
    Processing: '#eab308',
    Complete: '#22c55e',
    'Ready for Review': '#a855f7',
  };
  return (
    <div className="flex items-center gap-1 w-full">
      {STATUS_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= idx ? dotColors[step] : '#e5e7eb' }}
          />
          {i < STATUS_STEPS.length - 1 && (
            <div className="w-1 h-1 rounded-full" style={{ background: i < idx ? dotColors[STATUS_STEPS[i + 1]] : '#e5e7eb' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function PreHireFileManagement({ users }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [sendingNotif, setSendingNotif] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
        const token = localStorage.getItem('adminToken'); // or wherever you store it
        const response = await fetch(`${BASE_URL}/admin/prehire-files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      const data = await response.json();
      setFiles(data.files || []);
    } catch (e) {
      setError('Failed to load pre-hire files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    setUpdatingStatus(jobId);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${BASE_URL}/prehire-status/${jobId}`, {
        status: newStatus,
        note: `Status updated by admin to ${newStatus}`,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(prev =>
        prev.map(f => f.jobId === jobId ? { ...f, status: newStatus } : f)
      );
    } catch (e) {
      setError('Failed to update status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this pre-hire file record?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${BASE_URL}/admin/prehire-files/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(prev => prev.filter(f => f.jobId !== jobId));
    } catch (e) {
      setError('Failed to delete file.');
    }
  };

  const handleSendNotification = async (file) => {
    setSendingNotif(file.jobId);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${BASE_URL}/admin/prehire-notify`, {
        jobId: file.jobId,
        email: file.user?.email,
        status: file.status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Notification sent to ${file.user?.email}`);
    } catch (e) {
      setError('Failed to send notification.');
    } finally {
      setSendingNotif(null);
    }
  };

  const filteredFiles = files.filter(file => {
    const userId = file.user?._id || file.user;
    const matchesUser = selectedUser === 'all' || userId === selectedUser;
    const matchesStatus = selectedStatus === 'all' || file.status === selectedStatus;
    const matchesSearch =
      file.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.jobId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesStatus && matchesSearch;
  });

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // Summary counts
  const counts = STATUS_STEPS.reduce((acc, s) => {
    acc[s] = files.filter(f => f.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Pre-Hire File Management</h1>
          <p className="text-gray-500 text-sm">Review, update status, and manage all pre-hire submissions</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {STATUS_STEPS.map(status => {
            const cfg = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedStatus === status
                    ? `${cfg.bg} ${cfg.border} border-2`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-2xl font-bold text-gray-800">{counts[status]}</p>
                <p className={`text-xs font-medium mt-1 ${selectedStatus === status ? cfg.text : 'text-gray-500'}`}>
                  {status}
                </p>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-700 hover:text-red-900 text-lg leading-none">×</button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by file name, job ID, or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
              >
                <option value="all">All users</option>
                {users?.map(u => (
                  <option key={u._id} value={u._id}>{u.email}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
              >
                <option value="all">All statuses</option>
                {STATUS_STEPS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500 text-sm">Loading files...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm font-medium">No pre-hire files found</p>
              <p className="text-gray-400 text-xs mt-1">
                {searchTerm || selectedUser !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No submissions yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ tableLayout: 'fixed' }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[22%]">File</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[18%]">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[10%]">Records</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[16%]">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[14%]">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[20%]">Update status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 w-[12%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFiles.map(file => {
                    const isExpanded = expandedRow === file.jobId;
                    return (
                      <React.Fragment key={file.jobId}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          {/* File name */}
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{file.originalFileName || '—'}</p>
                                <p className="text-xs text-gray-400 font-mono truncate">{file.jobId}</p>
                              </div>
                            </div>
                          </td>

                          {/* User */}
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700 truncate">{file.user?.email || 'Unknown'}</p>
                          </td>

                          {/* Records */}
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-700">{file.recordCount || '—'}</span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <StatusBadge status={file.status} />
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500">{formatDate(file.createdAt)}</span>
                          </td>

                          {/* Status dropdown */}
                          <td className="px-4 py-3">
                            {updatingStatus === file.jobId ? (
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                              </div>
                            ) : (
                              <select
                                value={file.status}
                                onChange={e => handleStatusChange(file.jobId, e.target.value)}
                                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                              >
                                {STATUS_STEPS.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {/* Notify user */}
                              <button
                                onClick={() => handleSendNotification(file)}
                                disabled={sendingNotif === file.jobId}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Send notification to user"
                              >
                                {sendingNotif === file.jobId
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <Mail className="w-4 h-4" />
                                }
                              </button>
                              {/* Expand history */}
                              <button
                                onClick={() => setExpandedRow(isExpanded ? null : file.jobId)}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View status history"
                              >
                                {isExpanded
                                  ? <ChevronUp className="w-4 h-4" />
                                  : <ChevronDown className="w-4 h-4" />
                                }
                              </button>
                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(file.jobId)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded: progress + history */}
                        {isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={7} className="px-6 py-4 border-b border-gray-200">
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-500 mb-2">Processing progress</p>
                                <StatusProgress currentStatus={file.status} />
                                <div className="flex justify-between mt-1">
                                  {STATUS_STEPS.map(s => (
                                    <span key={s} className="text-xs text-gray-400" style={{ flex: 1, textAlign: STATUS_STEPS.indexOf(s) === 0 ? 'left' : STATUS_STEPS.indexOf(s) === STATUS_STEPS.length - 1 ? 'right' : 'center' }}>
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {file.statusHistory && file.statusHistory.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-2 mt-4">Status history</p>
                                  <div className="space-y-1.5">
                                    {file.statusHistory.map((entry, i) => (
                                      <div key={i} className="flex items-start gap-3 text-xs">
                                        <span className="text-gray-400 whitespace-nowrap">{formatDate(entry.changedAt)}</span>
                                        <StatusBadge status={entry.status} />
                                        {entry.note && <span className="text-gray-500">{entry.note}</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                                <div>
                                  <p className="text-xs text-gray-400">Job ID</p>
                                  <p className="text-xs font-mono text-gray-700 mt-0.5">{file.jobId}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Submitted</p>
                                  <p className="text-xs text-gray-700 mt-0.5">{formatDate(file.createdAt)}</p>
                                </div>
                                {file.processedAt && (
                                  <div>
                                    <p className="text-xs text-gray-400">Processing started</p>
                                    <p className="text-xs text-gray-700 mt-0.5">{formatDate(file.processedAt)}</p>
                                  </div>
                                )}
                                {file.completedAt && (
                                  <div>
                                    <p className="text-xs text-gray-400">Completed</p>
                                    <p className="text-xs text-gray-700 mt-0.5">{formatDate(file.completedAt)}</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && filteredFiles.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {filteredFiles.length} of {files.length} submissions
              </p>
              <button
                onClick={fetchFiles}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}