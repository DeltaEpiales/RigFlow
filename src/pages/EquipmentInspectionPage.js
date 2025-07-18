import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import { Check, X, AlertTriangle } from 'lucide-react';

const EquipmentInspectionPage = () => {
    const { navigate, user, assets, inspectionChecklists, addSubmission, showNotification } = useContext(AppContext);

    const [assetId, setAssetId] = useState('');
    const [checklistResults, setChecklistResults] = useState({});
    const [notes, setNotes] = useState('');

    const selectedAsset = assets.find(a => a.id === assetId);
    const checklist = selectedAsset ? (inspectionChecklists[selectedAsset.type] || []) : [];
    
    const handleResultChange = (checkId, result) => {
        setChecklistResults(prev => ({...prev, [checkId]: result}));
    };
    
    const allPassed = checklist.every(c => checklistResults[c.id] === 'pass');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newInspection = {
            id: `insp_${Date.now()}`,
            assetId,
            date: new Date().toISOString().split('T')[0],
            createdBy: user.id,
            status: allPassed ? 'Approved' : 'Pending Review', // Auto-approve if all pass
            results: checklistResults,
            notes,
        };
        addSubmission('equipmentInspections', newInspection);
        showNotification(`Inspection for ${selectedAsset.name} submitted.`, 'success');
        navigate('dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Equipment Inspection" onBack={() => navigate('dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Inspector" value={user.name} disabled />
                    <SelectField 
                        label="Select Equipment" 
                        options={assets.map(a => ({ value: a.id, label: `${a.name} (${a.type})` }))} 
                        value={assetId}
                        onChange={e => setAssetId(e.target.value)}
                        required 
                    />
                </div>
                
                {selectedAsset && (
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Inspection Checklist for {selectedAsset.type}</h3>
                        <div className="space-y-3 p-4 border rounded-lg">
                            {checklist.map(check => (
                                <div key={check.id} className="grid grid-cols-3 gap-4 items-center">
                                    <p className="col-span-2 text-sm">{check.text}</p>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => handleResultChange(check.id, 'pass')} className={`p-2 rounded-full ${checklistResults[check.id] === 'pass' ? 'bg-success text-white' : 'bg-muted'}`}><Check/></button>
                                        <button type="button" onClick={() => handleResultChange(check.id, 'fail')} className={`p-2 rounded-full ${checklistResults[check.id] === 'fail' ? 'bg-danger text-white' : 'bg-muted'}`}><X/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!allPassed && selectedAsset && (
                    <div>
                         <label className="block text-sm font-medium text-text-secondary mb-1">Notes for Failed Items</label>
                         <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" className="w-full p-2 border rounded-md" placeholder="Explain any failed items and required actions..."></textarea>
                    </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                    <button type="button" onClick={() => navigate('dashboard')} className="px-6 py-2 border rounded-md">Cancel</button>
                    <button type="submit" disabled={!selectedAsset || Object.keys(checklistResults).length !== checklist.length} className="px-6 py-2 bg-primary text-white rounded-md disabled:bg-muted disabled:cursor-not-allowed">Submit Inspection</button>
                </div>
            </form>
        </div>
    );
};

// Dummy InputField component if not already defined globally
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input className="block w-full px-3 py-2 bg-surface border border-border rounded-md shadow-sm sm:text-sm disabled:bg-muted" {...props} />
    </div>
);

export default EquipmentInspectionPage;
