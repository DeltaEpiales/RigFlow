import React, { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, DollarSign, Shield } from 'lucide-react';

const RecentActivityFeed = ({ timesheets, expenses, jsas, users, jobs }) => {
    const combinedFeed = useMemo(() => {
        const tsFeed = timesheets.map(t => ({ ...t, type: 'timesheet', timestamp: new Date(`${t.date}T12:00:00`) }));
        const exFeed = expenses.map(e => ({ ...e, type: 'expense', timestamp: new Date(`${e.date}T12:00:00`) }));
        const jsaFeed = jsas.map(j => ({ ...j, type: 'jsa', timestamp: new Date(`${j.date}T12:00:00`) }));

        return [...tsFeed, ...exFeed, ...jsaFeed]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);
    }, [timesheets, expenses, jsas]);

    const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unknown';
    const getJobName = (id) => jobs.find(j => j.id === id)?.name || 'Unknown';

    const renderItem = (item) => {
        const timeAgo = formatDistanceToNow(item.timestamp, { addSuffix: true });
        switch (item.type) {
            case 'timesheet':
                return <><Clock className="w-4 h-4 mr-3 text-blue-500"/> <div><strong>{getUserName(item.userId)}</strong> submitted a timesheet for <strong>{getJobName(item.jobId)}</strong>. <span className="text-xs text-text-secondary">{timeAgo}</span></div></>;
            case 'expense':
                return <><DollarSign className="w-4 h-4 mr-3 text-green-500"/> <div><strong>{getUserName(item.userId)}</strong> submitted an expense of <strong>${item.amount.toFixed(2)}</strong>. <span className="text-xs text-text-secondary">{timeAgo}</span></div></>;
            case 'jsa':
                return <><Shield className="w-4 h-4 mr-3 text-orange-500"/> <div><strong>{getUserName(item.createdBy)}</strong> created a JSA: <strong>{item.title}</strong>. <span className="text-xs text-text-secondary">{timeAgo}</span></div></>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Recent Activity</h3>
            <div className="space-y-4">
                {combinedFeed.map(item => (
                    <div key={`${item.type}-${item.id}`} className="flex items-center text-sm">
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivityFeed;
