import React from 'react';

const MetricsCard = ({ label, value, unit, icon, color }) => {
    return (
        <div className="metrics-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="metrics-icon" style={{ color: color }}>
                {icon}
            </div>
            <div className="metrics-content">
                <span className="metrics-label">{label}</span>
                <span className="metrics-value">
                    {value} <span className="metrics-unit">{unit}</span>
                </span>
            </div>
        </div>
    );
};

export default MetricsCard;
