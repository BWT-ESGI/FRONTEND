import React, { JSX } from "react";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "../ui/search-bar";

export interface SearchableProps<T> {
  data: T[];
  filterFn?: (item: T, query: string) => boolean;
  render: (
    filteredData: T[],
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>
  ) => JSX.Element;
  placeholder?: string;
  inputClassName?: string;
  rightChildren?: JSX.Element;
}

export function FlexibleSearchBar<T extends Record<string, unknown>>({
  data,
  filterFn,
  render,
  placeholder = "Rechercher...",
  inputClassName,
  rightChildren,
  ...props
}: SearchableProps<T>) {
  const { query, setQuery, filteredData } = useSearch<T>(data, filterFn);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <SearchBar
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputClassName={inputClassName}
          {...props}
        />
        {rightChildren && ( 
          <div className="flex items-center gap-2">
            {rightChildren}
          </div>
        )}
      </div>
      {render(filteredData, query, setQuery)}
    </div>
  );
}
