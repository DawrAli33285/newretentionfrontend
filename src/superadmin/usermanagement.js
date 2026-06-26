import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Mail, Calendar, CheckCircle, XCircle, Loader2, AlertCircle, RefreshCw, Users } from 'lucide-react';
import { BASE_URL } from '../baseurl';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', credits: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [invoiceData, setInvoiceData] = useState({ price: '', description: '' });

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/getUsers`);
      const data = await response.json();
      setUsers(data.users || data || []);
    } catch (e) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users || []).filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ email: user.email, password: '', credits: user.credits || 0 });
  };

  const handleSave = async () => {
    try {
      const updateData = { email: formData.email, credits: parseFloat(formData.credits) || 0 };
      if (formData.password) updateData.password = formData.password;
      await fetch(`${BASE_URL}/updateUser/${editingUser}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      setUsers(users.map(u => u._id === editingUser ? { ...u, email: formData.email, credits: formData.credits } : u));
      setEditingUser(null);
      setFormData({ email: '', password: '', credits: 0 });
    } catch (e) {
      setError('Failed to update user. Please try again.');
    }
  };

  const handleSendInvoice = (userId) => {
    setSelectedUserId(userId);
    setShowInvoiceModal(true);
  };

  const submitInvoice = async () => {
    try {
      if (!invoiceData.price || !invoiceData.description) {
        setError('Please fill in all invoice fields.');
        return;
      }
      await fetch(`${BASE_URL}/sendInvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          price: parseFloat(invoiceData.price),
          description: invoiceData.description,
        }),
      });
      setShowInvoiceModal(false);
      setInvoiceData({ price: '', description: '' });
    } catch (e) {
      setError('Failed to send invoice. Please try again.');
    }
  };

  const handleAdd = async () => {
    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields.');
        return;
      }
      const response = await fetch(`${BASE_URL}/addUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setUsers([...users, data.user || data]);
      setShowAddModal(false);
      setFormData({ email: '', password: '', credits: 0 });
    } catch (e) {
      setError('Failed to add user. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) return;
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`${BASE_URL}/deleteUser/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u._id !== userId));
    } catch (e) {
      setError('Failed to delete user. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

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
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1
                className="text-3xl mb-2"
                style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
              >
                USER MANAGEMENT
              </h1>
              <p style={{ color: '#5a5f6b' }}>Manage all users and their access permissions</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#233dff', color: '#ffffff', border: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#12229d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#233dff'; }}
            >
              + Add User
            </button>
          </div>

          {/* Summary card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Users', value: users.length },
              { label: 'Shown', value: filteredUsers.length },
              { label: 'Total Credits', value: users.reduce((s, u) => s + (u.credits || 0), 0) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-xl"
                style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <p className="text-2xl" style={{ fontFamily: "'Anton', sans-serif", color: '#000000' }}>{value}</p>
                <p className="text-xs font-medium mt-1" style={{ color: '#5a5f6b' }}>{label}</p>
              </div>
            ))}
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

          {/* Search */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4" style={{ color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none"
                style={{ border: '1px solid #d1d5db' }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
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
                <span className="ml-3 text-sm" style={{ color: '#5a5f6b' }}>Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                <p className="text-lg font-medium" style={{ color: '#5a5f6b' }}>No users found</p>
                <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                  {searchTerm ? 'Try adjusting your search' : 'No users yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" style={{ tableLayout: 'fixed' }}>
                  <thead style={{ background: '#f5f6fa', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[28%]" style={{ color: '#000000' }}>User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[24%]" style={{ color: '#000000' }}>Password</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[14%]" style={{ color: '#000000' }}>Credits</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-[16%]" style={{ color: '#000000' }}>Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold w-[18%]" style={{ color: '#000000' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid #e5e7eb' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                              style={{ background: '#233dff' }}
                            >
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              {editingUser === user._id ? (
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  className="text-sm px-2 py-1 rounded-lg w-full focus:outline-none"
                                  style={{ border: '1px solid #d1d5db' }}
                                  onFocus={inputFocusStyle}
                                  onBlur={inputBlurStyle}
                                />
                              ) : (
                                <>
                                  <p className="text-sm font-medium truncate" style={{ color: '#000000' }}>
                                    {user.email.split('@')[0]}
                                  </p>
                                  <p className="text-xs truncate" style={{ color: '#5a5f6b' }}>{user.email}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Password */}
                        <td className="px-4 py-3">
                          {editingUser === user._id ? (
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder="Leave blank to keep"
                              className="text-sm px-2 py-1 rounded-lg w-full focus:outline-none"
                              style={{ border: '1px solid #d1d5db' }}
                              onFocus={inputFocusStyle}
                              onBlur={inputBlurStyle}
                            />
                          ) : (
                            <span className="text-sm" style={{ color: '#9ca3af' }}>••••••••</span>
                          )}
                        </td>

                        {/* Credits */}
                        <td className="px-4 py-3">
                          {editingUser === user._id ? (
                            <input
                              type="number"
                              step="1"
                              value={formData.credits}
                              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                              className="text-sm px-2 py-1 rounded-lg w-20 focus:outline-none"
                              style={{ border: '1px solid #d1d5db' }}
                              onFocus={inputFocusStyle}
                              onBlur={inputBlurStyle}
                            />
                          ) : (
                            <span
                              className="text-xs font-medium px-2 py-1 rounded-full"
                              style={{ background: '#e6ebff', color: '#233dff' }}
                            >
                              {user.credits || 0}
                            </span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3">
                          <span className="text-xs" style={{ color: '#5a5f6b' }}>{formatDate(user.createdAt)}</span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {editingUser === user._id ? (
                              <>
                                <button
                                  onClick={handleSave}
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ color: '#22c55e' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e3f3e9'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Save"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setEditingUser(null); setFormData({ email: '', password: '', credits: 0 }); }}
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ color: '#5a5f6b' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleSendInvoice(user._id)}
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ color: '#233dff' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e6ebff'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Send invoice"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ color: '#5a5f6b' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user._id)}
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ color: '#d64545' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fdeeee'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {!loading && filteredUsers.length > 0 && (
              <div
                className="px-6 py-3 flex items-center justify-between"
                style={{ borderTop: '1px solid #e5e7eb' }}
              >
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  Showing {filteredUsers.length} of {users.length} users
                </p>
                <button
                  onClick={getUsers}
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-2xl p-8 max-w-md w-full mx-4" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
            <h2
              className="text-2xl mb-6"
              style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
            >
              ADD NEW USER
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Email', key: 'email', type: 'email', placeholder: 'user@example.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: 'Enter password' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a5f6b' }}>{label}</label>
                  <input
                    type={type}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                    style={{ border: '1px solid #d1d5db' }}
                    onFocus={inputFocusStyle}
                    onBlur={inputBlurStyle}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#233dff', color: '#ffffff' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#12229d'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#233dff'; }}
              >
                Add User
              </button>
              <button
                onClick={() => { setShowAddModal(false); setFormData({ email: '', password: '', credits: 0 }); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#f5f6fa', color: '#5a5f6b', border: '1px solid #e5e7eb' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-2xl p-8 max-w-md w-full mx-4" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
            <h2
              className="text-2xl mb-6"
              style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
            >
              SEND INVOICE
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a5f6b' }}>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={invoiceData.price}
                  onChange={(e) => setInvoiceData({ ...invoiceData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                  style={{ border: '1px solid #d1d5db' }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#5a5f6b' }}>Description</label>
                <textarea
                  value={invoiceData.description}
                  onChange={(e) => setInvoiceData({ ...invoiceData, description: e.target.value })}
                  placeholder="Invoice description"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none"
                  style={{ border: '1px solid #d1d5db' }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitInvoice}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#233dff', color: '#ffffff' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#12229d'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#233dff'; }}
              >
                Send Invoice
              </button>
              <button
                onClick={() => { setShowInvoiceModal(false); setInvoiceData({ price: '', description: '' }); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#f5f6fa', color: '#5a5f6b', border: '1px solid #e5e7eb' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}