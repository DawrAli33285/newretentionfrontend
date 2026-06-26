import React, { useEffect, useState } from 'react';
import {
  Search, Filter, Loader2, AlertCircle, Trash2,
  FileText, RefreshCw, ChevronDown, ChevronUp, Mail
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../baseurl';

const STATUS_CONFIG = {
  Received:         { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
  Processing:       { bg: '#fefce8', text: '#92400e', border: '#fde68a', dot: '#eab308' },
  Complete:         { bg: '#e3f3e9', text: '#1e7a44', border: '#bbf7d0', dot: '#22c55e' },
  'Ready for Review': { bg: '#f5f3ff', text: '#6b21a8', border: '#ddd6fe', dot: '#a855f7' },
};

const STATUS_STEPS = ['Received', 'Processing', 'Complete', 'Ready for Review'];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Received'];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
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
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: i < idx ? dotColors[STATUS_STEPS[i + 1]] : '#e5e7eb' }}
            />
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
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/prehire-files`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const counts = STATUS_STEPS.reduce((acc, s) => {
    acc[s] = files.filter(f => f.status === s).length;
    return acc;
  }, {});

  const inputFocusStyle = (e) => {
    e.target.style.borderColor = '#233dff';
    e.target.style.boxShadow = '0 0 0 2px rgba(35,61,255,0.2)';
  };
  const inputBlurStyle = (e) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

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

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl mb-2"
              style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
            >
              PRE-HIRE FILE MANAGEMENT
            </h1>
            <p style={{ color: '#5a5f6b' }}>Review, update status, and manage all pre-hire submissions</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {STATUS_STEPS.map(status => {
              const cfg = STATUS_CONFIG[status];
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(isActive ? 'all' : status)}
                  className="text-left p-4 rounded-xl transition-all"
                  style={{
                    background: isActive ? cfg.bg : '#ffffff',
                    border: isActive ? `2px solid ${cfg.border}` : '1px solid #e5e7eb',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = '#d1d5db'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = '#e5e7eb'; }}
                >
                  <p
                    className="text-2xl"
                    style={{ fontFamily: "'Anton', sans-serif", color: '#000000' }}
                  >
                    {counts[status]}
                  </p>
                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: isActive ? cfg.text : '#5a5f6b' }}
                  >
                    {status}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
              style={{ background: '#fdeeee', border: '1px solid #f3c9c9', color: '#a13333' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-lg leading-none" style={{ color: '#a13333' }}>×</button>
            </div>
          )}

          {/* Filters */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4" style={{ color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Search by file name, job ID, or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none"
                  style={{ border: '1px solid #d1d5db', boxShadow: 'none' }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4" style={{ color: '#9ca3af' }} />
                <select
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none appearance-none"
                  style={{ border: '1px solid #d1d5db', background: '#ffffff', boxShadow: 'none' }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                >
                  <option value="all">All users</option>
                  {users?.map(u => (
                    <option key={u._id} value={u._id}>{u.email}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4" style={{ color: '#9ca3af' }} />
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none appearance-none"
                  style={{ border: '1px solid #d1d5db', background: '#ffffff', boxShadow: 'none' }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
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
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#233dff' }} />
                <span className="ml-3 text-sm" style={{ color: '#5a5f6b' }}>Loading files...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                <p className="text-lg font-medium" style={{ color: '#5a5f6b' }}>No pre-hire files found</p>
                <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                  {searchTerm || selectedUser !== 'all' || selectedStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No submissions yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" style={{ tableLayout: 'fixed' }}>
                  <thead style={{ background: '#f5f6fa', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[22%]" style={{ color: '#000000' }}>File</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[18%]" style={{ color: '#000000' }}>User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[10%]" style={{ color: '#000000' }}>Records</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[16%]" style={{ color: '#000000' }}>Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[14%]" style={{ color: '#000000' }}>Submitted</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[20%]" style={{ color: '#000000' }}>Update status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold w-[12%]" style={{ color: '#000000' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map(file => {
                      const isExpanded = expandedRow === file.jobId;
                      return (
                        <React.Fragment key={file.jobId}>
                          <tr
                            className="transition-colors"
                            style={{ borderBottom: '1px solid #e5e7eb' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            {/* File name */}
                            <td className="px-4 py-3">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#5a5f6b' }} />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: '#000000' }}>
                                    {file.originalFileName || '—'}
                                  </p>
                                  <p
                                    className="text-xs font-mono truncate px-1.5 py-0.5 rounded mt-0.5 inline-block"
                                    style={{ color: '#5a5f6b', background: '#f5f6fa' }}
                                  >
                                    {file.jobId}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* User */}
                            <td className="px-4 py-3">
                              <span className="text-sm truncate" style={{ color: '#5a5f6b' }}>
                                {file.user?.email || 'Unknown'}
                              </span>
                            </td>

                            {/* Records */}
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium" style={{ color: '#5a5f6b' }}>
                                {file.recordCount || '—'}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <StatusBadge status={file.status} />
                            </td>

                            {/* Date */}
                            <td className="px-4 py-3">
                              <span className="text-xs" style={{ color: '#5a5f6b' }}>{formatDate(file.createdAt)}</span>
                            </td>

                            {/* Status dropdown */}
                            <td className="px-4 py-3">
                              {updatingStatus === file.jobId ? (
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                                  <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                                </div>
                              ) : (
                                <select
                                  value={file.status}
                                  onChange={e => handleStatusChange(file.jobId, e.target.value)}
                                  className="text-xs rounded-lg px-2 py-1.5 w-full focus:outline-none appearance-none"
                                  style={{ border: '1px solid #d1d5db', background: '#ffffff' }}
                                  onFocus={inputFocusStyle}
                                  onBlur={inputBlurStyle}
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
                                {/* Notify */}
                                <button
                                  onClick={() => handleSendNotification(file)}
                                  disabled={sendingNotif === file.jobId}
                                  className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                                  style={{ color: '#233dff' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e6ebff'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Send notification to user"
                                >
                                  {sendingNotif === file.jobId
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Mail className="w-4 h-4" />
                                  }
                                </button>
                                {/* Expand */}
                                <button
                                  onClick={() => setExpandedRow(isExpanded ? null : file.jobId)}
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ color: '#5a5f6b' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
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
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ color: '#d64545' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fdeeee'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded row */}
                          {isExpanded && (
                            <tr style={{ background: '#f5f6fa' }}>
                              <td colSpan={7} className="px-6 py-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
                                {/* Progress */}
                                <div className="mb-3">
                                  <p className="text-xs font-semibold mb-2" style={{ color: '#5a5f6b' }}>
                                    Processing progress
                                  </p>
                                  <StatusProgress currentStatus={file.status} />
                                  <div className="flex justify-between mt-1">
                                    {STATUS_STEPS.map((s, i) => (
                                      <span
                                        key={s}
                                        className="text-xs"
                                        style={{
                                          color: '#9ca3af',
                                          flex: 1,
                                          textAlign: i === 0 ? 'left' : i === STATUS_STEPS.length - 1 ? 'right' : 'center'
                                        }}
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Status history */}
                                {file.statusHistory && file.statusHistory.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold mb-2 mt-4" style={{ color: '#5a5f6b' }}>
                                      Status history
                                    </p>
                                    <div className="space-y-1.5">
                                      {file.statusHistory.map((entry, i) => (
                                        <div key={i} className="flex items-start gap-3 text-xs">
                                          <span style={{ color: '#9ca3af' }} className="whitespace-nowrap">
                                            {formatDate(entry.changedAt)}
                                          </span>
                                          <StatusBadge status={entry.status} />
                                          {entry.note && (
                                            <span style={{ color: '#5a5f6b' }}>{entry.note}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Meta details */}
                                <div
                                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4"
                                  style={{ borderTop: '1px solid #e5e7eb' }}
                                >
                                  <div>
                                    <p className="text-xs" style={{ color: '#9ca3af' }}>Job ID</p>
                                    <p
                                      className="text-xs font-mono mt-0.5 px-1.5 py-0.5 rounded inline-block"
                                      style={{ color: '#000000', background: '#ffffff', border: '1px solid #e5e7eb' }}
                                    >
                                      {file.jobId}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs" style={{ color: '#9ca3af' }}>Submitted</p>
                                    <p className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{formatDate(file.createdAt)}</p>
                                  </div>
                                  {file.processedAt && (
                                    <div>
                                      <p className="text-xs" style={{ color: '#9ca3af' }}>Processing started</p>
                                      <p className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{formatDate(file.processedAt)}</p>
                                    </div>
                                  )}
                                  {file.completedAt && (
                                    <div>
                                      <p className="text-xs" style={{ color: '#9ca3af' }}>Completed</p>
                                      <p className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{formatDate(file.completedAt)}</p>
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

            {/* Footer */}
            {!loading && filteredFiles.length > 0 && (
              <div
                className="px-6 py-3 flex items-center justify-between"
                style={{ borderTop: '1px solid #e5e7eb' }}
              >
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  Showing {filteredFiles.length} of {files.length} submissions
                </p>
                <button
                  onClick={fetchFiles}
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: '#233dff' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#12229d'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#233dff'; }}
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}