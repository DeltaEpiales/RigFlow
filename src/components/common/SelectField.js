import React from 'react';

const SelectField = ({ label, options, onChange, value, placeholder = "Select...", disabled=false, required=false, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
        <select 
            onChange={onChange} 
            value={value} 
            disabled={disabled} 
            required={required}
            {...props}
            className="block w-full px-3 py-2 border border-border bg-surface rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm disabled:bg-muted disabled:cursor-not-allowed"
        >
            <option value="">{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

export default SelectField;
