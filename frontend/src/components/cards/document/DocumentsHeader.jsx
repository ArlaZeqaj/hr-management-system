/* components/DocumentsHeader.jsx */
import React from 'react';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';

const DocumentsHeader = ({ title, searchQuery, onSearchChange, sortOption, onSortChange, onGenerateSampleDocs }) => (
    <div className="documents-header">
        <h1>{title}</h1>
        <div className="documents-actions">
            <button className="generate-button" onClick={onGenerateSampleDocs}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Generate Sample Docs
            </button>

            <SearchBar value={searchQuery} onChange={onSearchChange} />
            <SortDropdown value={sortOption} onChange={onSortChange} />
        </div>
    </div>
);

export default DocumentsHeader;