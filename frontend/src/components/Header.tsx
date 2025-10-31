import React, { useState } from 'react';

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm = '', onSearchChange }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearchTerm);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-4 flex items-center justify-between gap-4">
        {/* Logo - Left side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#FFD247] font-bold">
            Bookit
          </div>
        </div>

        {/* Search Bar - Right side */}
        {onSearchChange && (
          <div className="flex-1 flex justify-end max-w-2xl">
            <form onSubmit={handleSearch} className="flex gap-3 w-full">
              <input
                type="text"
                value={localSearchTerm}
                onChange={handleInputChange}
                className="flex-1 rounded-lg px-4 py-3 bg-gray-100 placeholder-gray-500 focus:outline-none shadow-inner"
                placeholder="Search experiences"
              />
              <button 
                type="submit"
                className="rounded-lg px-6 py-3 bg-[#FFD247] font-semibold text-gray-900 hover:brightness-95 flex-shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
