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
        <div className="history-sidebar">
            <div className="history-header">
                <h3>History</h3>
                <div>
                    {history.length > 1 && (
                        <button
                            className="compare-toggle-btn"
                            onClick={toggleSelectionMode}
                        >
                            {selectionMode ? 'Cancel' : 'Compare'}
                        </button>
                    )}
                    {history.length > 0 && !selectionMode && (
                        <button className="clear-history-btn" onClick={onClear}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="history-list">
                {history.length === 0 ? (
                    <p className="empty-history">No queries yet.</p>
                ) : (
                    history.map((item) => (
                        <div
                            key={item.id}
                            className={`history-item ${selectionMode ? 'selection-mode' : ''}`}
                            onClick={() => !selectionMode && onSelect(item)}
                        >
                            {selectionMode && (
                                <input
                                    type="checkbox"
                                    className="history-checkbox"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => onToggleSelect(item.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                            <div className="history-query-snippet">
                                {item.query.slice(0, 50)}{item.query.length > 50 ? '...' : ''}
                            </div>
                            <div className="history-meta">
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
                <div className="compare-actions">
                    <button
                        className="compare-btn"
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
