//Search.js
import React, { useState } from 'react';
import Button from './button';
import { useNavigate } from 'react-router-dom';
import Dropdown from './dropdown';
import Input from './inputbox';
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
        <Input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
/>
<br /><br />
        <Dropdown options={[
        { name: "Accessories", value: "accessories" },
        { name: "Kitchen Products", value: "kitchen" },
        { name: "Furnitures", value: "furniture" },
        { name: "Clothes", value: "clothes" },
        { name: "Electronics", value: "electronics" }
      ]}  value={category} label="--Any Category --" onChange={e => setCategory(e.target.value)} /><br />

        <Dropdown
          options={[
            { name: "New", value: "new" },
            { name: "Used", value: "used" },
            { name: "Refurbished", value: "refurbished" }
          ]}
          value={condition}
          label="-- Any Condition --"
          onChange={e => setCondition(e.target.value)}
        /> 
        <br />
        <Button type="submit">Search</Button>
      </form>
    </div>
  );
}

export default Search;