import { Link, useLocation } from 'react-router-dom';
import {
    Sparkles,
    LayoutDashboard,
    FileText,
    PlusCircle,
    User,
    Settings,
    LogOut,
    Crown,
    Shield,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ...(user?.is_admin ? [{ path: '/admin', icon: Shield, label: 'Admin Panel' }] : []),
        { path: '/diagrams', icon: FileText, label: 'My Diagrams' },
        { path: '/generator', icon: PlusCircle, label: 'Create New' },
        { path: '/account', icon: User, label: 'Account' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <div className="w-64 bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700 h-full flex flex-col">
            {/* Logo and Close Button */}
            <div className="p-6 border-b border-dark-200 dark:border-dark-700 flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center space-x-2" onClick={handleLinkClick}>
                    <Sparkles className="w-8 h-8 text-primary-600" />
                    <div>
                        <h1 className="text-xl font-bold gradient-text">AI UML</h1>
                        <p className="text-xs text-dark-500">Generator</p>
                    </div>
                </Link>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1 rounded-md hover:bg-dark-100 dark:hover:bg-dark-700"
                >
                    <X className="w-5 h-5 text-dark-500" />
                </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-dark-200 dark:border-dark-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shrink-0">
                        {user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-dark-900 dark:text-dark-100">{user?.email}</p>
                        <div className="flex items-center space-x-1">
                            {user?.subscription_plan === 'PRO' && (
                                <Crown className="w-3 h-3 text-yellow-500" />
                            )}
                            <span className="text-xs text-dark-500 capitalize">
                                {user?.subscription_plan || 'Free'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                                : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-dark-200 dark:border-dark-700">
                <button
                    onClick={() => {
                        logout();
                        handleLinkClick();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
