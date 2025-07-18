import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import Modal from '../components/common/Modal';
import { useSortableData } from '../hooks/useSortableData';
import { Eye, Search, ArrowUpDown, CheckCircle } from 'lucide-react';

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

const ProjectControlPage = () => {
    const { navigate, jobs, customers, user, updateJob } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobToComplete, setJobToComplete] = useState(null);

    const getCustomerName = (customerId) => customers.find(c => c.id === customerId)?.name || 'N/A';
    
    const canManage = user.role === 'supervisor' || user.role === 'admin' || user.role === 'executive';

    const searchableJobs = React.useMemo(() => jobs.map(job => ({
        ...job,
        customerName: getCustomerName(job.customerId)
    })), [jobs, customers]);

    const filteredJobs = React.useMemo(() => {
        if (!searchTerm) return searchableJobs;
        return searchableJobs.filter(job =>
            job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchableJobs, searchTerm]);

    const { items: sortedJobs, requestSort, sortConfig } = useSortableData(filteredJobs, { key: 'name', direction: 'ascending' });

    const handleCompleteJob = () => {
        if (jobToComplete) {
            updateJob(jobToComplete.id, { status: 'Completed' });
            setJobToComplete(null);
        }
    };

    const statusColors = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        Completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Project Control" onBack={() => navigate('dashboard')}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
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
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="name">Job Name</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="customerName">Customer</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="location">Location</SortableHeader>
                                <SortableHeader requestSort={requestSort} sortConfig={sortConfig} sortKey="status">Status</SortableHeader>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortedJobs.map(job => (
                                <tr key={job.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{job.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{job.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{job.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[job.status]}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-4">
                                        <button onClick={() => navigate('job_detail', { jobId: job.id })} className="text-primary hover:text-primary/80 flex items-center" title="View Details">
                                            <Eye className="w-4 h-4 mr-1"/> View Details
                                        </button>
                                        {canManage && job.status === 'Active' && (
                                            <button onClick={() => setJobToComplete(job)} className="text-success hover:text-success/80 flex items-center" title="Complete Job">
                                                <CheckCircle className="w-4 h-4 mr-1" /> Complete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={!!jobToComplete} onClose={() => setJobToComplete(null)} title="Confirm Job Completion">
                <div>
                    <p>Are you sure you want to mark the job "<strong>{jobToComplete?.name}</strong>" as completed? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => setJobToComplete(null)} className="px-4 py-2 border rounded-md">Cancel</button>
                        <button onClick={handleCompleteJob} className="px-4 py-2 bg-primary text-white rounded-md">Confirm</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProjectControlPage;
