import React from 'react';
import ReactJson from '@microlink/react-json-view';
import MetricsCard from './MetricsCard';

const QueryResults = ({ plan, error }) => {
    if (error) {
        return (
            <div className="error-container">
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!plan) return null;

    // Extract metrics safely
    const executionTime = plan['Execution Time'] || 0;
    const planningTime = plan['Planning Time'] || 0;
    const totalCost = plan['Plan'] ? plan['Plan']['Total Cost'] : 0;

    return (
        <div className="results-container">
            <div className="metrics-summary">
                <MetricsCard
                    label="Execution Time"
                    value={executionTime.toFixed(3)}
                    unit="ms"
                    icon="⚡"
                    color="#bb86fc"
                />
                <MetricsCard
                    label="Planning Time"
                    value={planningTime.toFixed(3)}
                    unit="ms"
                    icon="🧠"
                    color="#03dac6"
                />
                <MetricsCard
                    label="Total Cost"
                    value={totalCost.toFixed(2)}
                    unit="units"
                    icon="💰"
                    color="#cf6679"
                />
            </div>

            <h3>Query Execution Plan</h3>
            <div className="json-view-wrapper">
                <ReactJson
                    src={plan}
                    theme="ocean"
                    displayDataTypes={false}
                    collapsed={2}
                    enableClipboard={true}
                    style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#1e1e1e' }}
                />
            </div>
        </div>
    );
};

export default QueryResults;
