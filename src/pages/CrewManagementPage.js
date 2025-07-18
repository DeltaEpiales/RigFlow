import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import { Users, UserPlus, Trash2 } from 'lucide-react';

const CrewManagementPage = () => {
    const { navigate, crews, users, addSubmission } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const technicians = useMemo(() => users.filter(u => u.role === 'technician'), [users]);
    const supervisors = useMemo(() => users.filter(u => u.role === 'supervisor'), [users]);

    const [newCrew, setNewCrew] = useState({
        name: '',
        leaderId: '',
        memberIds: []
    });

    const handleCreateCrew = () => {
        if (!newCrew.name || !newCrew.leaderId) {
            alert('Crew Name and Leader are required.');
            return;
        }
        addSubmission('crews', { id: `crew_${Date.now()}`, ...newCrew });
        setIsModalOpen(false);
        setNewCrew({ name: '', leaderId: '', memberIds: [] });
    };

    const handleMemberToggle = (techId) => {
        setNewCrew(prev => ({
            ...prev,
            memberIds: prev.memberIds.includes(techId) 
                ? prev.memberIds.filter(id => id !== techId)
                : [...prev.memberIds, techId]
        }));
    };

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Crew Management" onBack={() => navigate('dashboard')}>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" /> Create New Crew
                </button>
            </PageHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crews.map(crew => {
                    const leader = users.find(u => u.id === crew.leaderId);
                    const members = users.filter(u => crew.memberIds.includes(u.id));
                    return (
                        <div key={crew.id} className="bg-surface p-6 rounded-lg shadow-md border border-border">
                            <h3 className="text-lg font-semibold text-text-primary">{crew.name}</h3>
                            <p className="text-sm text-text-secondary mb-4">Led by: {leader?.name || 'N/A'}</p>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-xs uppercase tracking-wider">Members</h4>
                                {members.map(member => (
                                    <div key={member.id} className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-text-secondary"/> {member.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Crew">
                <div className="space-y-4">
                    <InputField 
                        label="Crew Name"
                        value={newCrew.name}
                        onChange={e => setNewCrew({...newCrew, name: e.target.value})}
                        placeholder="e.g., Alpha Rigging Crew"
                    />
                    <SelectField 
                        label="Crew Leader"
                        value={newCrew.leaderId}
                        onChange={e => setNewCrew({...newCrew, leaderId: e.target.value})}
                        options={supervisors.map(s => ({ value: s.id, label: s.name }))}
                    />
                    <div>
                        <h4 className="font-semibold mb-2">Select Technicians</h4>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                            {technicians.map(tech => (
                                <label key={tech.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={newCrew.memberIds.includes(tech.id)}
                                        onChange={() => handleMemberToggle(tech.id)}
                                    />
                                    {tech.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                    <button onClick={handleCreateCrew} className="px-4 py-2 bg-primary text-white rounded-md">Create Crew</button>
                </div>
            </Modal>
        </div>
    );
};

export default CrewManagementPage;
