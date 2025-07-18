import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';
import { Plus, Trash2 } from 'lucide-react';

const DailyDrillingReportPage = () => {
    const { navigate, user, jobs, addSubmission, showNotification } = useContext(AppContext);

    const [jobId, setJobId] = useState('');
    const [drillingDepth, setDrillingDepth] = useState('');
    const [mudWeight, setMudWeight] = useState('');
    const [nptHours, setNptHours] = useState('');
    const [nptReason, setNptReason] = useState('');
    const [hourlyLog, setHourlyLog] = useState([{ time: '07:00', activity: '' }]);

    const handleLogChange = (index, field, value) => {
        const newLog = [...hourlyLog];
        newLog[index][field] = value;
        setHourlyLog(newLog);
    };

    const addLogEntry = () => {
        setHourlyLog([...hourlyLog, { time: '', activity: '' }]);
    };

    const removeLogEntry = (index) => {
        setHourlyLog(hourlyLog.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newReport = {
            id: `ddr_${Date.now()}`,
            jobId,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            createdBy: user.id,
            drillingDepth: parseFloat(drillingDepth),
            mudWeight: parseFloat(mudWeight),
            nptHours: parseFloat(nptHours) || 0,
            nptReason,
            hourlyLog,
        };
        addSubmission('dailyDrillingReports', newReport);
        showNotification('Daily Drilling Report submitted for approval.', 'success');
        navigate('dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Daily Drilling Report" onBack={() => navigate('dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Driller/Operator" value={user.name} disabled />
                    <SelectField label="Job / Rig" options={jobs.map(j => ({ value: j.id, label: j.name }))} value={jobId} onChange={e => setJobId(e.target.value)} required />
                    <InputField label="Drilling Depth (ft)" type="number" value={drillingDepth} onChange={e => setDrillingDepth(e.target.value)} required />
                    <InputField label="Mud Weight (ppg)" type="number" value={mudWeight} onChange={e => setMudWeight(e.target.value)} required />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Hourly Activity Log</h3>
                    <div className="space-y-2">
                        {hourlyLog.map((log, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="time" value={log.time} onChange={e => handleLogChange(index, 'time', e.target.value)} className="p-2 border rounded-md w-1/4" />
                                <input type="text" placeholder="Activity description..." value={log.activity} onChange={e => handleLogChange(index, 'activity', e.target.value)} className="p-2 border rounded-md flex-grow" />
                                <button type="button" onClick={() => removeLogEntry(index)} className="p-2 text-danger hover:bg-danger/10 rounded-full"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addLogEntry} className="mt-2 flex items-center text-sm text-primary hover:underline"><Plus className="w-4 h-4 mr-1"/> Add Log Entry</button>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Non-Productive Time (NPT)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="NPT Hours" type="number" value={nptHours} onChange={e => setNptHours(e.target.value)} placeholder="e.g., 2.5"/>
                        <InputField label="Reason for NPT" value={nptReason} onChange={e => setNptReason(e.target.value)} disabled={!nptHours || nptHours <= 0} />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                    <button type="button" onClick={() => navigate('dashboard')} className="px-6 py-2 border rounded-md">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md">Submit Report</button>
                </div>
            </form>
        </div>
    );
};

export default DailyDrillingReportPage;
