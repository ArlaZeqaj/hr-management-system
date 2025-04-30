
/* components/SearchBar.jsx */
import React from 'react';

const SearchBar = ({ value, onChange }) => (
    <div className="documents-search-bar">
        <input
            type="text"
            placeholder="Search documents..."
            value={value}
            onChange={e => onChange(e.target.value)}
        />
        {/* SVG icon can stay inline or be imported */}
    </div>
);

export default SearchBar;