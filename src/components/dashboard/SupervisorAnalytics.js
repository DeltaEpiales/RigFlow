import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import StatCard from './StatCard';
import { TrendingUp, Percent, Clock, Shield } from 'lucide-react';

const SupervisorAnalytics = () => {
    const { jsas, assets } = useContext(AppContext);

    const safetyCompliance = useMemo(() => {
        const activeJsas = jsas.filter(j => j.status === 'Active' || j.status === 'Pending');
        if (activeJsas.length === 0) return 100;
        
        const completedJsas = activeJsas.filter(j => {
            const required = new Set(j.requiredSignatures);
            const signed = new Set(j.signatures);
            return [...required].every(id => signed.has(id));
        });
        
        return Math.round((completedJsas.length / activeJsas.length) * 100);
    }, [jsas]);
    
    const downAssets = useMemo(() => {
        return assets.filter(a => a.status === 'Down for Repair');
    }, [assets]);
    
    // These are simplified calculations for demonstration purposes.
    const wrenchTime = 72;
    const ftfr = 89;

    return (
        <div className="pt-6 border-t border-border">
            <h2 className="text-2xl font-bold text-text-primary">Team Performance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                <StatCard 
                    title="Crew Utilization" 
                    value={`${wrenchTime}%`} 
                    icon={Clock} 
                    variant="primary"
                    description="Productive time vs. travel/idle"
                />
                <StatCard 
                    title="First-Time Fix Rate" 
                    value={`${ftfr}%`} 
                    icon={Percent} 
                    variant="success"
                    description="Issues resolved on the first visit"
                />
                <StatCard 
                    title="Safety Compliance" 
                    value={`${safetyCompliance}%`} 
                    icon={Shield} 
                    variant={safetyCompliance > 95 ? 'success' : 'warning'}
                    description="Required JSAs fully signed"
                />
                <StatCard 
                    title="Asset Downtime" 
                    value={downAssets.length} 
                    icon={TrendingUp} 
                    variant={downAssets.length > 0 ? 'danger' : 'success'}
                    description="Assets currently down for repair"
                />
            </div>
        </div>
    );
};

export default SupervisorAnalytics;
