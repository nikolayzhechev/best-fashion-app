function Navi({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;
  if (totalPages < 2) return null;

  return (
    <nav className="pagination-container" aria-label="Product pages">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      <p aria-live="polite">Page {page} of {totalPages}</p>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
    </nav>
  );
}

export default Navi;
