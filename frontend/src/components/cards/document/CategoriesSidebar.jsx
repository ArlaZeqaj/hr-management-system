import React from 'react';

const CategoriesSidebar = ({ 
    categories, 
    selectedCategory, 
    onSelect,
    documentCounts // New prop for document counts
}) => (
    <div className="categories-sidebar">
        <h3>Categories</h3>
        <ul>
            {categories.map(cat => (
                <li
                    key={cat}
                    className={selectedCategory === cat ? 'active' : ''}
                    onClick={() => onSelect(cat)}
                >
                    {cat}
                    {documentCounts && documentCounts[cat] !== undefined && (
                        <span className="tab-badge-c">{documentCounts[cat]}</span>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

export default CategoriesSidebar;