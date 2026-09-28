import React from 'react';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  searchPlaceholder?: string;
  isFilterActive?: boolean;
  extraActions?: React.ReactNode;
  className?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  searchPlaceholder = 'Search here',
  isFilterActive = false,
  extraActions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${className}`}>
      <div className="flex-1 flex items-center gap-3">
        {/* Search input field */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-[#FAFCFE] border border-[#CBCDCE] rounded-lg text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
          />
        </div>

        {/* Filter button */}
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-medium transition-colors ${
              isFilterActive
                ? 'bg-[#F7EADE] border-[#D89859] text-[#936B40]'
                : 'bg-[#FAFCFE] border-[#D89859] text-[#936B40] hover:bg-[#F7EADE]'
            }`}
          >
            <span>Filter</span>
            <svg
              className="w-3.5 h-3.5 text-[#936B40]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        )}
      </div>

      {extraActions && (
        <div className="flex items-center gap-2 shrink-0">{extraActions}</div>
      )}
    </div>
  );
};
