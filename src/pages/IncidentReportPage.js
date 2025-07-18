import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';
import { Upload, AlertTriangle } from 'lucide-react';

const INCIDENT_TYPES = [
    { value: 'Injury', label: 'Personnel Injury' },
    { value: 'Spill', label: 'Environmental Spill' },
    { value: 'Equipment Failure', label: 'Equipment Failure' },
    { value: 'Vehicle Accident', label: 'Vehicle Accident' },
    { value: 'Near Miss', label: 'Near Miss' },
    { value: 'Other', label: 'Other' },
];

const IncidentReportPage = () => {
    const { navigate, user, jobs, addSubmission, showNotification } = useContext(AppContext);

    const [formData, setFormData] = useState({
        jobId: '',
        incidentType: '',
        dateTime: new Date().toISOString().slice(0, 16),
        location: '',
        description: '',
        actionsTaken: '',
        witnesses: '',
    });
    const [attachment, setAttachment] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleJobChange = (e) => {
        const { value } = e.target;
        const job = jobs.find(j => j.id === value);
        setFormData(prev => ({
            ...prev,
            jobId: value,
            location: job ? job.location : ''
        }));
    }

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newIncident = {
            id: `inc_${Date.now()}`,
            reporterId: user.id,
            ...formData,
            attachmentUrl: attachment ? `https://placehold.co/400x600/EEE/31343C?text=${attachment.name}` : null,
            status: 'Submitted',
        };
        addSubmission('incidents', newIncident);
        showNotification('Incident report submitted. A safety manager will be notified.', 'success');
        navigate('dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="New Incident Report" onBack={() => navigate('dashboard')}>
                <AlertTriangle className="w-6 h-6 text-danger"/>
            </PageHeader>
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Reporter Name" value={user.name} disabled />
                    <InputField label="Date and Time of Incident" type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} required />
                    <SelectField label="Associated Job (if applicable)" options={jobs.map(j => ({ value: j.id, label: j.name }))} value={formData.jobId} onChange={handleJobChange} />
                    <SelectField label="Type of Incident" options={INCIDENT_TYPES} name="incidentType" value={formData.incidentType} onChange={handleChange} required />
                </div>
                
                <InputField label="Precise Location of Incident" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Well Pad 7, by the main separator" required />

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Detailed Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded-md" placeholder="Describe what happened in sequence. Be specific." required></textarea>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Immediate Actions Taken</label>
                    <textarea name="actionsTaken" value={formData.actionsTaken} onChange={handleChange} rows="3" className="w-full p-2 border rounded-md" placeholder="What was done immediately to secure the scene and mitigate hazards?" required></textarea>
                </div>
                
                <InputField label="Witnesses" name="witnesses" value={formData.witnesses} onChange={handleChange} placeholder="List names and contact info of any witnesses" />

                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Photo/Video Attachment</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-text-secondary/50" />
                            <div className="flex text-sm text-text-secondary">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-surface rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} /></label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                             {attachment ? <p className="text-xs text-success">{attachment.name}</p> : <p className="text-xs text-text-secondary/70">PNG, JPG, MOV up to 25MB</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                    <button type="button" onClick={() => navigate('dashboard')} className="px-6 py-2 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-red-700">Submit Urgent Report</button>
                </div>
            </form>
        </div>
    );
};

export default IncidentReportPage;
