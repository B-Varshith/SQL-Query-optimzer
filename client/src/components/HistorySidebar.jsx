import React from 'react';

const HistorySidebar = ({
    history,
    onSelect,
    onClear,
    selectionMode,
    toggleSelectionMode,
    selectedIds,
    onToggleSelect,
    onCompare
}) => {
    return (
        <div className="w-64 bg-gray-900 rounded-lg p-4 shrink-0 max-h-[calc(100vh-100px)] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <h3 className="text-lg text-teal-400 font-semibold m-0">History</h3>
                <div>
                    {history.length > 1 && (
                        <button
                            className="bg-teal-400 text-black px-2 py-1 rounded text-xs font-semibold mr-2 cursor-pointer"
                            onClick={toggleSelectionMode}
                        >
                            {selectionMode ? 'Cancel' : 'Compare'}
                        </button>
                    )}
                    {history.length > 0 && !selectionMode && (
                        <button className="border border-red-400 text-red-400 px-2 py-1 rounded text-xs hover:bg-red-900/10 cursor-pointer bg-transparent" onClick={onClear}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {history.length === 0 ? (
                    <p className="text-gray-500 text-center italic text-sm">No queries yet.</p>
                ) : (
                    history.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700 border-l-4 border-transparent hover:border-purple-400 transition-colors ${selectionMode ? 'pl-10 relative' : ''}`}
                            onClick={() => !selectionMode && onSelect(item)}
                        >
                            {selectionMode && (
                                <input
                                    type="checkbox"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => onToggleSelect(item.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                            <div className="font-mono text-sm text-gray-200 mb-1 truncate">
                                {item.query.slice(0, 50)}{item.query.length > 50 ? '...' : ''}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span className="history-time">
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </span>
                                {item.plan && (
                                    <span className="history-duration">
                                        {item.plan['Execution Time']?.toFixed(2)}ms
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectionMode && (
                <div className="flex gap-2 mt-2">
                    <button
                        className="w-full bg-purple-400 text-black border-none p-2 rounded cursor-pointer font-semibold disabled:bg-gray-700 disabled:cursor-not-allowed"
                        disabled={selectedIds.length < 2}
                        onClick={onCompare}
                    >
                        Compare ({selectedIds.length})
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistorySidebar;
