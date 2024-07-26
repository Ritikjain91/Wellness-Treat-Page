import React, { useState, useEffect } from 'react';
import './Card.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const limit = 6;

  useEffect(() => {
    fetchRetreats();
  }, [page, filterType, filterDate]);

  const fetchRetreats = async () => {
    let url = `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?page=${page}&limit=${limit}`;
    if (filterType) url += `&type=${filterType}`;
    if (filterDate) url += `&date=${filterDate}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    }
  };

  const searchRetreats = async () => {
    try {
      const response = await fetch(`https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?search=${searchTerm}`);
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
      setPage(1); // Reset to the first page after search
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <div className="app">
      <div className="filter-container">
        <select
          className="filter-dropdown"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="">Filter by Date</option>
          <option value="2024-07-15">July 15, 2024</option>
          <option value="2024-08-15">August 15, 2024</option>
          <option value="2024-09-15">September 15, 2024</option>
        </select>
        <select
          className="filter-dropdown"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Filter by Type</option>
          <option value="yoga">Yoga</option>
          <option value="meditation">Meditation</option>
          <option value="spa">Spa</option>
        </select>
        <div className="search-container">
          <input
            type="text"
            id="searchInput"
            placeholder="Search retreats by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={searchRetreats}>Search</button>
        </div>
      </div>
      <div className="results">
        {results.length > 0 ? (
          results.map((retreat) => (
            <div key={retreat.id} className="card">
              <img src={retreat.image} alt={retreat.title} className="retreat-image" />
              <div className="retreat-content">
                <h3>{retreat.title}</h3>
                <p>{retreat.description}</p>
                <p><strong>Date:</strong> {retreat.date}</p>
                <p><strong>Location:</strong> {retreat.location}</p>
                <p><strong>Price:</strong> ${retreat.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={page === 1}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default App;
