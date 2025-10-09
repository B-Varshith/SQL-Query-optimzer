import React, { useState, useEffect } from 'react';

const ResultsDisplay = ({ results, error, isLoading }) => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    if (results && results["QUERY PLAN"]) {
      // Animate items appearing one by one
      setVisibleItems([]);
      results["QUERY PLAN"].forEach((item, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 200);
      });
    }
  }, [results]);

  if (isLoading) {
    return (
      <div className="results-container loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing your query...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container error">
        <div className="error-icon">⚠️</div>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-container placeholder">
        <div className="placeholder-icon">📊</div>
        <h3>Ready to Analyze</h3>
        <p>Submit a query to see the detailed execution plan</p>
      </div>
    );
  }

  const renderPlanNode = (plan, index) => {
    const isVisible = visibleItems.includes(index);
    
    return (
      <div 
        key={index} 
        className={`plan-node ${isVisible ? 'visible' : ''}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="node-header">
          <div className="node-type">
            <span className="node-type-icon">🔍</span>
            <span className="node-type-text">{plan["Node Type"]}</span>
          </div>
          <div className="node-cost">
            <span className="cost-label">Cost</span>
            <span className="cost-value">{plan["Total Cost"]}</span>
          </div>
        </div>

        <div className="node-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Relation</span>
              <span className="detail-value">{plan["Relation Name"]}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Alias</span>
              <span className="detail-value">{plan["Alias"]}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Startup Cost</span>
              <span className="detail-value">{plan["Startup Cost"]}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Plan Rows</span>
              <span className="detail-value">{plan["Plan Rows"]}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Plan Width</span>
              <span className="detail-value">{plan["Plan Width"]}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Actual Rows</span>
              <span className="detail-value actual">{plan["Actual Rows"]}</span>
            </div>
          </div>

          <div className="timing-section">
            <h4>⏱️ Timing Information</h4>
            <div className="timing-grid">
              <div className="timing-item">
                <span className="timing-label">Startup Time</span>
                <span className="timing-value">{plan["Actual Startup Time"]}ms</span>
              </div>
              <div className="timing-item">
                <span className="timing-label">Total Time</span>
                <span className="timing-value">{plan["Actual Total Time"]}ms</span>
              </div>
              <div className="timing-item">
                <span className="timing-label">Loops</span>
                <span className="timing-value">{plan["Actual Loops"]}</span>
              </div>
            </div>
          </div>

          <div className="flags-section">
            <h4>🚩 Execution Flags</h4>
            <div className="flags-grid">
              <div className={`flag ${plan["Parallel Aware"] ? 'enabled' : 'disabled'}`}>
                <span className="flag-icon">{plan["Parallel Aware"] ? '✅' : '❌'}</span>
                <span className="flag-text">Parallel Aware</span>
              </div>
              <div className={`flag ${plan["Async Capable"] ? 'enabled' : 'disabled'}`}>
                <span className="flag-icon">{plan["Async Capable"] ? '✅' : '❌'}</span>
                <span className="flag-text">Async Capable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExecutionStats = (item) => (
    <div className="execution-stats">
      <div className="stat-item">
        <span className="stat-icon">🧠</span>
        <span className="stat-label">Planning Time</span>
        <span className="stat-value">{item["Planning Time"]}ms</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">⚡</span>
        <span className="stat-label">Execution Time</span>
        <span className="stat-value">{item["Execution Time"]}ms</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">🔗</span>
        <span className="stat-label">Triggers</span>
        <span className="stat-value">{item["Triggers"].length}</span>
      </div>
    </div>
  );

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>📊 Query Execution Plan</h2>
        <div className="plan-summary">
          <span className="summary-item">
            <span className="summary-label">Total Plans</span>
            <span className="summary-value">{results["QUERY PLAN"].length}</span>
          </span>
        </div>
      </div>

      <div className="plans-container">
        {results["QUERY PLAN"].map((item, index) => (
          <div key={index} className="plan-container">
            {renderPlanNode(item.Plan, index)}
            {renderExecutionStats(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;