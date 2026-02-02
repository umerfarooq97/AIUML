import { useState } from 'react';
import { User, Mail, Calendar, Crown, Shield, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const AccountPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'subscription', label: 'Subscription', icon: Crown },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                        Account Settings
                    </h1>
                    <p className="text-dark-600 dark:text-dark-400">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-dark-200 dark:border-dark-700 mb-8">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${activeTab === tab.id
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-dark-200'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="card">
                                <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                                <div className="space-y-6">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="input-field bg-dark-100 dark:bg-dark-800 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-dark-500 mt-1">
                                            Email cannot be changed
                                        </p>
                                    </div>

                                    {/* Account Created */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <Calendar className="w-4 h-4 inline mr-2" />
                                            Member Since
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            disabled
                                            className="input-field bg-dark-100 dark:bg-dark-800 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'subscription' && (
                        <div className="space-y-6">
                            <div className="card">
                                <h2 className="text-xl font-bold mb-6">Subscription Plan</h2>

                                {/* Current Plan */}
                                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-lg border-2 border-primary-200 dark:border-primary-800 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <Crown className="w-8 h-8 text-primary-600" />
                                            <div>
                                                <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-100 capitalize">
                                                    {user?.subscription_plan || 'Free'} Plan
                                                </h3>
                                                <p className="text-sm text-primary-700 dark:text-primary-300">
                                                    {user?.subscription_plan === 'PRO' ? 'Unlimited diagrams' : '5 diagrams per day'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upgrade Options */}
                                {user?.subscription_plan !== 'PRO' && (
                                    <div>
                                        <h3 className="font-bold mb-4">Upgrade to Pro</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="border-2 border-dark-200 dark:border-dark-700 rounded-lg p-6 hover:border-primary-500 transition-colors">
                                                <h4 className="font-bold text-lg mb-2">Monthly</h4>
                                                <p className="text-3xl font-bold text-primary-600 mb-4">
                                                    $9<span className="text-sm text-dark-500">/month</span>
                                                </p>
                                                <ul className="space-y-2 text-sm mb-6">
                                                    <li>✓ Unlimited diagrams</li>
                                                    <li>✓ Priority support</li>
                                                    <li>✓ Advanced features</li>
                                                </ul>
                                                <button className="btn-primary w-full">
                                                    Upgrade Now
                                                </button>
                                            </div>

                                            <div className="border-2 border-primary-500 rounded-lg p-6 relative">
                                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    BEST VALUE
                                                </div>
                                                <h4 className="font-bold text-lg mb-2">Yearly</h4>
                                                <p className="text-3xl font-bold text-primary-600 mb-4">
                                                    $90<span className="text-sm text-dark-500">/year</span>
                                                </p>
                                                <ul className="space-y-2 text-sm mb-6">
                                                    <li>✓ Everything in Monthly</li>
                                                    <li>✓ Save $18/year</li>
                                                    <li>✓ Early access to features</li>
                                                </ul>
                                                <button className="btn-primary w-full">
                                                    Upgrade Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="card">
                                <h2 className="text-xl font-bold mb-6">Security Settings</h2>

                                <div className="space-y-6">
                                    {/* Change Password */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <Key className="w-4 h-4 inline mr-2" />
                                            Change Password
                                        </label>
                                        <button className="btn-secondary">
                                            Update Password
                                        </button>
                                        <p className="text-xs text-dark-500 mt-1">
                                            We'll send you a password reset link
                                        </p>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="pt-6 border-t border-dark-200 dark:border-dark-700">
                                        <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                                        <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AccountPage;
