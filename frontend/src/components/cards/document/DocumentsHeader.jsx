/* components/DocumentsHeader.jsx */
import React from 'react';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';

const DocumentsHeader = ({ title, searchQuery, onSearchChange, sortOption, onSortChange,onGenerateSampleDocs }) => (
    <div className="documents-header">
        <h1>{title}</h1>
        <div className="documents-actions">
            <button className="generate-button" onClick={onGenerateSampleDocs}>
                Generate Sample Docs
            </button>

            <SearchBar value={searchQuery} onChange={onSearchChange} />
            <SortDropdown value={sortOption} onChange={onSortChange} />
        </div>
    </div>
);

export default DocumentsHeader;