import React from 'react';

export interface StatChip {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  subtitle?: string;
  chips?: StatChip[];
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  subtitle,
  chips,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 flex flex-col justify-between shadow-sm min-h-[130px] ${className}`}
    >
      <div>
        <div className="text-2xl font-bold text-[#1C211B] tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          {icon && <span className="text-[#5E625E] shrink-0">{icon}</span>}
          <span className="text-sm font-medium text-[#424641]">{label}</span>
        </div>
        {subtitle && (
          <div className="text-xs text-[#7B7E7B] mt-1.5">{subtitle}</div>
        )}
      </div>

      {chips && chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
          {chips.map((chip, idx) => {
            let chipStyle = 'bg-[#EEF0F2] text-[#5E625E]';
            if (chip.variant === 'success') {
              chipStyle = 'bg-[#ECFAF7] text-[#3CAD90]';
            } else if (chip.variant === 'error') {
              chipStyle = 'bg-[#FEEEED] text-[#C54A40]';
            } else if (chip.variant === 'warning') {
              chipStyle = 'bg-[#F8F1E6] text-[#975F0B]';
            } else if (chip.variant === 'info') {
              chipStyle = 'bg-[#EDF2FD] text-[#406AC1]';
            }
            return (
              <span
                key={idx}
                className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${chipStyle}`}
              >
                {chip.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
