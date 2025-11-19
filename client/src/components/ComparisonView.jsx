import React from 'react';

const ComparisonView = ({ queries, onBack }) => {
    if (!queries || queries.length === 0) {
        return (
            <div className="comparison-empty">
                <p>Select queries from the history to compare.</p>
                <button onClick={onBack} className="back-button">Back to Editor</button>
            </div>
        );
    }

    // Helper to get metric value safely
    const getMetric = (plan, key) => {
        if (!plan) return 0;
        if (key === 'Total Cost') return plan['Plan'] ? plan['Plan']['Total Cost'] : 0;
        return plan[key] || 0;
    };

    // Find best values for highlighting
    const bestExecution = Math.min(...queries.map(q => getMetric(q.plan, 'Execution Time')));
    const bestPlanning = Math.min(...queries.map(q => getMetric(q.plan, 'Planning Time')));
    const bestCost = Math.min(...queries.map(q => getMetric(q.plan, 'Total Cost')));

    return (
        <div className="comparison-container">
            <div className="comparison-header">
                <h2>Query Comparison</h2>
                <button onClick={onBack} className="back-button">Back to Editor</button>
            </div>

            <div className="comparison-table-wrapper">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            {queries.map((q, i) => (
                                <th key={q.id}>
                                    <div className="th-content">
                                        <span className="query-name">Query {i + 1}</span>
                                        <span className="query-time">{new Date(q.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="metric-name">Query Snippet</td>
                            {queries.map(q => (
                                <td key={q.id} className="code-cell">
                                    <code>{q.query.slice(0, 100)}{q.query.length > 100 ? '...' : ''}</code>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="metric-name">Execution Time (ms)</td>
                            {queries.map(q => {
                                const val = getMetric(q.plan, 'Execution Time');
                                const isBest = val === bestExecution;
                                return (
                                    <td key={q.id} className={isBest ? 'best-metric' : ''}>
                                        {val.toFixed(3)}
                                        {isBest && <span className="badge">Fastest</span>}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr>
                            <td className="metric-name">Planning Time (ms)</td>
                            {queries.map(q => {
                                const val = getMetric(q.plan, 'Planning Time');
                                const isBest = val === bestPlanning;
                                return (
                                    <td key={q.id} className={isBest ? 'best-metric' : ''}>
                                        {val.toFixed(3)}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr>
                            <td className="metric-name">Total Cost</td>
                            {queries.map(q => {
                                const val = getMetric(q.plan, 'Total Cost');
                                const isBest = val === bestCost;
                                return (
                                    <td key={q.id} className={isBest ? 'best-metric' : ''}>
                                        {val.toFixed(2)}
                                        {isBest && <span className="badge">Lowest Cost</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonView;
