import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SortableTableHeader = ({ children, requestSort, sortConfig, sortKey }) => {
    const isSorted = sortConfig && sortConfig.key === sortKey;
    const direction = isSorted ? sortConfig.direction : undefined;
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
            <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 hover:text-text-primary" title={`Sort by ${children}`}>
                {children}
                <span className="opacity-50">
                    {isSorted ? (direction === 'ascending' ? '▲' : '▼') : <ArrowUpDown className="w-3 h-3" />}
                </span>
            </button>
        </th>
    );
};

export default SortableTableHeader;