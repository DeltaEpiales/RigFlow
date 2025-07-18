import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, disabled, placeholder, required = false, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            disabled={disabled} 
            placeholder={placeholder}
            required={required}
            {...props}
            className="block w-full px-3 py-2 bg-surface border border-border rounded-md shadow-sm placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm disabled:bg-muted disabled:cursor-not-allowed"
        />
    </div>
);

export default InputField;
