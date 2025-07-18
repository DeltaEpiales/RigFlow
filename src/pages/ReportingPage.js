import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import { useSortableData } from '../hooks/useSortableData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpDown, Filter } from 'lucide-react';

const DATA_SOURCES = {
    timesheets: { label: 'Timesheets', fields: ['id', 'userId', 'jobId', 'date', 'status', 'dayHours', 'nightHours'] },
    expenses: { label: 'Expenses', fields: ['id', 'userId', 'jobId', 'date', 'category', 'vendor', 'amount', 'status'] },
    jobs: { label: 'Jobs', fields: ['id', 'customerId', 'name', 'location', 'status', 'requiredPersonnel'] },
};

const SortableHeader = ({ children, requestSort, sortConfig, sortKey }) => {
    const isSorted = sortConfig && sortConfig.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;
    return (
        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
            <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 hover:text-text-primary">
                {children}
                {isSorted ? (direction === 'ascending' ? '▲' : '▼') : <ArrowUpDown className="w-3 h-3" />}
            </button>
        </th>
    );
};

const ReportingPage = () => {
    const context = useContext(AppContext);
    const { navigate } = context;

    const [dataSourceKey, setDataSourceKey] = useState('timesheets');
    const [selectedFields, setSelectedFields] = useState(DATA_SOURCES.timesheets.fields);
    const [filterField, setFilterField] = useState('status');
    const [filterValue, setFilterValue] = useState('');

    const handleDataSourceChange = (key) => {
        setDataSourceKey(key);
        setSelectedFields(DATA_SOURCES[key].fields);
        setFilterField(DATA_SOURCES[key].fields[0]);
        setFilterValue('');
    };

    const handleFieldToggle = (field) => {
        setSelectedFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);
    };

    const rawData = context[dataSourceKey] || [];
    
    const filteredData = useMemo(() => {
        if (!filterValue) return rawData;
        return rawData.filter(row => String(row[filterField]).toLowerCase().includes(filterValue.toLowerCase()));
    }, [rawData, filterField, filterValue]);

    const { items: sortedData, requestSort, sortConfig } = useSortableData(filteredData);
    
    const chartData = useMemo(() => {
        if (dataSourceKey !== 'expenses' && dataSourceKey !== 'timesheets') return [];

        const groupKey = dataSourceKey === 'expenses' ? 'category' : 'userId';
        const valueKey = dataSourceKey === 'expenses' ? 'amount' : 'dayHours';
        
        const nameMap = context.users.reduce((acc, user) => ({...acc, [user.id]: user.name}), {});

        return Object.entries(
            filteredData.reduce((acc, item) => {
                const key = item[groupKey];
                const value = parseFloat(item[valueKey]) || 0;
                acc[key] = (acc[key] || 0) + value;
                return acc;
            }, {})
        ).map(([name, value]) => ({ name: dataSourceKey === 'timesheets' ? (nameMap[name] || name) : name, value }));

    }, [filteredData, dataSourceKey, context.users]);


    return (
        <div className="max-w-full mx-auto">
            <PageHeader title="Reporting & Analytics" onBack={() => navigate('dashboard')} />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* --- CONTROLS --- */}
                <div className="lg:col-span-1 bg-surface p-4 rounded-lg shadow-md border space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">1. Select Data Source</h3>
                        <div className="flex flex-col space-y-1">
                        {Object.entries(DATA_SOURCES).map(([key, {label}]) => (
                            <button key={key} onClick={() => handleDataSourceChange(key)} className={`text-left p-2 rounded-md text-sm ${key === dataSourceKey ? 'bg-primary text-white' : 'hover:bg-muted'}`}>
                                {label}
                            </button>
                        ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">2. Choose Fields</h3>
                        <div className="grid grid-cols-2 gap-2">
                        {DATA_SOURCES[dataSourceKey].fields.map(field => (
                            <label key={field} className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" checked={selectedFields.includes(field)} onChange={() => handleFieldToggle(field)} />
                                <span>{field}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2"><Filter className="w-4 h-4"/> 3. Filter Data</h3>
                        <div className="flex gap-2">
                           <select value={filterField} onChange={e => setFilterField(e.target.value)} className="flex-1 p-2 border rounded-md text-sm">
                                {DATA_SOURCES[dataSourceKey].fields.map(f => <option key={f} value={f}>{f}</option>)}
                           </select>
                           <input type="text" placeholder="contains..." value={filterValue} onChange={e => setFilterValue(e.target.value)} className="flex-1 p-2 border rounded-md text-sm"/>
                        </div>
                    </div>
                </div>

                {/* --- RESULTS --- */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-surface p-4 rounded-lg shadow-md border">
                        <h3 className="font-semibold mb-2">Report Results ({sortedData.length} rows)</h3>
                        <div className="overflow-x-auto max-h-[300px]">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr>{selectedFields.map(f => <SortableHeader key={f} requestSort={requestSort} sortConfig={sortConfig} sortKey={f}>{f}</SortableHeader>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {sortedData.map((row, idx) => (
                                    <tr key={row.id || idx}>
                                        {selectedFields.map(field => <td key={field} className="px-4 py-2 whitespace-nowrap">{String(row[field])}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    {(dataSourceKey === 'expenses' || dataSourceKey === 'timesheets') && <div className="bg-surface p-4 rounded-lg shadow-md border">
                         <h3 className="font-semibold mb-2">Chart</h3>
                         <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="var(--primary)" />
                            </BarChart>
                         </ResponsiveContainer>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default ReportingPage;
