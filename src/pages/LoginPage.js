import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import SelectField from '../components/common/SelectField';
import { Edit } from 'lucide-react';

const LoginPage = () => {
    const { login, users } = useContext(AppContext);
    const [selectedUserId, setSelectedUserId] = useState(users.find(u => u.role === 'executive')?.id || users[0]?.id || '');

    const handleLogin = (e) => {
        e.preventDefault();
        if (selectedUserId) login(selectedUserId);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                       <Edit className="w-12 h-12 text-blue-600" />
                       <h1 className="ml-3 text-4xl font-bold text-gray-800 tracking-tight">RigFlow</h1>
                    </div>
                    <p className="text-gray-500">Digital Field Operations, Unified.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <SelectField 
                        label="Select User Persona" 
                        options={users.map(u => ({ value: u.id, label: `${u.name} (${u.role.charAt(0).toUpperCase() + u.role.slice(1)})` }))} 
                        value={selectedUserId} 
                        onChange={e => setSelectedUserId(e.target.value)} 
                    />
                    <button type="submit" disabled={!selectedUserId} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105">
                        Sign In
                    </button>
                </form>
                 <p className="mt-4 text-center text-xs text-gray-400">This is a prototype. Select a user to simulate login.</p>
            </div>
        </div>
    );
};

export default LoginPage;
