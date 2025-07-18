import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import { Check, X, Eye } from 'lucide-react';

const ApprovalCard = ({ title, items, onApprove, onReject, onReview, renderItem }) => (
    <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">{title} ({items.length})</h3>
        {items.length > 0 ? (
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex-1 mr-2">{renderItem(item)}</div>
                        <div className="flex space-x-1 ml-2">
                            <button onClick={() => onReview(item)} className="p-2 text-text-secondary hover:bg-blue-500/10 hover:text-primary rounded-full" title="Review Details"><Eye className="w-5 h-5"/></button>
                            <button onClick={() => onApprove(item.id)} className="p-2 text-success hover:bg-success/10 rounded-full" title="Approve"><Check className="w-5 h-5"/></button>
                            <button onClick={() => onReject(item)} className="p-2 text-danger hover:bg-danger/10 rounded-full" title="Reject"><X className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-sm text-text-secondary">No pending items.</p>
        )}
    </div>
);


const ApprovalsPage = () => {
    const { navigate, timesheets, expenses, jsas, dvirs, updateApprovalStatus, users, jobs, user } = useContext(AppContext);
    
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    
    const [activeItem, setActiveItem] = useState(null);
    const [activeItemType, setActiveItemType] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const getVisibleItems = (items) => {
        if (user.role === 'executive' || user.role === 'admin') return items;
        if (user.role === 'supervisor') {
            const myTeamIds = users.filter(u => u.teamId === user.teamId).map(u => u.id);
            return items.filter(item => myTeamIds.includes(item.userId));
        }
        return [];
    };

    const pendingTimesheets = getVisibleItems(timesheets.filter(t => t.status === 'Pending'));
    const pendingExpenses = getVisibleItems(expenses.filter(e => e.status === 'Pending'));
    const pendingJSAs = jsas.filter(j => j.status === 'Pending');
    const dvirsToReview = getVisibleItems(dvirs.filter(d => d.status === 'Pending Review'));

    const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown User';
    const getJobName = (jobId) => jobs.find(j => j.id === jobId)?.name || 'Unknown Job';

    const handleReview = (item, type) => {
        setActiveItem(item);
        setActiveItemType(type);
        setReviewModalOpen(true);
    };

    const handleRejectClick = (item, type) => {
        setActiveItem(item);
        setActiveItemType(type);
        setRejectModalOpen(true);
    };

    const confirmRejection = () => {
        updateApprovalStatus(activeItemType, activeItem.id, 'Rejected', rejectionReason);
        setRejectModalOpen(false);
        setRejectionReason('');
    };

    const renderModalContent = () => {
        if (!activeItem) return null;
        switch(activeItemType) {
            case 'timesheets': return <div className="space-y-2"><p><strong>Technician:</strong> {getUserName(activeItem.userId)}</p><p><strong>Job:</strong> {getJobName(activeItem.jobId)}</p><p><strong>Date:</strong> {activeItem.date}</p><p><strong>Hours:</strong> {activeItem.dayHours + activeItem.nightHours}</p><p><strong>Notes:</strong> {activeItem.notes || 'N/A'}</p></div>;
            case 'expenses': return <div className="space-y-2"><p><strong>Technician:</strong> {getUserName(activeItem.userId)}</p><p><strong>Job:</strong> {getJobName(activeItem.jobId)}</p><p><strong>Date:</strong> {activeItem.date}</p><p><strong>Category:</strong> {activeItem.category}</p><p><strong>Vendor:</strong> {activeItem.vendor}</p><p><strong>Amount:</strong> ${activeItem.amount.toFixed(2)}</p>{activeItem.receiptUrl && <a href={activeItem.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Receipt</a>}</div>;
            case 'jsas': return <div className="space-y-2"><p><strong>Title:</strong> {activeItem.title}</p><p><strong>Job:</strong> {getJobName(activeItem.jobId)}</p><p><strong>Creator:</strong> {getUserName(activeItem.createdBy)}</p><p><strong>Steps:</strong></p><ul className="list-disc pl-5 text-sm">{activeItem.steps.map(step => <li key={step.id}><strong>{step.description}:</strong> {step.control}</li>)}</ul></div>;
            case 'dvirs': return <div className="space-y-2"><p><strong>Technician:</strong> {getUserName(activeItem.userId)}</p><p><strong>Vehicle:</strong> {activeItem.vehicleId}</p><p><strong>Date:</strong> {activeItem.date}</p><p><strong>Defects Reported:</strong></p><ul className="list-disc pl-5 text-sm">{activeItem.defects.length > 0 ? activeItem.defects.map(d => <li key={d}>{d}</li>) : <li>No defects reported.</li>}</ul><p><strong>Remarks:</strong> {activeItem.remarks}</p></div>;
            default: return null;
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Approval & Review Queue" onBack={() => navigate('dashboard')} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ApprovalCard title="Pending Timesheets" items={pendingTimesheets} onApprove={(id) => updateApprovalStatus('timesheets', id, 'Approved')} onReject={(item) => handleRejectClick(item, 'timesheets')} onReview={(item) => handleReview(item, 'timesheets')} renderItem={(item) => (<p className="text-sm"><strong>{getUserName(item.userId)}</strong> submitted <strong>{item.dayHours + item.nightHours} hrs</strong> for {getJobName(item.jobId)}.</p>)} />
                <ApprovalCard title="Pending Expenses" items={pendingExpenses} onApprove={(id) => updateApprovalStatus('expenses', id, 'Approved')} onReject={(item) => handleRejectClick(item, 'expenses')} onReview={(item) => handleReview(item, 'expenses')} renderItem={(item) => (<p className="text-sm"><strong>{getUserName(item.userId)}</strong> submitted <strong>${item.amount.toFixed(2)}</strong> ({item.category}).</p>)} />
                <ApprovalCard title="Pending Job Safety Analyses" items={pendingJSAs} onApprove={(id) => updateApprovalStatus('jsas', id, 'Active')} onReject={(item) => handleRejectClick(item, 'jsas')} onReview={(item) => handleReview(item, 'jsas')} renderItem={(item) => (<p className="text-sm"><strong>{item.title}</strong> for {getJobName(item.jobId)}.</p>)} />
                <ApprovalCard title="Vehicle Defects to Review" items={dvirsToReview} onApprove={(id) => updateApprovalStatus('dvirs', id, 'Reviewed')} onReject={(item) => handleRejectClick(item, 'dvirs')} onReview={(item) => handleReview(item, 'dvirs')} renderItem={(item) => (<p className="text-sm"><strong>{getUserName(item.userId)}</strong> reported defects for <strong>{item.vehicleId}</strong>.</p>)} />
            </div>
            
            <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`Review: ${activeItemType.slice(0, -1)}`}>
                {renderModalContent()}
                <div className="flex justify-end pt-4 mt-4 border-t"><button onClick={() => setReviewModalOpen(false)} className="px-4 py-2 border rounded-md text-sm font-medium">Close</button></div>
            </Modal>

            <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title={`Reject ${activeItemType.slice(0, -1)}`}>
                <div>
                    <p className="mb-4">Are you sure you want to reject this submission? Please provide a reason.</p>
                    <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Reason for rejection..." rows="3"></textarea>
                    <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
                        <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
                        <button onClick={confirmRejection} className="px-4 py-2 bg-danger text-white rounded-md text-sm font-medium">Confirm Rejection</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ApprovalsPage;
