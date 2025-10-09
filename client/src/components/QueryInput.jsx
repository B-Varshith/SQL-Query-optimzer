import React from 'react';

const QueryInput = ({ query, setQuery, handleAnalyze, isLoading }) => {
  return (
    <div className="query-input-container">
      <h2>Enter Your SQL Query</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={10}
        placeholder="e.g., SELECT * FROM products WHERE price > 100;"
      />
      <button onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Query'}
      </button>
    </div>
  );
};

export default QueryInput;