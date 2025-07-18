import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
// --- FIX: Replaced 'Tool' with the correct icon name 'Wrench' ---
import { ChevronDown, BarChart2, Edit, Clock, DollarSign, Shield, Truck, AlertTriangle, History, CheckSquare, Calendar, Users, Briefcase, Clipboard, Map, FileText, Package, Warehouse, LineChart, Wrench } from 'lucide-react';

const NavLink = ({ item, navigate, currentPage }) => (
    <a href="#" onClick={(e) => { e.preventDefault(); navigate(item.page); }}
        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
            currentPage === item.page
            ? 'bg-sky-600 text-white'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}>
        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="flex-grow">{item.name}</span>
    </a>
);

const NavSection = ({ section, navigate, currentPage }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-xs font-bold uppercase text-slate-400 tracking-wider hover:bg-slate-700/50 rounded-md"
            >
                {section.title}
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-1 space-y-1 ml-2 border-l border-slate-600 pl-2">
                    {section.children.map(item => (
                        <NavLink key={item.page} item={item} navigate={navigate} currentPage={currentPage} />
                    ))}
                </div>
            )}
        </div>
    );
}

const Sidebar = () => {
    const { user, page, navigate } = useContext(AppContext);

    const navStructure = {
        technician: [
            { title: "General", children: [{ name: 'Dashboard', icon: BarChart2, page: 'dashboard' }, { name: 'My Submissions', icon: History, page: 'submissions' }] },
            {
                title: "Field Forms",
                children: [
                    { name: 'Daily Timesheet', icon: Clock, page: 'timesheet' },
                    { name: 'Expense Report', icon: DollarSign, page: 'expense' },
                    { name: 'Job Safety Analysis', icon: Shield, page: 'jsa' },
                    { name: 'Drilling Report', icon: Edit, page: 'drilling_report' },
                    // --- FIX: Replaced 'Tool' with 'Wrench' ---
                    { name: 'Equipment Inspection', icon: Wrench, page: 'equipment_inspection'},
                    { name: 'Vehicle Inspection', icon: Truck, page: 'dvir' },
                    { name: 'Incident Report', icon: AlertTriangle, page: 'incident_report' },
                ]
            },
        ],
        supervisor: [
             { title: "General", children: [{ name: 'Dashboard', icon: BarChart2, page: 'dashboard' }, { name: 'My Submissions', icon: History, page: 'submissions' }] },
             {
                title: "Field Forms",
                children: [
                    { name: 'Daily Timesheet', icon: Clock, page: 'timesheet' },
                    { name: 'Expense Report', icon: DollarSign, page: 'expense' },
                    { name: 'Job Safety Analysis', icon: Shield, page: 'jsa' },
                    { name: 'Drilling Report', icon: Edit, page: 'drilling_report' },
                    { name: 'Equipment Inspection', icon: Wrench, page: 'equipment_inspection'},
                    { name: 'Vehicle Inspection', icon: Truck, page: 'dvir' },
                    { name: 'Incident Report', icon: AlertTriangle, page: 'incident_report' },
                ]
            },
            {
                title: "Planning & Dispatch",
                children: [
                    { name: 'Team Schedule', icon: Calendar, page: 'schedule' },
                    { name: 'Crew Management', icon: Users, page: 'crews' },
                ]
            },
            {
                title: "Management",
                children: [
                    { name: 'Approvals', icon: CheckSquare, page: 'approvals' },
                    { name: 'Project Control', icon: Clipboard, page: 'projects' },
                    { name: 'Field Tickets', icon: Briefcase, page: 'field_tickets' },
                    { name: 'Reporting', icon: LineChart, page: 'reporting' },
                ]
            }
        ],
        admin: [
            { title: "General", children: [{ name: 'Dashboard', icon: BarChart2, page: 'dashboard' }] },
            {
                title: "Oversight",
                children: [
                    { name: 'Project Control', icon: Clipboard, page: 'projects' },
                    { name: 'Job Map', icon: Map, page: 'map' },
                    { name: 'Reporting', icon: LineChart, page: 'reporting' },
                ]
            },
            {
                title: "Workflow",
                children: [
                    { name: 'Approvals', icon: CheckSquare, page: 'approvals' },
                    { name: 'Field Tickets', icon: Briefcase, page: 'field_tickets' },
                    { name: 'Invoicing', icon: FileText, page: 'invoicing' },
                ]
            },
            {
                title: "Resource Management",
                children: [
                    { name: 'Team Schedule', icon: Calendar, page: 'schedule' },
                    { name: 'Crew Management', icon: Users, page: 'crews' },
                    { name: 'User Management', icon: Users, page: 'users' },
                    { name: 'Asset Registry', icon: Package, page: 'assets' },
                    { name: 'Inventory Control', icon: Warehouse, page: 'inventory' },
                ]
            }
        ],
        executive: [],
    };
    navStructure.executive = navStructure.admin; // Executive sees all

    const userNav = navStructure[user.role] || [];

    return (
        <div className="hidden md:flex flex-col w-64 bg-slate-800 text-slate-100 no-print">
            <div className="flex items-center justify-center h-20 border-b border-slate-700 flex-shrink-0">
                <Edit className="w-8 h-8 text-sky-400" />
                <span className="ml-3 text-2xl font-bold">RigFlow</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
                {userNav.map(section => (
                    <NavSection key={section.title} section={section} navigate={navigate} currentPage={page} />
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;