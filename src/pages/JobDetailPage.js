import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, Users, MapPin, Edit, Shield, Briefcase } from 'lucide-react';

const JobDetailPage = ({ jobId }) => {
    const { navigate, jobs, customers, purchaseOrders, expenses, jsas, users, user, signJSA, schedule, fieldTickets } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('financials');
    
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
        return (
            <div>
                <PageHeader title="Job Not Found" onBack={() => navigate('projects')} />
                <p>The requested job could not be found.</p>
            </div>
        );
    }

    const customer = customers.find(c => c.id === job.customerId);
    const jobPOs = purchaseOrders.filter(po => po.jobId === job.id);
    const jobExpenses = expenses.filter(e => e.jobId === job.id);
    const jobJSAs = jsas.filter(j => j.jobId === job.id);
    const jobPersonnelIds = [...new Set(schedule.filter(s => s.jobId === job.id).map(s => s.userId))];
    const jobPersonnel = users.filter(u => jobPersonnelIds.includes(u.id));
    const jobFieldTickets = fieldTickets.filter(ft => ft.jobId === job.id);

    const poData = jobPOs.map(po => ({ name: po.number, Spent: po.consumedValue, Remaining: po.totalValue - po.consumedValue }));
    const statusColors = { Approved: 'text-success', Pending: 'text-warning', Rejected: 'text-danger', Active: 'text-success', Signed: 'text-success' };

    const handleSignJSA = (jsaId) => {
        signJSA(jsaId, user.id);
    };

    const TabButton = ({ tabName, label, icon: Icon }) => (
        <button 
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tabName ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-muted/50'}`}
        >
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <PageHeader title={job.name} onBack={() => navigate('projects')}>
                <span className="text-lg font-normal text-text-secondary">{customer?.name}</span>
            </PageHeader>

            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-2">
                    <TabButton tabName="financials" label="Financials" icon={DollarSign} />
                    <TabButton tabName="jsas" label="JSAs" icon={Shield} />
                    <TabButton tabName="personnel" label="Personnel" icon={Users} />
                    <TabButton tabName="field_tickets" label="Field Tickets" icon={Briefcase} />
                </nav>
            </div>

            {activeTab === 'financials' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bg-surface p-6 rounded-lg shadow-md border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center"><DollarSign className="w-5 h-5 mr-2"/>PO Burn Down</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={poData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis type="number" stroke="var(--text-secondary)" tickFormatter={(value) => `$${(value/1000)}k`} />
                                <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={100} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }} formatter={(value) => `$${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="Spent" stackId="a" fill="var(--primary)" />
                                <Bar dataKey="Remaining" stackId="a" fill="var(--muted)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="lg:col-span-2 bg-surface p-6 rounded-lg shadow-md border border-border">
                         <h3 className="text-lg font-semibold mb-4 text-text-primary">Expenses Log</h3>
                         <div className="overflow-y-auto max-h-[250px]">
                            <table className="min-w-full">
                                <thead className="sticky top-0 bg-surface"><tr><th className="text-left text-sm font-medium text-text-secondary pb-2">Date</th><th className="text-left text-sm font-medium text-text-secondary pb-2">Amount</th><th className="text-left text-sm font-medium text-text-secondary pb-2">Status</th></tr></thead>
                                <tbody>
                                    {jobExpenses.map(exp => (
                                        <tr key={exp.id} className="border-t border-border">
                                            <td className="py-2 text-sm">{exp.date}</td>
                                            <td className="py-2 text-sm">${exp.amount.toFixed(2)}</td>
                                            <td className={`py-2 text-sm font-semibold ${statusColors[exp.status]}`}>{exp.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'jsas' && (
                 <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Job Safety Analyses</h3>
                    <div className="space-y-4">
                        {jobJSAs.map(jsa => (
                            <div key={jsa.id} className="p-4 border border-border rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{jsa.title} <span className={`text-xs font-bold ml-2 ${statusColors[jsa.status]}`}>({jsa.status})</span></p>
                                        <p className="text-xs text-text-secondary">Created by {users.find(u => u.id === jsa.createdBy)?.name} on {jsa.date}</p>
                                    </div>
                                    {user.role === 'technician' && jsa.status === 'Active' && !jsa.signatures.includes(user.id) && jsa.requiredSignatures.includes(user.id) && (
                                        <button onClick={() => handleSignJSA(jsa.id)} className="flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                                            <Edit className="w-4 h-4 mr-2"/> Sign JSA
                                        </button>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-border">
                                    <p className="text-sm font-semibold mb-2">Signatures ({jsa.signatures.length} / {jsa.requiredSignatures.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {jsa.signatures.map(sigId => (
                                            <span key={sigId} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{users.find(u => u.id === sigId)?.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'personnel' && (
                <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Personnel Assigned to Job</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobPersonnel.map(person => (
                            <div key={person.id} className="p-4 border border-border rounded-lg flex items-center space-x-4">
                               <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-md">
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary">{person.name}</p>
                                    <p className="text-sm text-text-secondary">{person.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'field_tickets' && (
                <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Field Tickets for this Job</h3>
                     <div className="space-y-4">
                        {jobFieldTickets.length > 0 ? jobFieldTickets.map(ticket => (
                            <div key={ticket.id} className="p-4 border border-border rounded-lg">
                                <p className="font-semibold">{ticket.id} - {ticket.date}</p>
                                <p className="text-sm">Status: <span className={`font-semibold ${statusColors[ticket.status]}`}>{ticket.status}</span></p>
                                {ticket.clientSignee && <p className="text-sm">Signed by: {ticket.clientSignee}</p>}
                            </div>
                        )) : <p className="text-text-secondary">No field tickets have been generated for this job yet.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetailPage;
