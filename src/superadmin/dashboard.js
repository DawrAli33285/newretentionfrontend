import React, { useState, useEffect } from 'react';
import { Users, FileText, Download, Upload, TrendingUp, Activity, DollarSign, Clock, ArrowUp, ArrowDown, Database, Zap } from 'lucide-react';
import { BASE_URL } from '../baseurl';
import {Link, useNavigate} from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: { count: 0, growth: 0 },
    activeUsers: { count: 0, growth: 0 },
    totalFiles: { count: 0, growth: 0 },
    storageUsed: { size: '0.00', growth: 0 }
  });
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate=useNavigate()

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/dashboard/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setMonthlyGrowth(data.monthlyGrowth);
        setRecentActivity(data.recentActivity);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const getActivityIcon = (action) => {
    if (action.includes('Upload')) return { icon: Upload, bg: '#e6ebff', color: '#233dff' };
    if (action.includes('Download')) return { icon: Download, bg: '#e1e3f0', color: '#12229d' };
    return { icon: Users, bg: '#ececec', color: '#000000' };
  };

  const StatCard = ({ icon: Icon, title, value, iconBg, iconColor }) => (
    <div
      className="group relative rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
    >
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl" style={{ background: iconBg }}>
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
        </div>
        <h3 className="text-sm font-medium mb-1" style={{ color: '#5a5f6b' }}>{title}</h3>
        <p className="text-3xl font-semibold" style={{ color: '#000000' }}>{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <div
          className="min-h-screen p-8 flex items-center justify-center"
          style={{ background: '#f5f6fa', fontFamily: "'Poppins', sans-serif" }}
        >
          <div className="rounded-2xl shadow-xl p-12 text-center" style={{ background: '#ffffff' }}>
            <div
              className="inline-block animate-spin rounded-full h-16 w-16 border-b-4"
              style={{ borderColor: '#233dff' }}
            ></div>
            <p className="mt-6 text-lg font-medium" style={{ color: '#5a5f6b' }}>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <div
          className="min-h-screen p-8 flex items-center justify-center"
          style={{ background: '#f5f6fa', fontFamily: "'Poppins', sans-serif" }}
        >
          <div className="rounded-2xl p-8 max-w-md" style={{ background: '#fdeeee', border: '2px solid #f3c9c9' }}>
            <p className="text-lg mb-4" style={{ color: '#a13333' }}>{error}</p>
            <button
              onClick={fetchDashboardData}
              className="w-full py-3 rounded-xl font-medium transition-colors"
              style={{ background: '#d64545', color: '#ffffff' }}
              onMouseEnter={(e) => { e.target.style.background = '#a13333'; }}
              onMouseLeave={(e) => { e.target.style.background = '#d64545'; }}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const maxUsers = Math.max(...monthlyGrowth.map(m => m.users), 1);
  const maxFiles = Math.max(...monthlyGrowth.map(m => m.files), 1);

  return (
    <>
      {/* Brand fonts: Anton (display) + Poppins (body) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen p-8"
        style={{ background: '#f5f6fa', fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8 rounded-full" style={{ background: '#233dff' }}></div>
              <h1
                className="text-4xl"
                style={{ fontFamily: "'Anton', sans-serif", color: '#000000', letterSpacing: '0.5px' }}
              >
                DASHBOARD
              </h1>
            </div>
            <p className="text-lg ml-5" style={{ color: '#5a5f6b' }}>Welcome back! Here's your system overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats.totalUsers.count}
              iconBg="#e6ebff"
              iconColor="#233dff"
            />
            <StatCard
              icon={Activity}
              title="Active Users"
              value={stats.activeUsers.count}
              iconBg="#e1e3f0"
              iconColor="#12229d"
            />
            <StatCard
              icon={FileText}
              title="Total Files"
              value={stats.totalFiles.count}
              iconBg="#ececec"
              iconColor="#000000"
            />
            <StatCard
              icon={Database}
              title="Storage Used"
              value={`${stats.storageUsed.size}MB`}
              iconBg="#e6ebff"
              iconColor="#12229d"
            />
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Growth Chart */}
            <div
              className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8"
              style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold" style={{ color: '#000000' }}>Monthly growth</h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#233dff' }}></div>
                    <span style={{ color: '#5a5f6b' }}>Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#12229d' }}></div>
                    <span style={{ color: '#5a5f6b' }}>Files</span>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                {monthlyGrowth.length === 0 ? (
                  <p className="text-center py-8" style={{ color: '#9ca3af' }}>No data available</p>
                ) : (
                  monthlyGrowth.map((stat, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold w-12" style={{ color: '#000000' }}>{stat.month}</span>
                        <div className="flex-1 space-y-2">
                          <div className="relative">
                            <div className="rounded-full h-2.5 overflow-hidden" style={{ background: '#ececec' }}>
                              <div
                                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.min((stat.users / maxUsers) * 100, 100)}%`, background: '#233dff' }}
                              ></div>
                            </div>
                            <span className="absolute -top-6 right-0 text-xs font-medium" style={{ color: '#5a5f6b' }}>{stat.users}</span>
                          </div>
                          <div className="relative">
                            <div className="rounded-full h-2.5 overflow-hidden" style={{ background: '#ececec' }}>
                              <div
                                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.min((stat.files / maxFiles) * 100, 100)}%`, background: '#12229d' }}
                              ></div>
                            </div>
                            <span className="absolute -top-6 right-0 text-xs font-medium" style={{ color: '#5a5f6b' }}>{stat.files}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8"
              style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold" style={{ color: '#000000' }}>Recent activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-center py-8" style={{ color: '#9ca3af' }}>No recent activity</p>
                ) : (
                  recentActivity.map((activity, idx) => {
                    const { icon: Icon, bg, color } = getActivityIcon(activity.action);
                    return (
                      <div
                        key={idx}
                        className="group flex items-start gap-4 p-3 rounded-xl transition-colors"
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f6fa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div className="p-2.5 rounded-xl" style={{ background: bg }}>
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: '#000000' }}>{activity.email}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#5a5f6b' }}>{activity.action}</p>
                        </div>
                        <span className="text-xs whitespace-nowrap" style={{ color: '#9ca3af' }}>{getTimeAgo(activity.time)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}