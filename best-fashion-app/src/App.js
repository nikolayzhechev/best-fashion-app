import './App.css';
import { useEffect, useState } from 'react';
import Data from './components/Data';
import InputForm from './components/InputForm';
import Navi from './components/Navi';
import { getCatalogue, getFilters } from './api';

const EMPTY_FILTERS = { store: '', gender: '', category: '', q: '' };
const PAGE_SIZE = 24;

function App() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [catalogue, setCatalogue] = useState(null);
  const [facets, setFacets] = useState({ stores: [], genders: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersError, setFiltersError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setCatalogue(null);

    getCatalogue({ ...filters, page, limit: PAGE_SIZE }, controller.signal)
      .then(data => {
        if (!controller.signal.aborted) setCatalogue(data);
      })
      .catch(err => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filters, page, retry]);

  useEffect(() => {
    const controller = new AbortController();
    setFiltersError('');
    getFilters({ store: filters.store, gender: filters.gender }, controller.signal)
      .then(data => {
        if (!controller.signal.aborted) setFacets(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFiltersError('Store and category filters could not be loaded. You can still search products.');
        }
      });
    return () => controller.abort();
  }, [filters.store, filters.gender, retry]);

  const applyFilters = nextFilters => {
    setFilters(nextFilters);
    setPage(1);
  };

  const pagination = catalogue?.pagination;
  const total = pagination?.total || 0;
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <main className="main-section">
      <header className="catalogue-header">
        <p className="eyebrow">Best Fashion</p>
        <h1>Find your next favourite.</h1>
        <p>Explore products from multiple stores in one place.</p>
      </header>

      <InputForm filters={filters} facets={facets} onApply={applyFilters} />

      {filtersError && (
        <div className="filter-warning" role="status">
          <p>{filtersError}</p>
          <button onClick={() => setRetry(value => value + 1)}>Retry filters</button>
        </div>
      )}

      <section className="catalogue-section" aria-labelledby="products-heading" aria-busy={loading}>
        <div className="catalogue-toolbar">
          <h2 id="products-heading">{hasFilters ? 'Your selection' : 'All products'}</h2>
          {!loading && !error && <p>{total.toLocaleString()} {total === 1 ? 'product' : 'products'}</p>}
        </div>

        {loading && <p className="state-message" role="status">Loading products…</p>}

        {error && (
          <div className="state-message error-state" role="alert">
            <h3>Products could not be loaded</h3>
            <p>{error}</p>
            <button onClick={() => setRetry(value => value + 1)}>Try again</button>
          </div>
        )}

        {!loading && !error && total === 0 && (
          <div className="state-message" role="status">
            <h3>{hasFilters ? 'No products match these filters' : 'No products available yet'}</h3>
            <p>{hasFilters ? 'Try another search or clear your filters.' : 'Products will appear here after the next catalogue update.'}</p>
            {hasFilters && <button onClick={() => applyFilters({ ...EMPTY_FILTERS })}>Clear filters</button>}
          </div>
        )}

        {!loading && !error && total > 0 && (
          <>
            <div className="items-wrapper">
              {catalogue.itemsData.map(item => <Data key={item.id || `${item.site}:${item.itemUrl}`} data={item} />)}
            </div>
            <Navi pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </section>

      <footer className="catalogue-footer">Prices and availability may change. Check the store for the latest details.</footer>
    </main>
  );
}

export default App;
