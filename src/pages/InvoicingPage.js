import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import { Printer, FilePlus } from 'lucide-react';

const InvoiceTemplate = ({ invoice, company, customer, items }) => {
    const laborTotal = items.labor.reduce((acc, item) => acc + item.total, 0);
    const expenseTotal = items.expenses.reduce((acc, item) => acc + item.amount, 0);
    const totalAmount = laborTotal + expenseTotal;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto print-container text-black">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
                    <p className="text-gray-500 text-sm">{company.address}</p>
                    <p className="text-gray-500 text-sm">{company.phone} | {company.email}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-semibold text-gray-700">INVOICE</h2>
                    <p className="text-gray-500"># {invoice.id}</p>
                    <p className="text-gray-500">Date: {invoice.date}</p>
                </div>
            </div>

            {/* Bill To */}
            <div className="flex justify-between items-center mt-8">
                <div>
                    <p className="font-semibold text-gray-500">BILL TO</p>
                    <p className="font-bold text-gray-800">{customer.name}</p>
                    <p className="text-gray-600">{customer.address}</p>
                </div>
                <div className="text-right bg-gray-100 p-4 rounded-lg">
                    <p className="font-semibold text-gray-500">TOTAL DUE</p>
                    <p className="text-3xl font-bold text-gray-900">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
            
            {/* Line Items */}
            <div className="mt-8">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600">
                            <th className="p-2 font-semibold">Description</th>
                            <th className="p-2 font-semibold text-right">Hours/Qty</th>
                            <th className="p-2 font-semibold text-right">Rate</th>
                            <th className="p-2 font-semibold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Labor */}
                        {items.labor.map(item => (
                             <tr key={item.id} className="border-b">
                                <td className="p-2">{`Labor: ${item.name} (${item.date})`}</td>
                                <td className="p-2 text-right">{item.hours}</td>
                                <td className="p-2 text-right">${item.rate.toFixed(2)}</td>
                                <td className="p-2 text-right">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                        {/* Expenses */}
                        {items.expenses.map(item => (
                             <tr key={item.id} className="border-b">
                                <td className="p-2">{`Expense: ${item.category} (${item.vendor})`}</td>
                                <td className="p-2 text-right">1</td>
                                <td className="p-2 text-right">${item.amount.toFixed(2)}</td>
                                <td className="p-2 text-right">${item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-8 text-xs text-gray-500 text-center">
                <p>Thank you for your business! Please make all payments to {company.name}.</p>
                <p>Payment due within 30 days.</p>
            </div>
        </div>
    );
};


const InvoicingPage = () => {
    const { navigate, jobs, timesheets, expenses, invoices, users, customers, company, createInvoice, fieldTickets } = useContext(AppContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState(null);
    const [selectedTicketIds, setSelectedTicketIds] = useState([]);

    const ticketsReadyForInvoice = useMemo(() => {
        return fieldTickets.filter(ft => ft.status === 'Signed' && !ft.invoiced);
    }, [fieldTickets]);

    const generatePreview = () => {
        if (selectedTicketIds.length === 0) return;
        
        const firstTicket = fieldTickets.find(ft => ft.id === selectedTicketIds[0]);
        const job = jobs.find(j => j.id === firstTicket.jobId);
        const customer = customers.find(c => c.id === job.customerId);
        
        const billableTimesheetIds = selectedTicketIds.flatMap(tid => fieldTickets.find(ft => ft.id === tid).timesheetIds);
        const billableExpenseIds = selectedTicketIds.flatMap(tid => fieldTickets.find(ft => ft.id === tid).expenseIds);
        
        const billableTimesheets = timesheets.filter(t => billableTimesheetIds.includes(t.id));
        const billableExpenses = expenses.filter(e => billableExpenseIds.includes(e.id));

        const laborItems = billableTimesheets.map(t => {
            const user = users.find(u => u.id === t.userId);
            const hours = t.dayHours + t.nightHours;
            return { id: t.id, name: user.name, rate: user.rate, hours: hours, total: hours * user.rate, date: t.date };
        });

        const invoice = { id: 'PREVIEW', date: new Date().toISOString().split('T')[0] };

        setPreviewInvoice({ invoice, company, customer, items: { labor: laborItems, expenses: billableExpenses } });
        setModalOpen(false);
    };
    
    const handleCreateInvoice = () => {
        if (!previewInvoice) return;
        const totalAmount = previewInvoice.items.labor.reduce((acc, item) => acc + item.total, 0) + previewInvoice.items.expenses.reduce((acc, item) => acc + item.amount, 0);
        createInvoice({ fieldTicketIds: selectedTicketIds, amount: totalAmount });
        setPreviewInvoice(null);
        setSelectedTicketIds([]);
    };
    
    const statusColors = {
        Paid: 'bg-green-100 text-green-800',
        Issued: 'bg-blue-100 text-blue-800',
        Overdue: 'bg-red-100 text-red-800'
    };

    if (previewInvoice) {
        return (
            <div>
                 <PageHeader title={`Invoice Preview`}>
                    <div className="flex space-x-2">
                        <button onClick={() => window.print()} className="flex items-center px-3 py-1.5 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted"><Printer className="w-4 h-4 mr-2"/>Print</button>
                        <button onClick={() => setPreviewInvoice(null)} className="px-3 py-1.5 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted">Cancel</button>
                        <button onClick={handleCreateInvoice} className="flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"><FilePlus className="w-4 h-4 mr-2"/>Create Invoice</button>
                    </div>
                 </PageHeader>
                 <InvoiceTemplate {...previewInvoice} />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Invoicing" onBack={() => navigate('dashboard')}>
                 <button onClick={() => setModalOpen(true)} disabled={ticketsReadyForInvoice.length === 0} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-text-secondary disabled:cursor-not-allowed">
                    <FilePlus className="w-4 h-4 mr-2" /> Generate New Invoice
                </button>
            </PageHeader>
            <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                <h3 className="text-lg font-semibold mb-4 text-text-primary">Issued Invoices</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                       <thead><tr><th className="text-left text-sm font-medium text-text-secondary pb-2">Invoice #</th><th className="text-left text-sm font-medium text-text-secondary pb-2">Date</th><th className="text-left text-sm font-medium text-text-secondary pb-2">Amount</th><th className="text-left text-sm font-medium text-text-secondary pb-2">Status</th></tr></thead>
                       <tbody>
                           {invoices.map(inv => (
                               <tr key={inv.id} className="border-t border-border">
                                   <td className="py-2 text-sm font-semibold">{inv.id}</td>
                                   <td className="py-2 text-sm">{inv.date}</td>
                                   <td className="py-2 text-sm">${inv.amount.toLocaleString()}</td>
                                   <td className="py-2 text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[inv.status]}`}>
                                            {inv.status}
                                        </span>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Select Field Tickets to Invoice">
                <div className="space-y-4">
                    <p className="text-sm text-text-secondary">Select one or more signed, unbilled field tickets to bundle into a single invoice.</p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {ticketsReadyForInvoice.map(ticket => (
                            <label key={ticket.id} className="flex items-center space-x-3 p-3 border rounded-md">
                                <input type="checkbox" className="h-4 w-4" onChange={() => setSelectedTicketIds(p => p.includes(ticket.id) ? p.filter(id => id !== ticket.id) : [...p, ticket.id])} />
                                <div>
                                    <p className="font-semibold">{ticket.id} ({jobs.find(j => j.id === ticket.jobId)?.name})</p>
                                    <p className="text-xs text-text-secondary">Signed by {ticket.clientSignee} on {ticket.date}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button onClick={() => setModalOpen(false)}>Cancel</button>
                        <button onClick={generatePreview} disabled={selectedTicketIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-muted disabled:text-text-secondary">Generate Preview</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default InvoicingPage;
