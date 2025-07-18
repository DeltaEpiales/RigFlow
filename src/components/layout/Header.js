import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Settings, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';

const Header = () => {
    const { user, logout, navigate } = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="flex items-center justify-between p-4 bg-surface border-b border-border shadow-sm no-print">
            <h1 className="text-xl font-semibold text-text-primary">RigFlow Digital Operations</h1>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-muted transition-colors">
                        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="hidden md:block text-right">
                            <p className="font-semibold text-sm text-text-primary">{user.name}</p>
                            <p className="text-xs text-text-secondary">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-lg py-2 z-50 border border-border">
                            <div className="px-4 py-2 border-b border-border">
                                <p className="font-semibold text-sm text-text-primary">{user.name}</p>
                                <p className="text-xs text-text-secondary">{user.id}</p>
                            </div>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('settings'); setDropdownOpen(false); }} className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-muted">
                                <Settings className="w-4 h-4 mr-3" /> Settings
                            </a>
                            <div className="border-t border-border mt-2 pt-2">
                                <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="flex items-center px-4 py-2 text-sm text-danger hover:bg-red-500/10">
                                    <LogOut className="w-4 h-4 mr-3" /> Logout
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
