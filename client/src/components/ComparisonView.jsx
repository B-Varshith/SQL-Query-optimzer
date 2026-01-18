import React from 'react';

const ComparisonView = ({ queries, onBack }) => {
    if (!queries || queries.length === 0) {
        return (
            <div className="text-center p-10 text-gray-400">
                <p>Select queries from the history to compare.</p>
                <button onClick={onBack} className="bg-transparent border border-purple-400 text-purple-400 px-4 py-2 rounded cursor-pointer hover:bg-purple-400/10 transition-all mt-4">Back to Editor</button>
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
        <div className="bg-gray-900 p-5 rounded-lg w-full">
            <div className="flex justify-between items-center mb-5">
                <h2 className="m-0 text-teal-400 text-2xl font-bold">Query Comparison</h2>
                <button onClick={onBack} className="bg-transparent border border-purple-400 text-purple-400 px-4 py-2 rounded cursor-pointer hover:bg-purple-400/10 transition-all">Back to Editor</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-gray-200">
                    <thead>
                        <tr>
                            <th className="p-4 text-left border-b border-gray-800 bg-gray-800 font-semibold">Metric</th>
                            {queries.map((q, i) => (
                                <th key={q.id} className="p-4 text-left border-b border-gray-800 bg-gray-800 font-semibold">
                                    <div className="flex flex-col">
                                        <span className="text-base text-purple-400">Query {i + 1}</span>
                                        <span className="text-xs text-gray-500 font-normal">{new Date(q.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 text-left border-b border-gray-800 font-semibold text-gray-400 w-[200px]">Query Snippet</td>
                            {queries.map(q => (
                                <td key={q.id} className="p-4 text-left border-b border-gray-800">
                                    <code className="block bg-gray-950 p-2 rounded font-mono text-sm whitespace-pre-wrap max-w-xs">{q.query.slice(0, 100)}{q.query.length > 100 ? '...' : ''}</code>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 text-left border-b border-gray-800 font-semibold text-gray-400 w-[200px]">Execution Time (ms)</td>
                            {queries.map(q => {
                                const val = getMetric(q.plan, 'Execution Time');
                                const isBest = val === bestExecution;
                                return (
                                    <td key={q.id} className={`p-4 text-left border-b border-gray-800 ${isBest ? 'text-teal-400 font-bold relative' : ''}`}>
                                        {val.toFixed(3)}
                                        {isBest && <span className="inline-block bg-teal-400/20 text-teal-400 text-xs px-2 py-0.5 rounded ml-2 align-middle">Fastest</span>}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr>
                            <td className="p-4 text-left border-b border-gray-800 font-semibold text-gray-400 w-[200px]">Planning Time (ms)</td>
                            {queries.map(q => {
                                const val = getMetric(q.plan, 'Planning Time');
                                const isBest = val === bestPlanning;
                                return (
                                    <td key={q.id} className={`p-4 text-left border-b border-gray-800 ${isBest ? 'text-teal-400 font-bold relative' : ''}`}>
                                        {val.toFixed(3)}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr>
                            <td className="p-4 text-left border-b border-gray-800 font-semibold text-gray-400 w-[200px]">Total Cost</td>
                            {queries.map(q => {
                                const val = getMetric(q.plan, 'Total Cost');
                                const isBest = val === bestCost;
                                return (
                                    <td key={q.id} className={`p-4 text-left border-b border-gray-800 ${isBest ? 'text-teal-400 font-bold relative' : ''}`}>
                                        {val.toFixed(2)}
                                        {isBest && <span className="inline-block bg-teal-400/20 text-teal-400 text-xs px-2 py-0.5 rounded ml-2 align-middle">Lowest Cost</span>}
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
