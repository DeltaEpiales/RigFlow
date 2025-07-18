import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import { useSortableData } from '../hooks/useSortableData';
import { Search, ArrowUpDown, Warehouse, Truck } from 'lucide-react';

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

const InventoryManagementPage = () => {
    const { navigate, inventory, users } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('all');

    const getLocationName = (locationId) => {
        if (locationId === 'main_wh') return 'Main Warehouse';
        return users.find(u => u.id === locationId)?.name + "'s Truck" || locationId;
    };
    
    const locationIcon = (locationId) => {
        if(locationId === 'main_wh') return <Warehouse className="w-5 h-5 text-text-secondary" title="Main Warehouse"/>;
        return <Truck className="w-5 h-5 text-text-secondary" title="Technician Vehicle"/>
    }

    const enrichedInventory = useMemo(() => inventory.map(item => ({
        ...item,
        locationName: getLocationName(item.locationId),
    })), [inventory, users]);

    const filteredInventory = useMemo(() => {
        return enrichedInventory.filter(item => {
            const matchesSearch = !searchTerm ||
                item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesLocation = filterLocation === 'all' || item.locationId === filterLocation;

            return matchesSearch && matchesLocation;
        });
    }, [enrichedInventory, searchTerm, filterLocation]);
    
    const uniqueLocations = useMemo(() => {
        const locations = new Set(inventory.map(i => i.locationId));
        return Array.from(locations).map(id => ({ value: id, label: getLocationName(id) }));
    }, [inventory, users]);

    const { items: sortedInventory, requestSort, sortConfig } = useSortableData(filteredInventory);

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Inventory Control" onBack={() => navigate('dashboard')}>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search parts..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-border rounded-md bg-surface w-64"
                        />
                    </div>
                     <select onChange={(e) => setFilterLocation(e.target.value)} value={filterLocation} className="px-3 py-2 border border-border bg-surface rounded-md shadow-sm sm:text-sm">
                        <option value="all">All Locations</option>
                        {uniqueLocations.map(loc => <option key={loc.value} value={loc.value}>{loc.label}</option>)}
                    </select>
                </div>
            </PageHeader>
            <div className="bg-surface p-6 rounded-lg shadow-md border border-border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="partNumber">Part Number</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="description">Description</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="locationName">Location</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="quantity">On Hand</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="minLevel">Min Stock</SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortedInventory.map(item => (
                                <tr key={`${item.partNumber}-${item.locationId}`} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-text-primary">{item.partNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{item.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary flex items-center gap-2">
                                        {locationIcon(item.locationId)} {item.locationName}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.quantity < item.minLevel ? 'text-danger' : 'text-text-primary'}`}>
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{item.minLevel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagementPage;
