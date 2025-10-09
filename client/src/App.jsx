import React, { useState } from 'react';
import './App.css';
import QueryInput from './components/QueryInput';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [query, setQuery] = useState('SELECT * FROM products WHERE category = \'Category 50\';');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setResults(null);
    try {
      const response = await fetch(`http://localhost:3000/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery: query }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || 'Something went wrong with the API call.');
      }
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='heading'>SQL Query Optimizer</h1>
      </header>
      <main>
        <QueryInput 
          query={query}
          setQuery={setQuery}
          handleAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
        <ResultsDisplay 
          results={results}
          error={error}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;

