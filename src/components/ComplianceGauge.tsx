import React from 'react';

interface ComplianceGaugeProps {
  score: number;
  size?: number;
  label?: string;
  className?: string;
}

const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({ score, size = 200, label, className = '' }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
  const bgColor = score >= 90 ? 'bg-emerald-50' : score >= 70 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className={`flex flex-col items-center ${bgColor} rounded-xl p-6 ${className}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 4px ${color}40)`,
            }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span
            className="text-4xl font-bold tracking-tight"
            style={{ color }}
          >
            {score}%
          </span>
          {label && (
            <span className="text-sm text-gray-500 mt-1 font-medium">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceGauge;
