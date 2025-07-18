import React from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Calendar, AlertCircle, ShieldCheck } from 'lucide-react';

const MyWeekSummary = ({ user, schedule, jobs, jsas, timesheets, expenses, navigate }) => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today);
    const endOfCurrentWeek = endOfWeek(today);
    
    const myCurrentAssignment = schedule.find(s => 
        s.userId === user.id && 
        isWithinInterval(today, { start: new Date(s.startDate), end: new Date(s.endDate) })
    );
    const myCurrentJob = myCurrentAssignment ? jobs.find(j => j.id === myCurrentAssignment.jobId) : null;

    const myRejectedItems = [
        ...timesheets.filter(t => t.userId === user.id && t.status === 'Rejected'),
        ...expenses.filter(e => e.userId === user.id && e.status === 'Rejected')
    ];

    const jsasToSign = myCurrentJob ? jsas.filter(j => 
        j.jobId === myCurrentJob.id && 
        j.status === 'Active' && 
        j.requiredSignatures.includes(user.id) &&
        !j.signatures.includes(user.id)
    ) : [];

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">My Week ({format(startOfCurrentWeek, 'MMM d')} - {format(endOfCurrentWeek, 'MMM d')})</h3>
            <div className="space-y-4">
                <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                        <p className="font-semibold">Current Assignment</p>
                        <p className="text-sm text-text-secondary">{myCurrentJob ? `${myCurrentJob.name} (${myCurrentJob.location})` : "Not scheduled this week."}</p>
                    </div>
                </div>
                {myRejectedItems.length > 0 && (
                     <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 mr-3 mt-1 text-danger" />
                        <div>
                            <p className="font-semibold">Items to Resubmit</p>
                            <p className="text-sm text-text-secondary">You have {myRejectedItems.length} submission(s) that were rejected.</p>
                             <button onClick={() => navigate('submissions')} className="text-sm font-semibold text-primary hover:underline">View and Resubmit</button>
                        </div>
                    </div>
                )}
                {jsasToSign.length > 0 && (
                     <div className="flex items-start">
                        <ShieldCheck className="w-5 h-5 mr-3 mt-1 text-success" />
                        <div>
                            <p className="font-semibold">JSAs to Sign</p>
                            <p className="text-sm text-text-secondary">You have {jsasToSign.length} JSA(s) to sign for your current job.</p>
                            <button onClick={() => navigate('job_detail', { jobId: myCurrentJob.id })} className="text-sm font-semibold text-primary hover:underline">Go to Job Details</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWeekSummary;
