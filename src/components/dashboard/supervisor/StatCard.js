import React from 'react';

const StatCard = ({ title, value, icon: Icon, variant = 'primary', onClick, description }) => {
    const colors = {
        primary: 'text-blue-500 bg-blue-500/10',
        success: 'text-green-500 bg-green-500/10',
        warning: 'text-yellow-500 bg-yellow-500/10',
        danger: 'text-red-500 bg-red-500/10',
    };
    return (
        <div onClick={onClick} className={`bg-surface p-6 rounded-lg shadow-md border border-border ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform' : ''}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
                    {description && <p className="text-xs text-text-secondary mt-1">{description}</p>}
                </div>
                <div className={`p-3 rounded-full ${colors[variant]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;