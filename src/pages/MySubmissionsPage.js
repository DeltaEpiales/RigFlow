import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import { Edit } from 'lucide-react';

const MySubmissionsPage = () => {
    const { navigate, user, timesheets, expenses, dvirs, jobs } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('timesheets');

    const myTimesheets = timesheets.filter(t => t.userId === user.id).sort((a,b) => new Date(b.date) - new Date(a.date));
    const myExpenses = expenses.filter(e => e.userId === user.id).sort((a,b) => new Date(b.date) - new Date(a.date));
    const myDvirs = dvirs.filter(d => d.userId === user.id).sort((a,b) => new Date(b.date) - new Date(a.date));

    const getJobName = (jobId) => jobs.find(j => j.id === jobId)?.name || 'N/A';
    
    const statusColors = {
        Approved: 'bg-green-100 text-green-800',
        Reviewed: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        'Pending Review': 'bg-yellow-100 text-yellow-800',
        Rejected: 'bg-red-100 text-red-800',
    };

    const TabButton = ({ tabName, label }) => (
        <button 
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tabName ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:bg-muted'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="My Submissions" onBack={() => navigate('dashboard')} />

            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-4">
                    <TabButton tabName="timesheets" label={`Timesheets (${myTimesheets.length})`} />
                    <TabButton tabName="expenses" label={`Expenses (${myExpenses.length})`} />
                    <TabButton tabName="dvirs" label={`DVIRs (${myDvirs.length})`} />
                </nav>
            </div>
            
            <div className="mt-6">
                {activeTab === 'timesheets' && myTimesheets.map(t => (
                    <div key={t.id} className="bg-surface p-4 rounded-lg shadow-md border mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{t.date} - {getJobName(t.jobId)}</p>
                                <p className="text-sm text-text-secondary">{t.dayHours} hours - "{t.notes}"</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[t.status]}`}>{t.status}</span>
                                {t.status === 'Rejected' && (
                                    <button onClick={() => navigate('timesheet', { submissionId: t.id })} className="text-xs text-primary hover:underline flex items-center mt-1">
                                        <Edit className="w-3 h-3 mr-1"/> Resubmit
                                    </button>
                                )}
                            </div>
                        </div>
                        {t.rejectionReason && <p className="text-xs mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-800"><strong>Reason for rejection:</strong> {t.rejectionReason}</p>}
                    </div>
                ))}
                {activeTab === 'expenses' && myExpenses.map(e => (
                    <div key={e.id} className="bg-surface p-4 rounded-lg shadow-md border mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{e.date} - ${e.amount.toFixed(2)} ({e.category})</p>
                                <p className="text-sm text-text-secondary">{e.vendor} - {getJobName(e.jobId)}</p>
                            </div>
                             <div className="text-right">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[e.status]}`}>{e.status}</span>
                                {e.status === 'Rejected' && (
                                    <button onClick={() => navigate('expense', { submissionId: e.id })} className="text-xs text-primary hover:underline flex items-center mt-1">
                                        <Edit className="w-3 h-3 mr-1"/> Resubmit
                                    </button>
                                )}
                            </div>
                        </div>
                        {e.rejectionReason && <p className="text-xs mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-800"><strong>Reason for rejection:</strong> {e.rejectionReason}</p>}
                    </div>
                ))}
                 {activeTab === 'dvirs' && myDvirs.map(d => (
                    <div key={d.id} className="bg-surface p-4 rounded-lg shadow-md border mb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{d.date} - {d.vehicleId}</p>
                                <p className="text-sm text-text-secondary">{d.defects.length > 0 ? `${d.defects.length} defect(s) reported` : 'No defects'}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[d.status]}`}>{d.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySubmissionsPage;
