import React from 'react';
import { Users, FileText, Download, Upload, TrendingUp, Activity, DollarSign, Clock, ArrowUp, ArrowDown, Database, Zap } from 'lucide-react';

export default function Dashboard({ users, files }) {
  // Calculate analytics
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(u => u?.status === 'active')?.length || 0;
  const totalFiles = files?.length || 0;
  const totalStorage = files?.reduce((sum, f) => sum + (f.size || 0), 0) || 0;
  const storageInMB = (totalStorage / (1024 * 1024)).toFixed(2);

  // Mock data for charts
  const recentActivity = [
    { user: 'john@example.com', action: 'Uploaded file', time: '2 hours ago', type: 'upload' },
    { user: 'sarah@example.com', action: 'Downloaded file', time: '3 hours ago', type: 'download' },
    { user: 'mike@example.com', action: 'Registered', time: '5 hours ago', type: 'user' },
    { user: 'emma@example.com', action: 'Updated profile', time: '1 day ago', type: 'user' },
  ];

  const monthlyStats = [
    { month: 'Jan', users: 45, files: 120 },
    { month: 'Feb', users: 52, files: 145 },
    { month: 'Mar', users: 61, files: 168 },
    { month: 'Apr', users: 73, files: 195 },
    { month: 'May', users: 89, files: 230 },
    { month: 'Jun', users: totalUsers, files: totalFiles },
  ];

  const StatCard = ({ icon: Icon, title, value, change, trend, gradient, iconBg }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-xl shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {change}
          </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-5">Welcome back! Here's your system overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users}
            title="Total Users"
            value={totalUsers}
            change="+12%"
            trend="up"
            gradient="bg-gradient-to-br from-blue-400 to-blue-600"
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          />
          <StatCard 
            icon={Activity}
            title="Active Users"
            value={activeUsers}
            change="+8%"
            trend="up"
            gradient="bg-gradient-to-br from-green-400 to-green-600"
            iconBg="bg-gradient-to-br from-green-500 to-green-600 text-white"
          />
          <StatCard 
            icon={FileText}
            title="Total Files"
            value={totalFiles}
            change="+23%"
            trend="up"
            gradient="bg-gradient-to-br from-purple-400 to-purple-600"
            iconBg="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
          />
          <StatCard 
            icon={Database}
            title="Storage Used"
            value={`${storageInMB}MB`}
            change={`${((storageInMB / 1000) * 100).toFixed(0)}%`}
            trend="up"
            gradient="bg-gradient-to-br from-orange-400 to-orange-600"
            iconBg="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Growth Chart */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Monthly Growth</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Files</span>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              {monthlyStats.map((stat, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700 w-12">{stat.month}</span>
                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out group-hover:from-blue-600 group-hover:to-blue-700" 
                            style={{ width: `${Math.min((stat.users / (totalUsers || 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="absolute -top-6 right-0 text-xs font-medium text-gray-600">{stat.users}</span>
                      </div>
                      <div className="relative">
                        <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out group-hover:from-purple-600 group-hover:to-purple-700" 
                            style={{ width: `${Math.min((stat.files / (totalFiles || 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="absolute -top-6 right-0 text-xs font-medium text-gray-600">{stat.files}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`p-2.5 rounded-xl ${
                    activity.type === 'upload' ? 'bg-blue-100' :
                    activity.type === 'download' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'upload' ? <Upload className="w-4 h-4 text-blue-600" /> :
                     activity.type === 'download' ? <Download className="w-4 h-4 text-green-600" /> :
                     <Users className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="group relative overflow-hidden flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 border border-blue-200">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-300 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="bg-blue-500 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Add New User</span>
            </button>
            
            <button className="group relative overflow-hidden flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 border border-green-200">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-300 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="bg-green-500 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Upload Files</span>
            </button>
            
            <button className="group relative overflow-hidden flex items-center gap-4 p-5 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 border border-purple-200">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-300 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="bg-purple-500 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}