import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-dark-50 dark:bg-dark-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar with Mobile State */}
            <div className={`
                fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700 p-4 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-md hover:bg-dark-100 dark:hover:bg-dark-700"
                    >
                        <Menu className="w-6 h-6 text-dark-600 dark:text-dark-300" />
                    </button>
                    <span className="font-bold text-lg text-dark-900 dark:text-white">AI UML</span>
                    <div className="w-6"></div> {/* Spacer for center alignment */}
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-0">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
