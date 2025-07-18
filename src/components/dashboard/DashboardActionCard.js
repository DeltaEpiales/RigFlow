import React from 'react';

const DashboardActionCard = ({ title, icon: Icon, onClick, description }) => (
    <button onClick={onClick} className="bg-surface p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left border border-border group">
        <Icon className="w-10 h-10 text-primary mb-3 transition-colors group-hover:text-primary/80" />
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
    </button>
);

export default DashboardActionCard;
