import React from 'react';

export interface PropertyItem {
  label: string;
  value: React.ReactNode;
  unit?: string;
}

interface PropertyGridProps {
  items: PropertyItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  items,
  columns = 2,
  className = '',
}) => {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[columns];

  return (
    <div
      className={`grid ${colClass} border border-[#E2E5E6] rounded-xl overflow-hidden bg-[#FAFCFE] divide-y sm:divide-y-0 divide-[#EEF0F2] ${className}`}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-4 border-b border-r last:border-r-0 border-[#EEF0F2] flex flex-col justify-center"
        >
          <span className="text-[11px] font-medium text-[#7B7E7B] mb-1">
            {item.label}
          </span>
          <div className="text-sm font-semibold text-[#1C211B] flex items-baseline gap-1">
            {item.value}
            {item.unit && (
              <span className="text-xs font-normal text-[#5E625E]">
                {item.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
