import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';

const SafetyMeetingPage = () => {
    const { navigate, user, jobs, users, addSubmission, showNotification } = useContext(AppContext);
    
    const [jobId, setJobId] = useState('');
    const [topic, setTopic] = useState('');
    const [attendees, setAttendees] = useState([user.id]);

    const availableUsers = users.filter(u => u.teamId === user.teamId);

    const handleAttendeeToggle = (userId) => {
        setAttendees(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addSubmission('safetyMeetings', {
            id: `sm_${Date.now()}`,
            jobId,
            date: new Date().toISOString().split('T')[0],
            topic,
            attendees,
            createdBy: user.id,
        });
        showNotification('Safety meeting logged.', 'success');
        navigate('dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Log Safety Meeting" onBack={() => navigate('dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Meeting Lead" value={user.name} disabled />
                    <SelectField label="Associated Job" options={jobs.map(j => ({ value: j.id, label: j.name }))} value={jobId} onChange={e => setJobId(e.target.value)} required />
                </div>
                <InputField label="Meeting Topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Proper use of PPE" required />

                <div>
                    <h3 className="font-semibold mb-2">Attendees</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-md">
                        {availableUsers.map(u => (
                            <label key={u.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                                <input type="checkbox" checked={attendees.includes(u.id)} onChange={() => handleAttendeeToggle(u.id)} />
                                {u.name}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md">Log Meeting</button>
                </div>
            </form>
        </div>
    );
};

export default SafetyMeetingPage;
