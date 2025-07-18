import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import { useSortableData } from '../hooks/useSortableData';
import { Search, ArrowUpDown, HardHat, Truck } from 'lucide-react';

const SortableHeader = ({ children, requestSort, sortConfig, sortKey }) => {
    const isSorted = sortConfig && sortConfig.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
            <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 hover:text-text-primary">
                {children}
                {isSorted ? (direction === 'ascending' ? '▲' : '▼') : <ArrowUpDown className="w-3 h-3" />}
            </button>
        </th>
    );
};

const AssetRegistryPage = () => {
    const { navigate, assets, users } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getAssignedUser = (userId) => users.find(u => u.id === userId)?.name || 'N/A';

    const enrichedAssets = useMemo(() => assets.map(asset => ({
        ...asset,
        assignedToName: getAssignedUser(asset.assignedTo),
    })), [assets, users]);

    const filteredAssets = useMemo(() => {
        if (!searchTerm) return enrichedAssets;
        return enrichedAssets.filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [enrichedAssets, searchTerm]);

    const { items: sortedAssets, requestSort, sortConfig } = useSortableData(filteredAssets);

    const openDetailsModal = (asset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const statusColors = {
        Active: 'bg-green-100 text-green-800',
        'Down for Repair': 'bg-red-100 text-red-800',
        'Awaiting Decommissioning': 'bg-gray-100 text-gray-800',
        'In Storage': 'bg-blue-100 text-blue-800'
    };
    
    const assetIcons = {
        'Vehicle': <Truck className="w-5 h-5 text-text-secondary"/>,
        'Heavy Equipment': <HardHat className="w-5 h-5 text-text-secondary"/>,
    }

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Asset Registry" onBack={() => navigate('dashboard')}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search assets..."
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
                                <th scope="col" className="px-6 py-3"></th>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="name">Asset Name</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="type">Type</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="status">Status</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="assignedToName">Assigned To</SortableHeader>
                                <th className="relative px-6 py-3"><span className="sr-only">Details</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortedAssets.map(asset => (
                                <tr key={asset.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4">{assetIcons[asset.type] || <HardHat className="w-5 h-5 text-text-secondary"/>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{asset.name} <p className="font-mono text-xs text-text-secondary">{asset.id}</p></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{asset.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[asset.status]}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{asset.assignedToName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openDetailsModal(asset)} className="text-primary hover:text-primary/80">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Asset Details: ${selectedAsset?.name}`}>
                {selectedAsset && (
                    <div className="space-y-4">
                        <p><strong>ID:</strong> {selectedAsset.id}</p>
                        <p><strong>Type:</strong> {selectedAsset.type}</p>
                        <p><strong>Manufacturer:</strong> {selectedAsset.manufacturer}</p>
                        <p><strong>Model:</strong> {selectedAsset.model}</p>
                        <p><strong>Serial Number:</strong> {selectedAsset.serialNumber}</p>
                        <p><strong>Status:</strong> {selectedAsset.status}</p>
                        <p><strong>Assigned To:</strong> {selectedAsset.assignedToName}</p>
                        <h4 className="font-semibold pt-4 border-t">Service History</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {selectedAsset.serviceHistory.map(entry => (
                                <li key={entry.date}>{entry.date}: {entry.description} (Work Order: {entry.workOrder})</li>
                            ))}
                        </ul>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md text-sm font-medium">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AssetRegistryPage;
