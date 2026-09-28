import React from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  extraActions?: React.ReactNode;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  extraActions,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 py-3 ${className}`}>
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {item.onClick && !item.active ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="font-semibold text-[#1C211B] hover:text-[#3C7429] transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={`font-semibold ${
                    item.active || isLast ? 'text-[#3C7429]' : 'text-[#1C211B]'
                  }`}
                >
                  {item.label}
                </span>
              )}
              <span className="text-[#979A98] font-bold select-none">&gt;</span>
            </React.Fragment>
          );
        })}
      </nav>

      {extraActions && (
        <div className="flex items-center gap-3 shrink-0">{extraActions}</div>
      )}
    </div>
  );
};
