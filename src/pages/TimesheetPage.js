import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';
import { useGeolocation, isWithinGeofence } from '../hooks/useGeolocation';
import { sendPunchToPaylocity } from '../services/PaylocityService';
import { MapPin } from 'lucide-react';

const TimesheetPage = ({ pageData }) => {
    const { navigate, showNotification, user, jobs, customers, purchaseOrders, addSubmission, updateSubmission, timesheets } = useContext(AppContext);
    const { location, error, loading, getPosition } = useGeolocation();
    
    const isEditing = pageData?.submissionId;
    const initialData = isEditing ? timesheets.find(t => t.id === pageData.submissionId) : {};

    const [selectedJobId, setSelectedJobId] = useState(initialData?.jobId || '');
    const [selectedPOId, setSelectedPOId] = useState(initialData?.poId || '');
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [dayHours, setDayHours] = useState(initialData?.dayHours || '');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [isClockingIn, setIsClockingIn] = useState(false);

    const selectedJob = jobs.find(j => j.id === selectedJobId);
    const customerName = selectedJob ? customers.find(c => c.id === selectedJob.customerId)?.name : 'N/A';
    const jobPOs = purchaseOrders.filter(po => po.jobId === selectedJobId);

    useEffect(() => {
        if (isClockingIn && location) {
            const jobToClockIn = jobs.find(j => j.id === selectedJobId);
            if (isWithinGeofence(location, jobToClockIn)) {
                sendPunchToPaylocity(user.id, { action: 'clockIn', jobId: selectedJobId, timestamp: new Date() });
                showNotification(`Clocked in at ${jobToClockIn.name}. Location verified.`, 'success');
            } else {
                showNotification('Clock-in failed: You are not within the job site geofence.', 'danger');
            }
            setIsClockingIn(false);
        }
        if(error) {
            showNotification(`Geolocation error: ${error.message}`, 'danger');
            setIsClockingIn(false);
        }
    }, [location, error, isClockingIn, jobs, selectedJobId, user.id, showNotification]);
    
    const handleClockIn = () => {
        if (!selectedJobId) {
            showNotification("Please select a job before clocking in.", "warning");
            return;
        }
        setIsClockingIn(true);
        getPosition();
    };
    
    const clearForm = () => {
        setSelectedJobId('');
        setSelectedPOId('');
        setDate(new Date().toISOString().split('T')[0]);
        setDayHours('');
        setNotes('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedJobId || !dayHours) {
            showNotification("Please select a job and enter hours worked.", "warning");
            return;
        }

        if (isEditing) {
            updateSubmission('timesheets', pageData.submissionId, {
                jobId: selectedJobId,
                poId: selectedPOId,
                date,
                dayHours: parseFloat(dayHours) || 0,
                notes,
                status: 'Pending', // Resubmit as Pending
                rejectionReason: null,
            });
            showNotification('Timesheet resubmitted successfully!', 'success');
        } else {
            const newTimesheet = {
                id: `ts_${Date.now()}`,
                userId: user.id,
                jobId: selectedJobId,
                poId: selectedPOId,
                date,
                dayHours: parseFloat(dayHours) || 0,
                nightHours: 0,
                status: 'Pending',
                notes,
                billable: true,
                invoiced: false,
                rejectionReason: null
            };
            addSubmission('timesheets', newTimesheet);
            showNotification('Timesheet submitted successfully for approval!', 'success');
        }
        
        clearForm();
        navigate('submissions');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title={isEditing ? "Edit & Resubmit Timesheet" : "Daily Field Log"} onBack={() => navigate(isEditing ? 'submissions' : 'dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border border-border space-y-6">
                <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Job Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <InputField label="Technician Name" value={user.name} disabled />
                        <InputField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        <SelectField 
                            label="Job / Main Location" 
                            options={jobs.filter(j=>j.status === 'Active').map(j => ({ value: j.id, label: `${j.name} (${j.location})` }))}
                            value={selectedJobId}
                            onChange={(e) => {
                                setSelectedJobId(e.target.value);
                                setSelectedPOId('');
                            }}
                            required
                        />
                         <SelectField 
                            label="Purchase Order (PO)" 
                            options={jobPOs.map(po => ({ value: po.id, label: `${po.number} ($${po.consumedValue} / $${po.totalValue})` }))}
                            value={selectedPOId}
                            onChange={e => setSelectedPOId(e.target.value)}
                            disabled={!selectedJobId}
                        />
                        <InputField label="Customer" value={customerName} disabled />
                        {!isEditing && <button type="button" onClick={handleClockIn} disabled={loading || !selectedJobId} className="w-full h-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400">
                           <MapPin className="w-5 h-5 mr-2" />
                           {loading ? 'Verifying Location...' : 'Verify Location & Clock In'}
                        </button>}
                    </div>
                </div>

                <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Hours Worked</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <InputField label="Total Billable Hours for Today" type="number" value={dayHours} onChange={e => setDayHours(e.target.value)} placeholder="e.g., 12.5" required />
                    </div>
                </div>
                
                 <div>
                    <h3 className="text-lg font-semibold text-text-primary">Work Summary</h3>
                     <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows="4"
                        className="mt-2 block w-full px-3 py-2 bg-surface border border-border rounded-md shadow-sm placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
                        placeholder="Enter a detailed summary of the work performed, equipment used, and any issues encountered..."
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                    <button type="button" onClick={() => navigate('dashboard')} className="px-6 py-2 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">{isEditing ? "Resubmit" : "Submit for Approval"}</button>
                </div>
            </form>
        </div>
    );
};

export default TimesheetPage;
