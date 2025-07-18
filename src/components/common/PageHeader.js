import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, onBack, children }) => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center">
            {onBack && (
                <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-muted transition-colors">
                    <ArrowLeft className="w-6 h-6 text-text-secondary" />
                </button>
            )}
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        </div>
        <div className="flex items-center gap-2">{children}</div>
    </div>
);

export default PageHeader;
