import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import QueryInput from './components/QueryInput';
import QueryResults from './components/QueryResults';
import HistorySidebar from './components/HistorySidebar';
import ComparisonView from './components/ComparisonView';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function Optimizer() {
  const [query, setQuery] = useState('');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const location = useLocation();
  const credentialId = location.state?.credentialId;

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
    if (!credentialId) {
      setError('No database connection selected. Please select a connection from the dashboard.');
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);
    setIsComparing(false);

    try {
      // Include credentialId in the request
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token
        },
        body: JSON.stringify({ userQuery: query, credentialId }),
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
    <div className="max-w-7xl mx-auto p-10 flex flex-col gap-8">
      <header className="text-center mb-5">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent m-0">
          PostgreSQL Query Optimizer
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Analyze and optimize your SQL queries with visual insights
        </p>
        {!credentialId && <p className="text-yellow-500 mt-2">No database connection selected</p>}
      </header>

      <div className="flex gap-5 items-start">
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

        <div className="flex-grow flex flex-col gap-5 min-w-0">
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <Optimizer />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
