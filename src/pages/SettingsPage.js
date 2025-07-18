import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';

const SettingsPage = () => { 
    const { navigate } = useContext(AppContext); 
    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Settings" onBack={() => navigate('dashboard')} />
            <div className="bg-surface p-8 rounded-lg shadow-md border border-border">
                <p className="text-text-secondary">User settings functionality is under development.</p>
                <p className="text-sm text-text-secondary mt-2">A full implementation would include profile editing, notification preferences, and password management.</p>
            </div>
        </div>
    ); 
};
export default SettingsPage;
