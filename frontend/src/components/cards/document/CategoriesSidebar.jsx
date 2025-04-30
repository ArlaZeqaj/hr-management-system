import React from 'react';
// Document categories
const categories = [
    'All Documents',
    'Company Policies',
    'Payroll',
    'Contracts',
    'Training Materials',
    'Personal Documents'
];
const CategoriesSidebar = ({ categories, selectedCategory, onSelect }) => (
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
                </li>
            ))}
        </ul>
    </div>
);

export default CategoriesSidebar;
