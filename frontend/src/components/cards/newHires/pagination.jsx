"use client"

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {totalItems > 0 ? indexOfFirstItem : 0}-{indexOfLastItem} of {totalItems} entries
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          // Show pages around current page
          let pageNum = i + 1
          if (totalPages > 5 && currentPage > 3) {
            pageNum = currentPage - 2 + i
          }
          if (pageNum > totalPages) return null

          return (
            <button
              key={pageNum}
              className={`pagination-button ${currentPage === pageNum ? "active" : ""}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  )
}

export default Pagination
