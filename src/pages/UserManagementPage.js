import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import { useSortableData } from '../hooks/useSortableData';
import { Search, ArrowUpDown } from 'lucide-react';

const SortableHeader = ({ children, requestSort, sortConfig, sortKey }) => {
    const isSorted = sortConfig && sortConfig.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
            <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 hover:text-text-primary" title={`Sort by ${sortKey}`}>
                {children}
                {isSorted ? (direction === 'ascending' ? '▲' : '▼') : <ArrowUpDown className="w-3 h-3" />}
            </button>
        </th>
    );
};

const UserManagementPage = ({ pageData }) => {
    const { navigate, users, updateUser } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (pageData?.prefillSearch) {
            setSearchTerm(pageData.prefillSearch);
        }
    }, [pageData]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        if (searchTerm === 'expiring') {
            const oneMonthFromNow = new Date(new Date().setMonth(new Date().getMonth() + 1));
            return users.filter(user => 
                user.certifications.some(cert => new Date(cert.expiry) < oneMonthFromNow)
            );
        }
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.teamId && user.teamId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    const { items: sortedUsers, requestSort, sortConfig } = useSortableData(filteredUsers, { key: 'name', direction: 'ascending' });

    const openEditModal = (user) => {
        setSelectedUser({ ...user });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (selectedUser) {
            updateUser(selectedUser.id, {
                role: selectedUser.role,
                rate: parseFloat(selectedUser.rate) || 0,
            });
        }
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="User Management" onBack={() => navigate('dashboard')}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search users or 'expiring'..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-border rounded-md bg-surface w-64"
                    />
                </div>
            </PageHeader>
            <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="name">Name</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="role">Role</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="rate">Rate</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="teamId">Team</SortableHeader>
                                <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${user.rate.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.teamId || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(user)} className="text-primary hover:text-primary/80">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit User: ${selectedUser?.name}`}>
                {selectedUser && (
                    <div className="space-y-4">
                        <SelectField
                            label="Role"
                            value={selectedUser.role}
                            onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}
                            options={[
                                { value: 'technician', label: 'Technician' },
                                { value: 'supervisor', label: 'Supervisor' },
                                { value: 'admin', label: 'Admin' },
                                { value: 'executive', label: 'Executive' },
                            ]}
                        />
                        <InputField
                            label="Hourly Rate"
                            type="number"
                            value={selectedUser.rate}
                            onChange={e => setSelectedUser({ ...selectedUser, rate: e.target.value })}
                        />
                        <div className="flex justify-end space-x-3 pt-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">Save Changes</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserManagementPage;
