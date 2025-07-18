import React, { createContext, useState, useEffect, useContext } from 'react';

export const OfflineSyncContext = createContext();

export const useOfflineSync = () => useContext(OfflineSyncContext);

export const OfflineSyncProvider = ({ children }) => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [actionQueue, setActionQueue] = useState(() => {
        try {
            const savedQueue = localStorage.getItem('rigflow_actionQueue');
            return savedQueue ? JSON.parse(savedQueue) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('rigflow_actionQueue', JSON.stringify(actionQueue));
    }, [actionQueue]);


    const queueAction = (action) => {
        setActionQueue(prevQueue => [...prevQueue, action]);
    };

    useEffect(() => {
        if (!isOffline && actionQueue.length > 0) {
            alert(`You are back online. ${actionQueue.length} queued actions would now be synced to the server. This is a simulation; in a real app, API calls would be made and the UI would update upon success.`);
            setActionQueue([]);
        }
    }, [isOffline, actionQueue]);


    const value = {
        isOffline,
        setIsOffline,
        actionQueue,
        queueAction,
    };

    return (
        <OfflineSyncContext.Provider value={value}>
            {children}
        </OfflineSyncContext.Provider>
    );
};