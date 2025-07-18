import React, { useMemo } from 'react';
import { formatTimeAgo, getInitials } from '../../../utils/helpers';
import { Clock, DollarSign, Shield, ClipboardList, AlertTriangle } from 'lucide-react';

const RecentActivityFeed = ({ timesheets, expenses, jsas, incidents, users, jobs }) => {
    const combinedFeed = useMemo(() => {
        const tsFeed = timesheets.map(t => ({ ...t, type: 'timesheet', timestamp: new Date(`${t.date}T12:00:00`) }));
        const exFeed = expenses.map(e => ({ ...e, type: 'expense', timestamp: new Date(`${e.date}T12:00:00`) }));
        const jsaFeed = jsas.map(j => ({ ...j, type: 'jsa', timestamp: new Date(`${j.date}T12:00:00`) }));
        const incFeed = incidents.map(i => ({...i, type: 'incident', timestamp: new Date(`${i.date}T12:00:00`) }));

        return [...tsFeed, ...exFeed, ...jsaFeed, ...incFeed]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);
    }, [timesheets, expenses, jsas, incidents]);

    const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unknown';
    const getJobName = (id) => jobs.find(j => j.id === id)?.name || 'Unknown';

    const renderItem = (item) => {
        const timeAgo = formatTimeAgo(item.timestamp);
        const user = users.find(u => u.id === (item.userId || item.createdBy || item.reportedBy));

        return (
             <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-text-secondary">
                    {getInitials(user?.name)}
                </div>
                <div className="flex-1 text-sm">
                    {item.type === 'timesheet' && <p><span className="font-semibold">{user?.name}</span> submitted a timesheet for <span className="font-semibold">{item.totalHours} hrs</span> on <span className="font-semibold">{getJobName(item.jobId)}</span>.</p>}
                    {item.type === 'expense' && <p><span className="font-semibold">{user?.name}</span> submitted an expense of <span className="font-semibold">${item.amount.toFixed(2)}</span>.</p>}
                    {item.type === 'jsa' && <p><span className="font-semibold">{user?.name}</span> created a JSA: <span className="font-semibold">{item.title}</span>.</p>}
                    {item.type === 'incident' && <p className="text-danger"><span className="font-semibold">{user?.name}</span> reported a <span className="font-semibold">{item.type}</span> incident.</p>}
                    <p className="text-xs text-text-secondary">{timeAgo}</p>
                </div>
            </div>
        )
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Recent Team Activity</h3>
            <div className="space-y-4">
                {combinedFeed.map(item => (
                    <div key={`${item.type}-${item.id}`} className="flex items-center">
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivityFeed;