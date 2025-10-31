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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo - Left side */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black flex items-center justify-center text-[#FFD247] font-bold text-sm sm:text-base">
            Bookit
          </div>
        </div>

        {/* Search Bar - Right side */}
        {onSearchChange && (
          <div className="flex-1 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="text"
                value={localSearchTerm}
                onChange={handleInputChange}
                className="flex-1 rounded-lg px-4 py-3 bg-gray-100 placeholder-gray-500 focus:outline-none shadow-inner w-full"
                placeholder="Search experiences"
              />
              <button 
                type="submit"
                className="rounded-lg px-6 py-3 bg-[#FFD247] font-semibold text-gray-900 hover:brightness-95 w-full sm:w-auto"
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
