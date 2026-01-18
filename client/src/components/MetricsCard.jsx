import React from 'react';

const MetricsCard = ({ label, value, unit, icon, color }) => {
    return (
        <div className="bg-gray-900 p-4 rounded-lg flex items-center gap-4 flex-1 min-w-[200px] shadow-md border-l-4" style={{ borderLeftColor: color }}>
            <div className="text-2xl" style={{ color: color }}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-xl font-semibold text-white">
                    {value} <span className="text-xs font-normal text-gray-500 ml-1">{unit}</span>
                </span>
            </div>
        </div>
    );
};

export default MetricsCard;
