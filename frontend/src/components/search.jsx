//Search.js
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

function Search() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = new URLSearchParams({name, category, condition}).toString()
    navigate(`/searchpage?${query}`)
    
  };

  return (
    <div>
      <h2>Search</h2>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br /><br />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">-- Category --</option>
          <option value="accessories">Accessories</option>
          <option value="kitchen">Kitchen Products</option>
          <option value="furniture">Furnitures</option>
          <option value="clothes">Clothes</option>
          <option value="electronics">Electronics</option>
        </select><br /><br />
        <select value={condition} onChange={e => setCondition(e.target.value)}>
          <option value="">-- Any Condition --</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select><br /><br />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Search;