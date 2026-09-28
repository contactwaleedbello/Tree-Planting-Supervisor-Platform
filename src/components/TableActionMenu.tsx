import React, { useState, useRef, useEffect } from 'react';

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface TableActionMenuProps {
  items: ActionMenuItem[];
  className?: string;
}

export const TableActionMenu: React.FC<TableActionMenuProps> = ({ items, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E5E6] bg-[#FAFCFE] hover:bg-[#EEF0F2] text-[#5E625E] transition-colors focus:outline-none"
        aria-label="Actions"
      >
        <span className="font-bold tracking-widest text-xs">•••</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-1 w-40 origin-top-right rounded-lg bg-[#FAFCFE] border border-[#E2E5E6] shadow-lg py-1 focus:outline-none">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                item.variant === 'danger'
                  ? 'text-[#C54A40] hover:bg-[#FEEEED]'
                  : 'text-[#1C211B] hover:bg-[#EEF0F2]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
