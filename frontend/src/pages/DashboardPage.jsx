import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, TrendingUp, Calendar, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { diagramAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
    const { user } = useAuth();
    const [diagrams, setDiagrams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDiagrams();
    }, []);

    const loadDiagrams = async () => {
        try {
            const data = await diagramAPI.list(1, 20);
            setDiagrams(data.diagrams);
            setError('');
        } catch (err) {
            console.error('Failed to load diagrams:', err);
            if (err.response?.status !== 401) {
                setError('Failed to load diagrams. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            label: 'Total Diagrams',
            value: diagrams.length,
            icon: FileText,
            color: 'primary',
        },
        {
            label: 'This Month',
            value: diagrams.filter(d => {
                const created = new Date(d.created_at);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length,
            icon: Calendar,
            color: 'green',
        },
        {
            label: 'Most Used Type',
            value: getMostUsedType(),
            icon: TrendingUp,
            color: 'blue',
        },
    ];

    function getMostUsedType() {
        if (diagrams.length === 0) return 'None';
        const types = diagrams.reduce((acc, d) => {
            acc[d.diagram_type] = (acc[d.diagram_type] || 0) + 1;
            return acc;
        }, {});
        const mostUsed = Object.entries(types).sort((a, b) => b[1] - a[1])[0];
        return mostUsed ? mostUsed[0].charAt(0).toUpperCase() + mostUsed[0].slice(1) : 'None';
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                        Welcome back! 👋
                    </h1>
                    <p className="text-dark-600 dark:text-dark-400">
                        Here's what's happening with your diagrams today
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClasses = {
                            primary: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600',
                            green: 'bg-green-100 dark:bg-green-900/20 text-green-600',
                            blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
                        };

                        return (
                            <div key={index} className="card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-dark-600 dark:text-dark-400 mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-dark-900 dark:text-dark-50">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-lg ${colorClasses[stat.color]}`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Link to="/generator" className="card hover:shadow-lg transition-shadow group">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg group-hover:scale-110 transition-transform">
                                <PlusCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Create New Diagram</h3>
                                <p className="text-sm text-dark-600 dark:text-dark-400">
                                    Generate UML diagrams with AI
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/diagrams" className="card hover:shadow-lg transition-shadow group">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">View All Diagrams</h3>
                                <p className="text-sm text-dark-600 dark:text-dark-400">
                                    Browse and manage your diagrams
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Diagrams */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recent Diagrams</h2>
                        <Link to="/diagrams" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            {error}
                        </div>
                    ) : diagrams.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-dark-300 dark:text-dark-600" />
                            <p className="text-dark-600 dark:text-dark-400 mb-4">
                                No diagrams yet
                            </p>
                            <Link to="/generator" className="btn-primary inline-block">
                                Create Your First Diagram
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {diagrams.slice(0, 5).map((diagram) => (
                                <Link
                                    key={diagram.id}
                                    to={`/generator?diagram=${diagram.id}`}
                                    className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-800 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium mb-1 truncate group-hover:text-primary-600 transition-colors">
                                            {diagram.title}
                                        </h3>
                                        <p className="text-sm text-dark-600 dark:text-dark-400 truncate">
                                            {diagram.prompt}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4 ml-4">
                                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded text-xs font-medium capitalize">
                                            {diagram.diagram_type}
                                        </span>
                                        <span className="text-xs text-dark-500">
                                            {new Date(diagram.created_at).toLocaleDateString()}
                                        </span>
                                        <Eye className="w-5 h-5 text-dark-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
