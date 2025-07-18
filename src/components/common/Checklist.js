import React from 'react';

const Checklist = ({ items, checkedItems, onToggle }) => (
    <div className="space-y-2">
        {items.map(item => (
            <label key={item.id} className="flex items-center p-3 border border-border rounded-md hover:bg-muted cursor-pointer">
                <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-3 text-sm font-medium text-text-primary">{item.label}</span>
            </label>
        ))}
    </div>
);

export default Checklist;
