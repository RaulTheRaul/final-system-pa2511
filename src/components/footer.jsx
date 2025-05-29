import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#254159] text-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo/Brand Section */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">Divergent</span>
                    </div>

                    {/* Support Section */}
                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-300 mb-1">Need help? We're here to support you.</p>
                        <div className="flex items-center justify-center md:justify-end gap-2">
                            <svg
                                className="w-4 h-4 text-[#f2be5c]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <a
                                href="mailto:admin@divergented.com.au"
                                className="text-[#f2be5c] hover:text-white transition-colors duration-200 font-medium"
                            >
                                admin@divergented.com.au
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 mt-6 pt-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
                        <p>&copy; 2025 Divergent. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;