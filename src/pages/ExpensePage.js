import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';
import { Upload } from 'lucide-react';

const EXPENSE_CATEGORIES = [
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Meals', label: 'Meals' },
    { value: 'Parts', label: 'Parts & Supplies' },
    { value: 'Tools', label: 'Tools' },
    { value: 'Other', label: 'Other' },
];

const ExpensePage = ({ pageData }) => {
    const { navigate, user, jobs, purchaseOrders, addSubmission, updateSubmission, expenses, showNotification } = useContext(AppContext);

    const isEditing = pageData?.submissionId;
    const initialData = isEditing ? expenses.find(e => e.id === pageData.submissionId) : {};

    const [selectedJobId, setSelectedJobId] = useState(initialData?.jobId || '');
    const [selectedPOId, setSelectedPOId] = useState(initialData?.poId || '');
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState(initialData?.category || '');
    const [vendor, setVendor] = useState(initialData?.vendor || '');
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [receiptFile, setReceiptFile] = useState(null);

    const jobPOs = purchaseOrders.filter(po => po.jobId === selectedJobId);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setReceiptFile(e.target.files[0]);
        }
    };
    
    const clearForm = () => {
        setSelectedJobId('');
        setSelectedPOId('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('');
        setVendor('');
        setAmount('');
        setNotes('');
        setReceiptFile(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            updateSubmission('expenses', pageData.submissionId, {
                jobId: selectedJobId,
                poId: selectedPOId,
                date,
                category,
                vendor,
                amount: parseFloat(amount),
                notes,
                status: 'Pending', // Resubmit as Pending
                rejectionReason: null,
            });
            showNotification('Expense resubmitted successfully!', 'success');
        } else {
            const newExpense = {
                id: `ex_${Date.now()}`,
                userId: user.id,
                jobId: selectedJobId,
                poId: selectedPOId,
                date,
                category,
                vendor,
                amount: parseFloat(amount),
                status: 'Pending',
                receiptUrl: receiptFile ? `https://placehold.co/400x600/EEE/31343C?text=${receiptFile.name}` : null,
                billable: true,
                notes,
                invoiced: false,
                rejectionReason: null
            };
            addSubmission('expenses', newExpense);
            showNotification('Expense submitted for approval!', 'success');
        }
        clearForm();
        navigate('submissions');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title={isEditing ? "Edit & Resubmit Expense" : "New Expense Entry"} onBack={() => navigate(isEditing ? 'submissions' : 'dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField label="Job / Location" options={jobs.filter(j=>j.status === 'Active').map(j => ({ value: j.id, label: j.name }))} value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)} required />
                    <SelectField label="Purchase Order (PO)" options={jobPOs.map(po => ({ value: po.id, label: po.number }))} value={selectedPOId} onChange={e => setSelectedPOId(e.target.value)} disabled={!selectedJobId} />
                    <InputField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    <SelectField label="Category" options={EXPENSE_CATEGORIES} value={category} onChange={e => setCategory(e.target.value)} required />
                    <InputField label="Vendor" value={vendor} onChange={e => setVendor(e.target.value)} placeholder="e.g., NAPA Auto Parts" required />
                    <InputField label="Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 125.50" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Receipt</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-text-secondary/50" />
                            <div className="flex text-sm text-text-secondary">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-surface rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} /></label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                             {receiptFile ? <p className="text-xs text-success">{receiptFile.name}</p> : <p className="text-xs text-text-secondary/70">PNG, JPG, PDF up to 10MB</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Notes (Optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 bg-surface border border-border rounded-md shadow-sm placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"></textarea>
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                    <button type="button" onClick={() => navigate('dashboard')} className="px-6 py-2 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">{isEditing ? "Resubmit" : "Submit for Approval"}</button>
                </div>
            </form>
        </div>
    );
};
export default ExpensePage;
