import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import InputField from '../components/common/InputField';
import Checklist from '../components/common/Checklist';

const INSPECTION_ITEMS = [
    { id: 'tires', label: 'Tires and Wheels' },
    { id: 'brakes', label: 'Brakes and Air System' },
    { id: 'lights', label: 'Lights and Reflectors' },
    { id: 'steering', label: 'Steering Mechanism' },
    { id: 'horn', label: 'Horn' },
    { id: 'fluids', label: 'Fluid Levels (Oil, Coolant, etc.)' },
    { id: 'safety', label: 'Safety Equipment (Fire Ext., Triangles)' },
];

const DVIRPage = () => {
    const { navigate, user, addSubmission, showNotification } = useContext(AppContext);
    
    const [vehicleId, setVehicleId] = useState('');
    const [odometer, setOdometer] = useState('');
    const [defects, setDefects] = useState([]);
    const [remarks, setRemarks] = useState('');
    const [defectsFound, setDefectsFound] = useState(false);

    const toggleDefect = (itemId) => {
        setDefects(prev => 
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDVIR = {
            id: `dvir_${Date.now()}`,
            userId: user.id,
            vehicleId,
            date: new Date().toISOString().split('T')[0],
            odometer: parseFloat(odometer),
            defects: defectsFound ? defects.map(id => INSPECTION_ITEMS.find(i => i.id === id)?.label) : [],
            remarks,
            signed: true,
            status: 'Pending Review'
        };

        addSubmission('dvirs', newDVIR);
        showNotification("DVIR submitted successfully.", "success");
        navigate('dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Daily Vehicle Inspection Report" onBack={() => navigate('dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border border-border space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                    <InputField label="Technician Name" value={user.name} disabled />
                    <InputField label="Date" type="date" value={new Date().toISOString().split('T')[0]} disabled />
                    <InputField label="Vehicle ID / Unit #" value={vehicleId} onChange={e => setVehicleId(e.target.value)} placeholder="e.g., Truck 150" required />
                    <InputField label="Odometer Reading" type="number" value={odometer} onChange={e => setOdometer(e.target.value)} placeholder="e.g., 123456" required />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Vehicle Condition</h3>
                     <div className="flex items-center space-x-4 mb-4">
                        <p className="text-sm font-medium text-text-secondary">Are there any defects?</p>
                        <button type="button" onClick={() => setDefectsFound(false)} className={`px-4 py-1 rounded-md text-sm ${!defectsFound ? 'bg-primary text-white' : 'bg-muted text-text-primary'}`}>No Defects</button>
                        <button type="button" onClick={() => setDefectsFound(true)} className={`px-4 py-1 rounded-md text-sm ${defectsFound ? 'bg-danger text-white' : 'bg-muted text-text-primary'}`}>Defects Found</button>
                    </div>

                    {defectsFound && (
                        <div>
                            <p className="text-sm text-text-secondary mb-2">Check all items below that have defects.</p>
                            <Checklist items={INSPECTION_ITEMS} checkedItems={defects} onToggle={toggleDefect} />
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Remarks</h3>
                     <textarea
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        rows="3"
                        className="mt-2 block w-full px-3 py-2 bg-surface border border-border rounded-md shadow-sm placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
                        placeholder="Explain any defects found or add other notes..."
                    ></textarea>
                </div>
                
                <div className="pt-4 border-t border-border">
                    <p className="text-xs text-text-secondary mb-4">By submitting this form, I certify that this vehicle has been inspected in accordance with all applicable regulations.</p>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => navigate('dashboard')} className="px-6 py-2 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-muted">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">Sign and Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DVIRPage;
