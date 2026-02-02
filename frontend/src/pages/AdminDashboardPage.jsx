import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Users, FileText, Crown, Activity, Trash2, Search, Zap, Clock, PieChart } from 'lucide-react';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
        // Auto-refresh stats every 30 seconds for monitoring
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const [statsData, usersData] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers(0, 50)
            ]);
            setStats(statsData);
            setUsers(usersData);
        } catch (err) {
            console.error('Failed to load admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            loadData(); // Reload stats
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeColor = (type) => {
        const colors = {
            class: 'bg-blue-500',
            sequence: 'bg-purple-500',
            usecase: 'bg-green-500',
            activity: 'bg-yellow-500',
        };
        return colors[type] || 'bg-gray-500';
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-dark-50 flex items-center gap-3">
                        <Activity className="text-primary-600" />
                        System Monitoring
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-dark-500">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Updates
                    </div>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="card bg-white dark:bg-dark-800 border-l-4 border-blue-500 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-dark-500 text-sm font-medium uppercase">Total Users</p>
                                    <h3 className="text-3xl font-bold mt-1 text-dark-900 dark:text-white">{stats.total_users}</h3>
                                </div>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-white dark:bg-dark-800 border-l-4 border-purple-500 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-dark-500 text-sm font-medium uppercase">Total Diagrams</p>
                                    <h3 className="text-3xl font-bold mt-1 text-dark-900 dark:text-white">{stats.total_diagrams}</h3>
                                </div>
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-white dark:bg-dark-800 border-l-4 border-yellow-500 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-dark-500 text-sm font-medium uppercase">Pro Subscribers</p>
                                    <h3 className="text-3xl font-bold mt-1 text-dark-900 dark:text-white">{stats.pro_users}</h3>
                                </div>
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                    <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-white dark:bg-dark-800 border-l-4 border-green-500 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-dark-500 text-sm font-medium uppercase">API Status</p>
                                    <h3 className="text-xl font-bold mt-2 text-green-600 dark:text-green-400">Operational</h3>
                                </div>
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary-600" />
                                Recent Activity
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {stats?.recent_activity?.length > 0 ? (
                                stats.recent_activity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-800 rounded-lg border border-dark-100 dark:border-dark-700">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getTypeColor(activity.type)}`}>
                                                {activity.type.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-dark-900 dark:text-white">
                                                    {activity.title || 'Untitled Diagram'}
                                                </p>
                                                <p className="text-sm text-dark-500">
                                                    by {activity.user_email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-mono text-dark-400">
                                                {new Date(activity.created_at).toLocaleString()}
                                            </span>
                                            <div className="text-xs text-primary-600 mt-1 capitalize">
                                                {activity.type}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-dark-400 py-8">No recent activity</p>
                            )}
                        </div>
                    </div>

                    {/* Usage Distribution */}
                    <div className="card">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-primary-600" />
                            Distribution
                        </h2>

                        <div className="space-y-6">
                            {stats && Object.entries(stats.diagrams_by_type).map(([type, count]) => (
                                <div key={type}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="capitalize font-medium">{type}</span>
                                        <span className="text-dark-500">{count} ({Math.round(count / stats.total_diagrams * 100)}%)</span>
                                    </div>
                                    <div className="w-full bg-dark-100 dark:bg-dark-700 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${getTypeColor(type)}`}
                                            style={{ width: `${(count / stats.total_diagrams) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {(!stats || stats.total_diagrams === 0) && (
                                <p className="text-center text-dark-400 py-8">No data available</p>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-dark-100 dark:border-dark-700">
                            <h3 className="font-semibold mb-2">System Resources</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-dark-500">
                                        <span>CPU Usage</span>
                                        <span>12%</span>
                                    </div>
                                    <div className="w-full bg-dark-100 dark:bg-dark-700 rounded-full h-1.5">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '12%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-dark-500">
                                        <span>Memory</span>
                                        <span>45%</span>
                                    </div>
                                    <div className="w-full bg-dark-100 dark:bg-dark-700 rounded-full h-1.5">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-600" />
                            User Management
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10 py-2 w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-dark-200 dark:border-dark-700 text-dark-500 text-sm bg-dark-50 dark:bg-dark-800/50">
                                    <th className="py-3 pl-4 rounded-tl-lg">ID</th>
                                    <th className="py-3">User</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Joined</th>
                                    <th className="py-3 text-right pr-4 rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-dark-100 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="py-4 pl-4 font-mono text-xs text-dark-400">#{user.id}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-dark-900 dark:text-dark-100">{user.email}</p>
                                                    {user.is_admin && (
                                                        <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Admin</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.subscription_plan === 'pro'
                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                {user.subscription_plan.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-dark-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            {!user.is_admin && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboardPage;
