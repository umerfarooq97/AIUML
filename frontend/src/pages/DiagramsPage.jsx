import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Trash2, Eye, Download, Calendar } from 'lucide-react';
import { diagramAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'default' });

const DiagramsPage = () => {
    const [diagrams, setDiagrams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        loadDiagrams();
    }, []);

    const loadDiagrams = async () => {
        try {
            const data = await diagramAPI.list(1, 100);
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

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this diagram?')) return;

        try {
            await diagramAPI.delete(id);
            setDiagrams(diagrams.filter(d => d.id !== id));
        } catch (err) {
            alert('Failed to delete diagram');
        }
    };

    const filteredDiagrams = diagrams.filter(diagram => {
        const matchesSearch = diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagram.prompt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || diagram.diagram_type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                        My Diagrams
                    </h1>
                    <p className="text-dark-600 dark:text-dark-400">
                        {diagrams.length} diagram{diagrams.length !== 1 ? 's' : ''} created
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                            <input
                                type="text"
                                placeholder="Search diagrams..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        {/* Filter and View Mode */}
                        <div className="flex items-center space-x-4">
                            {/* Type Filter */}
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-dark-500" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="input-field py-2"
                                >
                                    <option value="all">All Types</option>
                                    <option value="class">Class</option>
                                    <option value="sequence">Sequence</option>
                                    <option value="usecase">Use Case</option>
                                    <option value="activity">Activity</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex border border-dark-200 dark:border-dark-700 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : 'text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : 'text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Diagrams */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : error ? (
                    <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-center py-12">
                        {error}
                    </div>
                ) : filteredDiagrams.length === 0 ? (
                    <div className="card text-center py-20">
                        <p className="text-dark-500 dark:text-dark-400 mb-4">
                            {searchTerm || filterType !== 'all' ? 'No diagrams match your filters' : 'No diagrams yet'}
                        </p>
                        {!searchTerm && filterType === 'all' && (
                            <a href="/generator" className="btn-primary inline-block">
                                Create Your First Diagram
                            </a>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {filteredDiagrams.map((diagram) => (
                            <DiagramCard
                                key={diagram.id}
                                diagram={diagram}
                                viewMode={viewMode}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

const DiagramCard = ({ diagram, viewMode, onDelete }) => {
    if (viewMode === 'list') {
        return (
            <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 truncate">{diagram.title}</h3>
                        <p className="text-sm text-dark-600 dark:text-dark-400 mb-2 truncate">
                            {diagram.prompt}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-dark-500">
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded capitalize">
                                {diagram.diagram_type}
                            </span>
                            <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(diagram.created_at).toLocaleDateString()}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                        <a
                            href={`/generator?diagram=${diagram.id}`}
                            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="View"
                        >
                            <Eye className="w-5 h-5" />
                        </a>
                        <button
                            onClick={() => onDelete(diagram.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 truncate">{diagram.title}</h3>
                <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-2 mb-3">
                    {diagram.prompt}
                </p>
                <div className="flex items-center justify-between text-xs text-dark-500">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded capitalize">
                        {diagram.diagram_type}
                    </span>
                    <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(diagram.created_at).toLocaleDateString()}</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <a
                    href={`/generator?diagram=${diagram.id}`}
                    className="flex-1 btn-secondary text-center flex items-center justify-center space-x-2"
                >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                </a>
                <button
                    onClick={() => onDelete(diagram.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default DiagramsPage;
