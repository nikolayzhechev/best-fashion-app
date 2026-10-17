import { useEffect, useState } from 'react';

const genderLabels = { woman: 'Women', men: 'Men', unisex: 'Unisex', kids: 'Kids' };

function values(options) {
  return options.map(option => typeof option === 'string' ? option : option?.name).filter(Boolean);
}

function InputForm({ filters, facets, onApply }) {
  const [draft, setDraft] = useState(filters);
  useEffect(() => setDraft(filters), [filters]);

  const update = event => {
    const { name, value } = event.target;
    setDraft(current => ({
      ...current,
      [name]: value,
      ...(['store', 'gender'].includes(name) ? { category: '' } : {})
    }));
  };

  const stores = values(facets.stores);
  
  const selectedStore = facets.stores
    .find(store =>
      store?.name === draft.store
    );
  
  const allStoreValues = key => [...new Set(facets.stores.flatMap(store => values(store?.[key] || [])))];
  const changedScope = draft.store !== filters.store || draft.gender !== filters.gender;

  const categories = changedScope
    ? (selectedStore ? values(selectedStore.categories || []) : allStoreValues('categories'))
    : values(facets.categories);
    
  const genders = selectedStore
    ? values(selectedStore.genders || [])
    : (allStoreValues('genders').length ? allStoreValues('genders') : values(facets.genders));

  // Keep an active selection visible if a catalogue refresh removes its facet.
  const withSelection = (options, selected) => 
    selected && !options.includes(selected) ? [...options, selected] : options;

  return (
    <form className="catalogue-filters" aria-label="Product filters" onSubmit={event => {
      event.preventDefault();
      onApply({ ...draft, q: draft.q.trim() });
    }}>
      <div className="filter-field search-field">
        <label htmlFor="search">Search products</label>
        <input id="search" name="q" type="search" value={draft.q} onChange={update} placeholder="Search by product or brand" maxLength={100} />
      </div>
      <div className="filter-field">
        <label htmlFor="store">Store</label>
        <select id="store" name="store" value={draft.store} onChange={update}>
          <option value="">All stores</option>
          {withSelection(stores, draft.store).map(store => <option key={store} value={store}>{store}</option>)}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" value={draft.gender} onChange={update}>
          <option value="">All genders</option>
          {withSelection(genders, draft.gender).map(gender => <option key={gender} value={gender}>{genderLabels[gender] || gender}</option>)}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={draft.category} onChange={update}>
          <option value="">All categories</option>
          {withSelection(categories, draft.category).map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <div className="filter-actions">
        <button className="primary-button" type="submit">Search</button>
        <button type="button" onClick={() => onApply({ store: '', gender: '', category: '', q: '' })}>Clear filters</button>
      </div>
    </form>
  );
}

export default InputForm;
