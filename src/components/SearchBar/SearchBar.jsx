import React from 'react';
import GenerateCSVButton from '../GenerateCSVButton/GenerateCSVButton.jsx';
import './SearchBar.css';

const SearchBar = ({ searchQuery, handleSearch, filteredCosts }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Buscar usuário ou e-mail"
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />
      <GenerateCSVButton filteredCosts={filteredCosts} />
    </div>
  );
};

export default SearchBar;