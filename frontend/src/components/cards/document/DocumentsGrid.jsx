import React from 'react';
import DocumentCard from './DocumentCard';
import NoDocuments from './NoDocuments';

const DocumentsGrid = ({ documents, ...handlers }) => (
    documents.length > 0 ? (
        <div className="documents-grid">
            {documents.map(doc => (
                <DocumentCard key={doc.id} doc={doc} {...handlers} />
            ))}
        </div>
    ) : <NoDocuments />
);

export default DocumentsGrid;
