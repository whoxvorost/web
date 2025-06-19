import React from 'react';

interface SelectFilterProps {
    label: string;
    options: { value: string | number, label: string }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ label, options, onChange }) => {
    return (
        <label>
            {label}:
            <select onChange={onChange}>
                <option value="">Select a {label.toLowerCase()}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};

export default SelectFilter;