import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Shield, Map, CheckSquare, FileText, Briefcase, Users, AlertTriangle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';
import MyWeekSummary from '../components/dashboard/MyWeekSummary';
import SupervisorAnalytics from '../components/dashboard/SupervisorAnalytics';

const TechnicianDashboard = (props) => {
    return (
        <div className="space-y-6">
            <MyWeekSummary {...props} />
        </div>
    );
};

const SupervisorDashboard = (props) => {
    const { timesheets, expenses, jsas, users, navigate, incidents } = props;
    const { user } = props;
    
    const myTeamIds = users.filter(u => u.teamId === user.teamId).map(u => u.id);

    const pendingTimesheets = timesheets.filter(t => t.status === 'Pending' && myTeamIds.includes(t.userId));
    const pendingExpenses = expenses.filter(e => e.status === 'Pending' && myTeamIds.includes(e.userId));
    const pendingJSAs = jsas.filter(j => j.status === 'Pending');
    const newIncidents = incidents.filter(i => i.status === 'Submitted');

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Supervisor Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Pending Timesheets" value={pendingTimesheets.length} icon={CheckSquare} onClick={() => navigate('approvals')} variant={pendingTimesheets.length > 0 ? 'warning' : 'success'} />
                <StatCard title="Pending Expenses" value={pendingExpenses.length} icon={DollarSign} onClick={() => navigate('approvals')} variant={pendingExpenses.length > 0 ? 'warning' : 'success'} />
                <StatCard title="Pending JSAs" value={pendingJSAs.length} icon={Shield} onClick={() => navigate('approvals')} variant={pendingJSAs.length > 0 ? 'warning' : 'success'} />
                <StatCard title="New Incident Reports" value={newIncidents.length} icon={AlertTriangle} variant={newIncidents.length > 0 ? 'danger' : 'success'} description="Awaiting review"/>
            </div>
            <SupervisorAnalytics {...props} />
            <RecentActivityFeed timesheets={timesheets} expenses={expenses} jsas={jsas} {...props} />
        </div>
    );
};

const AdminDashboard = (props) => {
    const { jobs, users, navigate, fieldTickets } = props;
    const ticketsReadyForInvoice = fieldTickets.filter(ft => ft.status === 'Signed' && !ft.invoiced);
    const expiringCerts = users.flatMap(u => u.certifications.map(c => ({...c, userName: u.name}))).filter(c => new Date(c.expiry) < new Date(new Date().setMonth(new Date().getMonth() + 1)) );

    return (
         <div className="space-y-6">
            <SupervisorDashboard {...props} />
            <div className="pt-6 border-t border-border">
                <h2 className="text-2xl font-bold text-text-primary">Admin Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    <StatCard title="Tickets to Invoice" value={ticketsReadyForInvoice.length} icon={FileText} onClick={() => navigate('invoicing')} variant={ticketsReadyForInvoice.length > 0 ? 'primary' : 'success'}/>
                    <StatCard title="Total Active Jobs" value={jobs.filter(j => j.status === 'Active').length} icon={Map} onClick={() => navigate('projects')} />
                    <StatCard title="Total Users" value={users.length} icon={Users} onClick={() => navigate('users')} />
                    <StatCard title="Compliance Issues" value={expiringCerts.length} icon={Shield} variant={expiringCerts.length > 0 ? "warning" : "success"} description="Certs expiring in 30 days" onClick={() => navigate('users', { prefillSearch: 'expiring' })}/>
                </div>
            </div>
        </div>
    );
};

const ExecutiveDashboard = (props) => {
    const { jobs, invoices } = props;
    const jobStatusData = jobs.reduce((acc, job) => {
        const status = job.status || 'Unknown';
        const existing = acc.find(item => item.name === status);
        if (existing) existing.value += 1;
        else acc.push({ name: status, value: 1 });
        return acc;
    }, []);
    const COLORS = { Active: '#22c55e', Pending: '#f59e0b', Completed: '#64748b' };
    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
    const outstandingRevenue = invoices.filter(i => i.status === 'Issued').reduce((acc, i) => acc + i.amount, 0);

    return (
        <div className="space-y-8">
            <AdminDashboard {...props} />
             <div className="pt-6 border-t border-border">
                <h2 className="text-2xl font-bold text-text-primary">Executive Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    <StatCard title="Total Revenue (Paid)" value={`$${(totalRevenue/1000).toFixed(1)}k`} icon={DollarSign} variant="success" />
                    <StatCard title="Outstanding Revenue" value={`$${(outstandingRevenue/1000).toFixed(1)}k`} icon={DollarSign} variant="warning" />
                    <StatCard title="Active Jobs" value={jobs.filter(j => j.status === 'Active').length} icon={Briefcase} />
                    <StatCard title="TRIR" value="0.85" icon={Shield} description="Trailing 12-months" />
                </div>
             </div>
             <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                <h3 className="text-lg font-semibold mb-4 text-text-primary">Job Status Overview</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={jobStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {jobStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const context = useContext(AppContext);
    switch (context.user.role) {
        case 'technician': return <TechnicianDashboard {...context} />;
        case 'supervisor': return <SupervisorDashboard {...context} />;
        case 'admin': return <AdminDashboard {...context} />;
        case 'executive': return <ExecutiveDashboard {...context} />;
        default: return <div className="text-center p-8">Invalid user role.</div>;
    }
};

export default Dashboard;
