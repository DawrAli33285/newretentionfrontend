import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, User, Clock, CheckCircle, AlertCircle, Loader, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from './baseurl';

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    Received: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: <Clock className="w-3 h-3" />,
    },
    Processing: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <Loader className="w-3 h-3 animate-spin" />,
    },
    Complete: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <CheckCircle className="w-3 h-3" />,
    },
    'Ready for Review': {
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: <CheckCircle className="w-3 h-3" />,
    },
  };

  const { color, icon } = config[status] || {
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {icon}
      {status}
    </span>
  );
}

// ─── Status History Drawer ─────────────────────────────────────────────────────
function StatusHistory({ history }) {
  const [open, setOpen] = useState(false);

  if (!history || history.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {open ? 'Hide' : 'Show'} history ({history.length})
      </button>

      {open && (
        <ol className="mt-2 border-l-2 border-gray-200 pl-4 space-y-2">
          {history.map((h, i) => (
            <li key={i} className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">{h.status}</span>
              {h.note && <span className="text-gray-500"> — {h.note}</span>}
              <div className="text-gray-400">
                {new Date(h.changedAt).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
function PreHireFilesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/prehire-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     

      const jobsArray = response.data.jobs || [];

      // Fetch full status (with statusHistory) for each job
      const detailed = await Promise.all(
        jobsArray.map(async (job) => {
          try {
            const res = await axios.get(`${BASE_URL}/prehire-status/${job.jobId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
          } catch {
            return job; // fallback to list data if status fetch fails
          }
        })
      );

      setJobs(detailed);
    } catch (e) {
      console.error('Error fetching pre-hire jobs:', e);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pre-hire files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Logo */}
        <div className="flex justify-center items-center text-center mb-8">
          <img
            src="/logo.jpg"
            alt="Company Logo"
            className="h-20 sm:h-24 lg:h-32 w-auto object-contain"
          />
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Pre-Hire Files</h1>
            <p className="text-gray-600">Track the status of your submitted pre-hire candidate files</p>
          </div>
          <button
            onClick={() => fetchJobs(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Empty state */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No pre-hire files yet</h3>
            <p className="text-gray-500">Upload your first pre-hire candidate file to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Icon + Info */}
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* File name + status */}
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {job.fileName || job.originalFileName}
                        </h3>
                        <StatusBadge status={job.status} />
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {job.jobId}
                          </span>
                        </div>

                        {(job.recordCount ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{job.recordCount} record{job.recordCount !== 1 ? 's' : ''}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Submitted {formatDate(job.createdAt)}</span>
                        </div>

                        {job.processedAt && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Processed {formatDateTime(job.processedAt)}</span>
                          </div>
                        )}

                        {job.completedAt && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            <span>Completed {formatDateTime(job.completedAt)}</span>
                          </div>
                        )}
                      </div>

                      {/* Status history */}
                      <StatusHistory history={job.statusHistory} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PreHireFilesPage;