import React, { useState, useEffect } from 'react';
import './App.css';
import QueryInput from './components/QueryInput';
import QueryResults from './components/QueryResults';
import HistorySidebar from './components/HistorySidebar';
import ComparisonView from './components/ComparisonView';

function App() {
  const [query, setQuery] = useState('');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Comparison State
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('queryHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (queryText, queryPlan) => {
    const newItem = {
      id: Date.now(),
      query: queryText,
      plan: queryPlan,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleSelectHistory = (item) => {
    setQuery(item.query);
    setPlan(item.plan);
    setError(null);
    setIsComparing(false);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedIds([]);
    setIsComparing(false);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      setIsComparing(true);
    }
  };

  const handleBackToEditor = () => {
    setIsComparing(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setIsComparing(false);

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery: query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze query');
      }

      setPlan(data);
      addToHistory(query, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedQueries = () => {
    return history.filter(item => selectedIds.includes(item.id));
  };

  return (
    <div className="app-container">
      <header>
        <h1>PostgreSQL Query Optimizer</h1>
        <p>Analyze and optimize your SQL queries with visual insights</p>
      </header>

      <div className="main-layout">
        <HistorySidebar
          history={history}
          onSelect={handleSelectHistory}
          onClear={clearHistory}
          selectionMode={selectionMode}
          toggleSelectionMode={toggleSelectionMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onCompare={handleCompare}
        />

        <div className="content-area">
          {isComparing ? (
            <ComparisonView
              queries={getSelectedQueries()}
              onBack={handleBackToEditor}
            />
          ) : (
            <>
              <QueryInput
                query={query}
                setQuery={setQuery}
                onAnalyze={handleAnalyze}
                loading={loading}
              />

              <QueryResults plan={plan} error={error} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
