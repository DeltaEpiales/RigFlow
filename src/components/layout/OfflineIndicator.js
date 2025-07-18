import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOfflineSync } from '../../contexts/OfflineSyncContext';

const OfflineIndicator = () => {
    const { isOffline, setIsOffline, actionQueue } = useOfflineSync();

    // This button is for simulation/testing purposes only.
    const toggleOfflineMode = () => {
        setIsOffline(prev => !prev);
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 no-print">
            <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white font-semibold text-sm ${isOffline ? 'bg-warning' : 'bg-success'}`}>
                    {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
                    <span>{isOffline ? `Offline Mode` : 'Online'}</span>
                    {isOffline && actionQueue.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-500 rounded-full text-xs">{actionQueue.length}</span>
                    )}
                </div>
                <button 
                    onClick={toggleOfflineMode} 
                    title="Toggle Offline Mode (For Demo)"
                    className="p-2 rounded-full bg-surface text-text-primary shadow-lg hover:bg-muted"
                >
                    <span className="text-xs">DEMO</span>
                </button>
            </div>
        </div>
    );
};

export default OfflineIndicator;