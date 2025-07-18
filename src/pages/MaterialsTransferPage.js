import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';
import { Plus, Trash2 } from 'lucide-react';

const MaterialsTransferPage = () => {
    const { navigate, user, jobs, inventory, addSubmission, showNotification } = useContext(AppContext);
    
    const [toLocation, setToLocation] = useState('');
    const [items, setItems] = useState([{ partNumber: '', quantity: 1 }]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { partNumber: '', quantity: 1 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        addSubmission('materialsTransfers', {
            id: `mt_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            from: 'main_wh', // Assuming all transfers are from the main warehouse for this UI
            to: toLocation,
            items,
            createdBy: user.id,
            status: 'Completed',
        });
        showNotification('Materials transfer logged.', 'success');
        navigate('dashboard');
    };

    const availableParts = [...new Map(inventory.map(item => [item['partNumber'], item])).values()];

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Bill of Lading / Materials Transfer" onBack={() => navigate('dashboard')} />
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg shadow-md border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Transfer From" value="Main Warehouse" disabled />
                    <SelectField label="Transfer To Job Site" options={jobs.map(j => ({ value: j.id, label: j.name }))} value={toLocation} onChange={e => setToLocation(e.target.value)} required />
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Items to Transfer</h3>
                    <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                           <SelectField options={availableParts.map(p => ({value: p.partNumber, label: `${p.partNumber} - ${p.description}`}))} value={item.partNumber} onChange={e => handleItemChange(index, 'partNumber', e.target.value)} />
                           <InputField type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
                           <button type="button" onClick={() => removeItem(index)} className="p-2 text-danger"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    </div>
                    <button type="button" onClick={addItem} className="mt-2 text-sm text-primary flex items-center"><Plus size={16} className="mr-1"/>Add Item</button>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md">Confirm Transfer</button>
                </div>
            </form>
        </div>
    );
};

export default MaterialsTransferPage;
