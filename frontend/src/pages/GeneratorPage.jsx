import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Send, Copy, Download, Save, Image } from 'lucide-react';
import mermaid from 'mermaid';
import { useAuth } from '../context/AuthContext';
import { diagramAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

// Initialize Mermaid
mermaid.initialize({ startOnLoad: false, theme: 'default' });

const GeneratorPage = () => {
    const [searchParams] = useSearchParams();
    const diagramId = searchParams.get('diagram');

    const [prompt, setPrompt] = useState('');
    const [diagramType, setDiagramType] = useState('');
    const [mermaidCode, setMermaidCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [title, setTitle] = useState('');

    const { user } = useAuth();

    // Fetch diagram if ID provided
    useEffect(() => {
        const fetchDiagram = async () => {
            if (!diagramId) return;

            setLoading(true);
            try {
                const data = await diagramAPI.get(diagramId);
                setPrompt(data.prompt);
                setMermaidCode(data.mermaid_code);
                setDiagramType(data.diagram_type);
                setTitle(data.title);
            } catch (err) {
                console.error(err);
                setError('Failed to load diagram: ' + (err.response?.data?.detail || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchDiagram();
    }, [diagramId]);

    // Render Mermaid diagram when code changes
    useEffect(() => {
        if (mermaidCode) {
            renderDiagram();
        }
    }, [mermaidCode]);

    const renderDiagram = async () => {
        try {
            console.log('Rendering Mermaid diagram...');
            const element = document.getElementById('mermaid-diagram');
            if (element) {
                console.log('Mermaid element found, code:', mermaidCode);
                element.innerHTML = mermaidCode;
                await mermaid.run({ nodes: [element] });
                console.log('Mermaid rendering complete!');
            } else {
                console.error('Mermaid element not found!');
            }
        } catch (err) {
            console.error('Mermaid rendering error:', err);
            setError('Failed to render diagram. Please check the generated code.');
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            console.log('Generating diagram with prompt:', prompt);
            const result = await diagramAPI.generate(
                prompt,
                diagramType || null
            );

            console.log('API Response:', result);

            if (result.success) {
                console.log('Mermaid code received:', result.mermaid_code);
                setMermaidCode(result.mermaid_code);
                setSuccess('Diagram generated successfully!');
            } else {
                console.error('Generation failed:', result);
                setError(result.error || 'Failed to generate diagram');
            }
        } catch (err) {
            console.error('Generation error:', err);
            setError(err.response?.data?.detail || 'Failed to generate diagram');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(mermaidCode);
        setSuccess('Mermaid code copied to clipboard!');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleSave = async () => {
        if (!mermaidCode) {
            setError('No diagram to save');
            return;
        }

        const diagramTitle = title || `Diagram - ${prompt.substring(0, 50)}`;

        try {
            await diagramAPI.save(prompt, diagramTitle, mermaidCode, diagramType || 'class');
            setSuccess('Diagram saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save diagram');
        }
    };

    const getMermaidSvg = () => {
        const container = document.getElementById('mermaid-diagram');
        return container?.querySelector('svg');
    };

    const handleDownload = () => {
        const svg = getMermaidSvg();
        if (!svg) {
            setError('No diagram to download');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'diagram.svg';
        link.click();

        URL.revokeObjectURL(url);
        setSuccess('Diagram downloaded!');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleDownloadPng = () => {
        const svg = getMermaidSvg();
        if (!svg) {
            setError('No diagram to download');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = svg.viewBox.baseVal.width || svg.width.baseVal.value || 800;
            canvas.height = svg.viewBox.baseVal.height || svg.height.baseVal.value || 600;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `diagram-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
            setSuccess('Diagram downloaded as PNG!');
            setTimeout(() => setSuccess(''), 3000);
        };
        img.src = url;
    };

    return (
        <DashboardLayout>
            <div className="p-4 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                        Create New Diagram
                    </h1>
                    <p className="text-dark-600 dark:text-dark-400">
                        Describe your system and let AI generate UML diagrams
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-2xl font-bold mb-4">Describe Your System</h2>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-4">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Diagram Type (Optional)
                                    </label>
                                    <select
                                        value={diagramType}
                                        onChange={(e) => setDiagramType(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="">Auto-detect</option>
                                        <option value="class">Class Diagram</option>
                                        <option value="sequence">Sequence Diagram</option>
                                        <option value="usecase">Use Case Diagram</option>
                                        <option value="activity">Activity Diagram</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="input-field min-h-[200px]"
                                        placeholder="Example: Create a class diagram for an e-commerce system with User, Product, Order, and Payment classes. User can place multiple orders. Each order contains multiple products..."
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Generate Diagram</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mermaid Code */}
                        {mermaidCode && (
                            <div className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">Mermaid Code</h3>
                                    <button onClick={handleCopy} className="btn-secondary flex items-center space-x-2">
                                        <Copy className="w-4 h-4" />
                                        <span>Copy</span>
                                    </button>
                                </div>
                                <pre className="bg-dark-100 dark:bg-dark-900 p-4 rounded-lg overflow-x-auto text-sm">
                                    <code>{mermaidCode}</code>
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-2xl font-bold mb-4">Diagram Preview</h2>

                            {mermaidCode ? (
                                <>
                                    <div className="bg-white dark:bg-dark-900 p-6 rounded-lg border border-dark-200 dark:border-dark-700 overflow-x-auto">
                                        <div id="mermaid-diagram" className="flex justify-center"></div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Diagram Title (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="input-field"
                                                placeholder="My Awesome Diagram"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center space-x-2 py-2">
                                                <Save className="w-5 h-5" />
                                                <span>Save</span>
                                            </button>
                                            <button onClick={handleDownload} className="btn-secondary flex-1 flex items-center justify-center space-x-2 py-2">
                                                <Download className="w-5 h-5" />
                                                <span>SVG</span>
                                            </button>
                                            <button onClick={handleDownloadPng} className="btn-secondary flex-1 flex items-center justify-center space-x-2 py-2">
                                                <Image className="w-5 h-5" />
                                                <span>PNG</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 text-dark-500 dark:text-dark-400">
                                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Your diagram will appear here</p>
                                </div>
                            )}
                        </div>

                        {/* Examples */}
                        <div className="card">
                            <h3 className="text-lg font-bold mb-3">Example Prompts</h3>
                            <div className="space-y-2 text-sm">
                                <button
                                    onClick={() => setPrompt('Create a class diagram for a library management system with Book, Member, Librarian, and Transaction classes')}
                                    className="w-full text-left p-3 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                                >
                                    📚 Library Management System
                                </button>
                                <button
                                    onClick={() => setPrompt('Create a sequence diagram showing user login process with User, LoginForm, AuthService, and Database')}
                                    className="w-full text-left p-3 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                                >
                                    🔐 User Login Flow
                                </button>
                                <button
                                    onClick={() => setPrompt('Create an activity diagram for online shopping checkout process')}
                                    className="w-full text-left p-3 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                                >
                                    🛒 Shopping Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GeneratorPage;
