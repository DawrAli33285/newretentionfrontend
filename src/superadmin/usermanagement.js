import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Mail, Calendar, CheckCircle, XCircle, Plus } from 'lucide-react';
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
      console.log('API Response:', data);
      setUsers(data.users || data || []);
    } catch (e) {
      console.error('Error fetching users:', e);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users || []).filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    console.log('Editing user:', user);
    setEditingUser(user._id);
    setFormData({ email: user.email, password: '', credits: user.credits || 0 });
  };

  const handleSave = async () => {
    try {
      console.log('Saving user:', editingUser);
      console.log(formData);
      
      // Only send password if it's been changed (not empty)
      const updateData = { email: formData.email, credits: parseFloat(formData.credits) || 0 };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const response = await fetch(`${BASE_URL}/updateUser/${editingUser}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      setUsers(users.map(u => u._id === editingUser ? { ...u, email: formData.email, credits: formData.credits } : u));
      setEditingUser(null);
      setFormData({ email: '', password: '', credits: 0 });
      alert('User updated successfully');
    } catch (e) {
      console.error('Error updating user:', e);
      alert('Failed to update user. Please try again.');
    }
  };


  const handleSendInvoice = (userId) => {
    setSelectedUserId(userId);
    setShowInvoiceModal(true);
  };
  
  const submitInvoice = async () => {
    try {
      if (!invoiceData.price || !invoiceData.description) {
        alert('Please fill in all fields');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/sendInvoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          price: parseFloat(invoiceData.price),
          description: invoiceData.description
        }),
      });
      
      const data = await response.json();
      setShowInvoiceModal(false);
      setInvoiceData({ price: '', description: '' });
      alert('Invoice sent successfully');
    } catch (e) {
      console.error('Error sending invoice:', e);
      alert('Failed to send invoice. Please try again.');
    }
  };

  
  const handleAdd = async () => {
    try {
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      const newUser = data.user || data;
      setUsers([...users, newUser]);
      setShowAddModal(false);
      setFormData({ email: '', password: '' });
      alert('User added successfully');
    } catch (e) {
      console.error('Error adding user:', e);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    console.log('Deleting user ID:', userId);
    if (!userId) {
      alert('Error: User ID is undefined');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`${BASE_URL}/deleteUser/${userId}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (e) {
      console.error('Error deleting user:', e);
      alert('Failed to delete user. Please try again.');
    }
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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users and their access permissions</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={getUsers}
            className="mt-2 text-red-700 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Search and Add */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
             
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Password</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Credits</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{user.email.split('@')[0]}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingUser === user._id ? (
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingUser === user._id ? (
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              placeholder="Leave blank to keep current"
                              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-sm text-gray-600">••••••••</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
  {editingUser === user._id ? (
    <input
      type="number"
      step="1"
      value={formData.credits}
      onChange={(e) => setFormData({...formData, credits: e.target.value})}
      className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
    />
  ) : (
    <span className="text-sm text-gray-600">{user.credits || 0}</span>
  )}
</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {editingUser === user._id ? (
                              <>
                                <button
                                  onClick={handleSave}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Save"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingUser(null);
                                    setFormData({ email: '', password: '' });
                                  }}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <>
   
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAdd}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ email: '', password: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Invoice Modal */}
{showInvoiceModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Invoice</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={invoiceData.price}
            onChange={(e) => setInvoiceData({...invoiceData, price: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={invoiceData.description}
            onChange={(e) => setInvoiceData({...invoiceData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Invoice description"
            rows="3"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={submitInvoice}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send Invoice
        </button>
        <button
          onClick={() => {
            setShowInvoiceModal(false);
            setInvoiceData({ price: '', description: '' });
          }}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}