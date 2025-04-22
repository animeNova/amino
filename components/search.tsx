'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useUpdateSearchParam } from '@/hooks/use-search-params';

interface SearchProps {
  placeholder?: string;
  paramName?: string;
  defaultValue?: string;
}

const SearchComponent = ({ 
  placeholder = "Search...", 
  paramName = "search",
  defaultValue = ""
}: SearchProps) => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue ?? searchParams.get(paramName) ?? "");
  const debouncedValue = useDebounce(value, 500);
  
  // Use our custom hook to handle URL updates
  useUpdateSearchParam({
    paramName,
    value: debouncedValue
  });

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        className="w-full md:w-80 pl-8"
      />
    </div>
  );
};

export default SearchComponent;
