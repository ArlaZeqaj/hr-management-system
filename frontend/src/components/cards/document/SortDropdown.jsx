/* components/SortDropdown.jsx */
import React from 'react';

const SortDropdown = ({ value, onChange }) => (
    <div className="documents-sort-dropdown">
        <select value={value} onChange={e => onChange(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="size-asc">Size (Smallest)</option>
            <option value="size-desc">Size (Largest)</option>
        </select>
    </div>
);

export default SortDropdown;