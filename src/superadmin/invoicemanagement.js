import React, { useState, useEffect } from 'react';
import { Search, Mail, Calendar, DollarSign, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../baseurl';

export default function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);

  useEffect(() => {
    getAllInvoices();
  }, []);

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/getAllInvoices`);
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (e) {
      console.error('Error fetching invoices:', e);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = (invoices || []).filter(invoice =>
    invoice.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <div className="mb-8">
            <h1
              className="text-3xl mb-2"
              style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
            >
              INVOICE MANAGEMENT
            </h1>
            <p style={{ color: '#5a5f6b' }}>View and manage all user invoices</p>
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

          {/* Loading State */}
          {loading && (
            <div
              className="rounded-xl shadow-sm p-12 flex items-center justify-center"
              style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#233dff' }} />
              <span className="ml-3" style={{ color: '#5a5f6b' }}>Loading invoices...</span>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Search Bar */}
              <div
                className="rounded-xl shadow-sm p-6 mb-6"
                style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Search by email or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                    style={{ border: '1px solid #d1d5db', boxShadow: 'none' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#233dff';
                      e.target.style.boxShadow = '0 0 0 2px rgba(35,61,255,0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Invoices Table */}
              <div
                className="rounded-xl shadow-sm overflow-hidden"
                style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ background: '#f5f6fa', borderBottom: '1px solid #e5e7eb' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Invoice ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#000000' }}>Created</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: '#000000' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center" style={{ color: '#9ca3af' }}>
                            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                            <p className="text-lg font-medium" style={{ color: '#5a5f6b' }}>No invoices found</p>
                            <p className="text-sm mt-1">
                              {searchTerm ? 'Try adjusting your search' : 'No invoices available'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <tr
                            key={invoice._id}
                            className="transition-colors"
                            style={{ borderBottom: '1px solid #e5e7eb' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" style={{ color: '#5a5f6b' }} />
                                <span
                                  className="text-sm font-mono px-2 py-1 rounded"
                                  style={{ color: '#000000', background: '#f5f6fa' }}
                                >
                                  #{invoice._id.slice(-8).toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm" style={{ color: '#5a5f6b' }}>
                                {invoice.user?.email || 'Unknown User'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" style={{ color: '#1e7a44' }} />
                                <span className="text-sm font-semibold" style={{ color: '#000000' }}>
                                  {invoice.price?.toFixed(2) || '0.00'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={
                                  invoice.status === 'Paid'
                                    ? { background: '#e3f3e9', color: '#1e7a44' }
                                    : { background: '#fdf3df', color: '#9a6b0c' }
                                }
                              >
                                {invoice.status || 'Unpaid'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" style={{ color: '#9ca3af' }} />
                                <span className="text-sm" style={{ color: '#5a5f6b' }}>
                                  {formatDate(invoice.createdAt)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={() => handleViewInvoice(invoice)}
                                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                  style={{ background: '#233dff', color: '#ffffff' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#12229d'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = '#233dff'; }}
                                >
                                  View Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceDetail && selectedInvoice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div
            className="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ background: '#ffffff', fontFamily: "'Poppins', sans-serif" }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 sticky top-0"
              style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#233dff' }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#ffffff' }} />
                </div>
                <div>
                  <h2
                    className="text-xl"
                    style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
                  >
                    INVOICE DETAILS
                  </h2>
                  <p className="text-sm" style={{ color: '#5a5f6b' }}>
                    #{selectedInvoice._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowInvoiceDetail(false); setSelectedInvoice(null); }}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#5a5f6b' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className="px-6 py-2 rounded-full text-sm font-semibold"
                  style={
                    selectedInvoice.status === 'Paid'
                      ? { background: '#e3f3e9', color: '#1e7a44' }
                      : { background: '#fdf3df', color: '#9a6b0c' }
                  }
                >
                  {selectedInvoice.status || 'Unpaid'}
                </span>
              </div>

              {/* User Information */}
              <div className="rounded-lg p-4" style={{ background: '#f5f6fa', border: '1px solid #e5e7eb' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#000000' }}>Customer Information</h3>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: '#5a5f6b' }} />
                  <span className="text-sm" style={{ color: '#5a5f6b' }}>
                    {selectedInvoice.user?.email || 'Unknown User'}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div
                className="rounded-lg p-6 text-center"
                style={{ background: '#f5f6fa', border: '1px solid #e5e7eb' }}
              >
                <p className="text-sm mb-1" style={{ color: '#5a5f6b' }}>Total Amount</p>
                <p
                  className="text-4xl"
                  style={{ fontFamily: "'Anton', sans-serif", color: '#233dff', letterSpacing: '1px' }}
                >
                  ${selectedInvoice.price?.toFixed(2) || '0.00'}
                </p>
              </div>

              {/* Description */}
              {selectedInvoice.description && (
                <div className="rounded-lg p-4" style={{ background: '#f5f6fa', border: '1px solid #e5e7eb' }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>Description</h3>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: '#5a5f6b' }}>
                    {selectedInvoice.description}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{ background: '#f5f6fa', border: '1px solid #e5e7eb' }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>Created Date</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: '#9ca3af' }} />
                    <span className="text-sm" style={{ color: '#5a5f6b' }}>
                      {formatDate(selectedInvoice.createdAt)}
                    </span>
                  </div>
                </div>
                {selectedInvoice.paidDate && (
                  <div className="rounded-lg p-4" style={{ background: '#f5f6fa', border: '1px solid #e5e7eb' }}>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>Paid Date</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: '#9ca3af' }} />
                      <span className="text-sm" style={{ color: '#5a5f6b' }}>
                        {formatDate(selectedInvoice.paidDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex p-6" style={{ borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => { setShowInvoiceDetail(false); setSelectedInvoice(null); }}
                className="flex-1 py-3 rounded-lg font-medium transition-colors"
                style={{ background: '#f5f6fa', color: '#000000', border: '1px solid #e5e7eb' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}