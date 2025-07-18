import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';
import { Plus, Trash2 } from 'lucide-react';

const JSAPage = () => {
    const { navigate, user, jobs, jsaTemplates, addSubmission, users, showNotification } = useContext(AppContext);
    
    const [selectedJobId, setSelectedJobId] = useState('');
    const [jsaTitle, setJsaTitle] = useState('');
    const [steps, setSteps] = useState([]);
    const [requiredSignatures, setRequiredSignatures] = useState([]);

    const handleTemplateChange = (e) => {
        const templateKey = e.target.value;
        if (!templateKey) {
            setJsaTitle('');
            setSteps([]);
            return;
        }
        const template = jsaTemplates[templateKey];
        setJsaTitle(template.title);
        setSteps(template.steps.map(step => ({...step, id: Date.now() + Math.random() })));
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        setSteps([...steps, { id: Date.now(), description: '', hazard: '', control: '' }]);
    };

    const removeStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newJSA = {
            id: `jsa_${Date.now()}`,
            jobId: selectedJobId,
            date: new Date().toISOString().split('T')[0],
            createdBy: user.id,
            status: 'Pending',
            title: jsaTitle,
            steps: steps,
            requiredSignatures: [user.id, ...requiredSignatures], // Creator is always required to sign
            signatures: [user.id], // Creator auto-signs
        };
        addSubmission('jsas', newJSA);
        showNotification("JSA submitted for approval.", "success");
        navigate('dashboard');
    };
    
    const technicians = users.filter(u => u.role === 'technician');

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="New Job Safety Analysis" onBack={() => navigate('dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField label="Job / Location" options={jobs.filter(j => j.status === 'Active').map(j => ({ value: j.id, label: j.name }))} value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)} required />
                    <SelectField label="Start from Template" options={Object.keys(jsaTemplates).map(k => ({ value: k, label: k }))} onChange={handleTemplateChange} />
                </div>
                
                <InputField label="JSA Title" value={jsaTitle} onChange={e => setJsaTitle(e.target.value)} placeholder="e.g., Routine Pump Maintenance" required />

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Analysis Steps</h3>
                    <div className="space-y-4">
                        {steps.length > 0 ? steps.map((step, index) => (
                            <div key={step.id} className="p-4 border border-border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                                <InputField label={`Step ${index + 1}: Action`} value={step.description} onChange={e => handleStepChange(index, 'description', e.target.value)} placeholder="e.g., Isolate pump" required />
                                <InputField label="Potential Hazard" value={step.hazard} onChange={e => handleStepChange(index, 'hazard', e.target.value)} placeholder="e.g., Stored pressure" required />
                                <InputField label="Control Measure" value={step.control} onChange={e => handleStepChange(index, 'control', e.target.value)} placeholder="e.g., LOTO, bleed valves" required />
                                <button type="button" onClick={() => removeStep(index)} className="absolute top-2 right-2 p-1 text-danger hover:bg-danger/10 rounded-full" title="Remove Step"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        )) : <p className="text-sm text-center text-text-secondary p-4 border border-dashed rounded-md">No steps added. Use a template or add steps manually.</p>}
                    </div>
                    <button type="button" onClick={addStep} className="mt-4 flex items-center px-3 py-1.5 border border-dashed border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted">
                        <Plus className="w-4 h-4 mr-2" /> Add Step
                    </button>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Required Signatures</h3>
                    <p className="text-sm text-text-secondary mb-2">Select all technicians who must sign this JSA. The creator is required by default.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {technicians.map(tech => (
                            <label key={tech.id} className="flex items-center space-x-2 p-2 border border-border rounded-md hover:bg-muted">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked={requiredSignatures.includes(tech.id)} onChange={(e) => { if (e.target.checked) { setRequiredSignatures([...requiredSignatures, tech.id]); } else { setRequiredSignatures(requiredSignatures.filter(id => id !== tech.id)); } }}/>
                                <span className="text-sm">{tech.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                    <button type="button" onClick={() => navigate('dashboard')} className="px-6 py-2 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">Submit for Approval</button>
                </div>
            </form>
        </div>
    );
};

export default JSAPage;
