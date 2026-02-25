import { useState, useEffect, useRef, ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock fetch function - replace with your actual API call
  const fetchSuggestions = async (searchQuery: string) => {
    // Example: const response = await fetch(`/api/search/suggestions?q=${searchQuery}`);
    // const data = await response.json();
    // return data.suggestions;
    
    // Returning mock data for now
    const mockProducts = ['T-Shirt', 'Shoes', 'Hat', 'Jacket', 'Jeans', 'Watch', 'Bag'];
    return mockProducts.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const results = await fetchSuggestions(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to fetch suggestions", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        placeholder="Search products..."
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}