import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import { useSortableData } from '../hooks/useSortableData';
import { FilePlus, Edit, Printer, Search, ArrowUpDown } from 'lucide-react';

const SortableHeader = ({ children, requestSort, sortConfig, sortKey }) => {
    const isSorted = sortConfig && sortConfig.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
            <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 hover:text-text-primary" title={`Sort by ${sortKey}`}>
                {children}
                {isSorted ? (direction === 'ascending' ? '▲' : '▼') : <ArrowUpDown className="w-3 h-3" />}
            </button>
        </th>
    );
};

const FieldTicketTemplate = ({ ticket, company, customer, items }) => {
    const laborTotal = items.labor.reduce((acc, item) => acc + item.total, 0);
    const expenseTotal = items.expenses.reduce((acc, item) => acc + item.amount, 0);
    const totalAmount = laborTotal + expenseTotal;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto print-container text-black">
            <div className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
                    <p className="text-gray-500 text-sm">{company.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold text-gray-700">FIELD TICKET</h2>
                    <p className="text-gray-500"># {ticket.id}</p>
                    <p className="text-gray-500">Date: {ticket.date}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                    <p className="font-semibold text-gray-500">CUSTOMER</p>
                    <p className="font-bold text-gray-800">{customer.name}</p>
                    <p className="text-gray-600">{customer.address}</p>
                </div>
                 <div>
                    <p className="font-semibold text-gray-500">JOB SITE</p>
                    <p className="font-bold text-gray-800">{items.job.name}</p>
                    <p className="text-gray-600">{items.job.location}</p>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-2">SUMMARY OF WORK</h3>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="p-2 font-semibold">Date</th>
                            <th className="p-2 font-semibold">Technician</th>
                            <th className="p-2 font-semibold">Description</th>
                            <th className="p-2 font-semibold text-right">Hours</th>
                            <th className="p-2 font-semibold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.labor.map(item => (
                             <tr key={item.id} className="border-b">
                                <td className="p-2">{item.date}</td>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.notes}</td>
                                <td className="p-2 text-right">{item.hours.toFixed(2)}</td>
                                <td className="p-2 text-right font-semibold">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {items.expenses.length > 0 && <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">EXPENSES</h3>
                <table className="w-full text-left text-sm">
                     <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="p-2 font-semibold">Date</th>
                            <th className="p-2 font-semibold">Category</th>
                            <th className="p-2 font-semibold">Vendor</th>
                            <th className="p-2 font-semibold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.expenses.map(item => (
                             <tr key={item.id} className="border-b">
                                <td className="p-2">{item.date}</td>
                                <td className="p-2">{item.category}</td>
                                <td className="p-2">{item.vendor}</td>
                                <td className="p-2 text-right font-semibold">${item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
            <div className="mt-8 pt-8 flex justify-between items-end border-t-2">
                <div>
                    <p className="font-semibold text-gray-800">Client Signature:</p>
                    <p className="mt-12 border-b border-gray-400 w-64"></p>
                    <p className="text-sm text-gray-600">Name: {ticket.clientSignee || '____________________'}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-500">TOTAL</p>
                    <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
};

const FieldTicketPage = () => {
    const { navigate, jobs, timesheets, expenses, fieldTickets, users, company, customers, createFieldTicket, signFieldTicket } = useContext(AppContext);
    
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isSignModalOpen, setSignModalOpen] = useState(false);
    const [isPrintModalOpen, setPrintModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [selectedTimesheets, setSelectedTimesheets] = useState([]);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [ticketToSign, setTicketToSign] = useState(null);
    const [ticketToPrint, setTicketToPrint] = useState(null);
    const [clientSignee, setClientSignee] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const approvedTimesheets = useMemo(() => timesheets.filter(t => t.jobId === selectedJobId && t.status === 'Approved' && !fieldTickets.some(ft => ft.timesheetIds.includes(t.id))), [timesheets, selectedJobId, fieldTickets]);
    const approvedExpenses = useMemo(() => expenses.filter(e => e.jobId === selectedJobId && e.status === 'Approved' && !fieldTickets.some(ft => ft.expenseIds.includes(e.id))), [expenses, selectedJobId, fieldTickets]);

    const searchableTickets = useMemo(() => fieldTickets.map(ticket => ({
        ...ticket,
        jobName: jobs.find(j => j.id === ticket.jobId)?.name || 'N/A'
    })), [fieldTickets, jobs]);

    const filteredTickets = useMemo(() => {
        if (!searchTerm) return searchableTickets;
        return searchableTickets.filter(ticket =>
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.jobName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchableTickets, searchTerm]);
    
    const { items: sortedTickets, requestSort, sortConfig } = useSortableData(filteredTickets, { key: 'date', direction: 'descending' });

    const handleCreateTicket = () => {
        if (!selectedJobId || (selectedTimesheets.length === 0 && selectedExpenses.length === 0)) {
            alert('Please select a job and at least one item to include.');
            return;
        }
        createFieldTicket({
            jobId: selectedJobId,
            date: new Date().toISOString().split('T')[0],
            timesheetIds: selectedTimesheets,
            expenseIds: selectedExpenses,
        });
        setCreateModalOpen(false);
        setSelectedJobId('');
        setSelectedTimesheets([]);
        setSelectedExpenses([]);
    };

    const handleSignTicket = () => {
        if (!clientSignee) {
            alert('Client Signee name is required.');
            return;
        }
        signFieldTicket(ticketToSign.id, clientSignee);
        setSignModalOpen(false);
        setTicketToSign(null);
        setClientSignee('');
    };

    const handlePrintTicket = (ticket) => {
        const job = jobs.find(j => j.id === ticket.jobId);
        const customer = customers.find(c => c.id === job.customerId);
        const laborItems = timesheets.filter(t => ticket.timesheetIds.includes(t.id)).map(t => {
            const user = users.find(u => u.id === t.userId);
            return { ...t, name: user.name, total: (t.dayHours + t.nightHours) * user.rate, hours: t.dayHours + t.nightHours };
        });
        const expenseItems = expenses.filter(e => ticket.expenseIds.includes(e.id));
        setTicketToPrint({ ticket, company, customer, items: { job, labor: laborItems, expenses: expenseItems } });
        setPrintModalOpen(true);
    };

    const statusColors = { 'Pending Signature': 'bg-yellow-100 text-yellow-800', 'Signed': 'bg-green-100 text-green-800', 'Invoiced': 'bg-blue-100 text-blue-800' };

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Field Tickets" onBack={() => navigate('dashboard')}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input type="text" placeholder="Search tickets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-border rounded-md bg-surface w-64"/>
                </div>
                <button onClick={() => setCreateModalOpen(true)} className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                    <FilePlus className="w-4 h-4 mr-2" /> Create New Ticket
                </button>
            </PageHeader>

            <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="id">Ticket ID</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="jobName">Job</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="date">Date</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="status">Status</SortableHeader>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortedTickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td className="px-6 py-4 font-mono text-sm">{ticket.id}</td>
                                    <td className="px-6 py-4 text-sm">{ticket.jobName}</td>
                                    <td className="px-6 py-4 text-sm">{ticket.date}</td>
                                    <td className="px-6 py-4 text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span></td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                                        <button onClick={() => handlePrintTicket(ticket)} className="text-secondary hover:text-primary flex items-center text-sm" title="Print Ticket"><Printer className="w-4 h-4 mr-1" /> Print</button>
                                        {ticket.status === 'Pending Signature' && (
                                            <button onClick={() => { setTicketToSign(ticket); setSignModalOpen(true); }} className="text-primary hover:underline flex items-center text-sm" title="Get Signature"><Edit className="w-4 h-4 mr-1" /> Get Signature</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Field Ticket" size="4xl">
                <div className="space-y-4">
                    <SelectField label="Select Job" options={jobs.map(j => ({ value: j.id, label: j.name }))} value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)} />
                    {selectedJobId && (
                        <div className="grid grid-cols-2 gap-6 max-h-[50vh] overflow-y-auto p-1">
                            <div>
                                <h4 className="font-semibold mb-2">Approved Timesheets</h4>
                                <div className="space-y-2">{approvedTimesheets.length > 0 ? approvedTimesheets.map(t => (
                                    <label key={t.id} className="flex items-center space-x-2 p-2 border rounded-md"><input type="checkbox" onChange={() => setSelectedTimesheets(p => p.includes(t.id) ? p.filter(id => id !== t.id) : [...p, t.id])} /><span>{t.date} - {users.find(u=>u.id === t.userId)?.name} ({t.dayHours} hrs)</span></label>
                                )) : <p className="text-sm text-text-secondary">No un-ticketed timesheets for this job.</p>}</div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Approved Expenses</h4>
                                <div className="space-y-2">{approvedExpenses.length > 0 ? approvedExpenses.map(e => (
                                    <label key={e.id} className="flex items-center space-x-2 p-2 border rounded-md"><input type="checkbox" onChange={() => setSelectedExpenses(p => p.includes(e.id) ? p.filter(id => id !== e.id) : [...p, e.id])} /><span>{e.date} - {e.category} (${e.amount})</span></label>
                                )) : <p className="text-sm text-text-secondary">No un-ticketed expenses for this job.</p>}</div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 pt-4 border-t"><button onClick={() => setCreateModalOpen(false)}>Cancel</button><button onClick={handleCreateTicket} className="px-4 py-2 bg-primary text-white rounded-md">Create Ticket</button></div>
                </div>
            </Modal>
            
            <Modal isOpen={isSignModalOpen} onClose={() => setSignModalOpen(false)} title="Client Signature">
                <div className="space-y-4">
                    <p>Please have the client representative sign off on Field Ticket <strong>{ticketToSign?.id}</strong>.</p>
                    <InputField label="Client Representative Name" value={clientSignee} onChange={e => setClientSignee(e.target.value)} placeholder="e.g., John Smith" required />
                    <div className="flex justify-end space-x-3 pt-4 border-t"><button onClick={() => setSignModalOpen(false)}>Cancel</button><button onClick={handleSignTicket} className="px-4 py-2 bg-primary text-white rounded-md">Confirm Signature</button></div>
                </div>
            </Modal>

            <Modal isOpen={isPrintModalOpen} onClose={() => setPrintModalOpen(false)} title="Print Field Ticket" size="4xl">
                {ticketToPrint && <FieldTicketTemplate {...ticketToPrint} />}
                <div className="flex justify-end gap-4 mt-4 no-print">
                    <button onClick={() => window.print()} className="px-4 py-2 bg-primary text-white rounded-md">Print</button>
                </div>
            </Modal>
        </div>
    );
};

export default FieldTicketPage;
