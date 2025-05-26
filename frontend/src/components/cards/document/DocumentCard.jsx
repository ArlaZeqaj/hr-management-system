import React from 'react';
const getFileIcon = (type) => {
    switch (type?.toUpperCase()) {
        case 'PDF':
            return 'https://img.icons8.com/color/48/000000/pdf.png';
        case 'DOCX':
            return 'https://img.icons8.com/color/48/000000/ms-word.png';
        case 'XLSX':
            return 'https://img.icons8.com/color/48/000000/ms-excel.png';
        case 'PPTX':
            return 'https://img.icons8.com/color/48/000000/ms-powerpoint.png';
        default:
            return 'https://img.icons8.com/color/48/000000/file.png';
    }
};

const DocumentCard = ({ doc, onToggleStar, onDownload, onPreview }) => (
    <div className="document-card">
        <div className="document-header">
            <img src={getFileIcon(doc.type)} alt={doc.type} className="file-icon" />
            <button onClick={() => onToggleStar(doc.id)} className={doc.starred ? 'star-button starred' : 'star-button'}>
                {/* star SVG */}
            </button>
        </div>
        <div className="document-body">
            <h3>{doc.name}</h3>
            <div className="document-meta">
                <span>{doc.category}</span>
                <span>{doc.size}</span>
            </div>
            <div className="document-footer">
                <span>{doc.formattedDate}</span>
                <span>{doc.uploadedBy}</span>
            </div>
        </div>
        <div className="document-actions">
            <button onClick={() => onDownload(doc.id)} className="download-button">Download</button>
            <button onClick={() => onPreview(doc.id)} className="preview-button">Delete</button>
        </div>
    </div>
);

export default DocumentCard;