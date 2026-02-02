import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Download, Code, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-50 to-white dark:from-dark-900 dark:to-dark-800">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-primary-600" />
                        <span className="text-2xl font-bold gradient-text">AI UML Generator</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="btn-secondary">
                                    Dashboard
                                </Link>
                                <Link to="/generator" className="btn-primary">
                                    Create Diagram
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-6xl font-bold mb-6 leading-tight">
                        Generate <span className="gradient-text">UML Diagrams</span>
                        <br />
                        Using AI Magic
                    </h1>
                    <p className="text-xl text-dark-600 dark:text-dark-300 mb-8 max-w-2xl mx-auto">
                        Transform your ideas into professional UML diagrams instantly. Just describe your system in plain English, and let AI do the rest.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link to="/register" className="btn-primary text-lg px-8 py-4">
                            Start Creating Free
                        </Link>
                        <a href="#demo" className="btn-outline text-lg px-8 py-4">
                            See Demo
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                        <div>
                            <div className="text-4xl font-bold text-primary-600">10K+</div>
                            <div className="text-dark-600 dark:text-dark-400">Diagrams Created</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600">100%</div>
                            <div className="text-dark-600 dark:text-dark-400">Free to Start</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600">4</div>
                            <div className="text-dark-600 dark:text-dark-400">Diagram Types</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Why Choose <span className="gradient-text">AI UML Generator</span>?
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card-hover text-center">
                        <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
                        <p className="text-dark-600 dark:text-dark-400">
                            Generate complex UML diagrams in seconds. No manual drawing required.
                        </p>
                    </div>

                    <div className="card-hover text-center">
                        <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                            <Code className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Multiple Diagram Types</h3>
                        <p className="text-dark-600 dark:text-dark-400">
                            Class, Sequence, Use Case, and Activity diagrams - all supported.
                        </p>
                    </div>

                    <div className="card-hover text-center">
                        <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">100% Free AI</h3>
                        <p className="text-dark-600 dark:text-dark-400">
                            Powered by free AI models. No hidden costs or API fees.
                        </p>
                    </div>

                    <div className="card-hover text-center">
                        <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                            <Download className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Export Anywhere</h3>
                        <p className="text-dark-600 dark:text-dark-400">
                            Download as PNG, SVG, or copy Mermaid code for documentation.
                        </p>
                    </div>

                    <div className="card-hover text-center">
                        <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Save & Share</h3>
                        <p className="text-dark-600 dark:text-dark-400">
                            Save your diagrams and share them with your team instantly.
                        </p>
                    </div>

                    <div className="card-hover text-center">
                        <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Smart AI</h3>
                        <p className="text-dark-600 dark:text-dark-400">
                            AI automatically chooses the best diagram type for your description.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="container mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Simple <span className="gradient-text">Pricing</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="card border-2 border-dark-200 dark:border-dark-700">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Free</h3>
                            <div className="text-5xl font-bold mb-4">$0</div>
                            <p className="text-dark-600 dark:text-dark-400 mb-6">Perfect for students & learners</p>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                5 diagrams per day
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                All diagram types
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Save diagrams
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Export with watermark
                            </li>
                        </ul>
                        <Link to="/register" className="btn-outline w-full block text-center">
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="card gradient-bg text-white border-2 border-primary-600 relative">
                        <div className="absolute -top-4 right-4 bg-yellow-400 text-dark-900 px-4 py-1 rounded-full text-sm font-bold">
                            POPULAR
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <div className="text-5xl font-bold mb-4">$5</div>
                            <p className="text-primary-100 mb-6">For professionals & teams</p>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center">
                                <span className="text-yellow-300 mr-2">✓</span>
                                Unlimited diagrams
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-300 mr-2">✓</span>
                                All diagram types
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-300 mr-2">✓</span>
                                Unlimited saves
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-300 mr-2">✓</span>
                                No watermark exports
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-300 mr-2">✓</span>
                                PDF export
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-300 mr-2">✓</span>
                                Priority support
                            </li>
                        </ul>
                        <button className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-6 rounded-lg w-full transition-all duration-200">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="gradient-bg rounded-2xl p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to Create Amazing UML Diagrams?</h2>
                    <p className="text-xl mb-8 text-primary-100">Join thousands of developers and students using AI UML Generator</p>
                    <Link to="/register" className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-8 rounded-lg text-lg inline-block transition-all duration-200">
                        Start Free Today
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-dark-200 dark:border-dark-700 py-8">
                <div className="container mx-auto px-6 text-center text-dark-600 dark:text-dark-400">
                    <p>&copy; 2026 AI UML Generator. Built with ❤️ for developers.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
