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
}

export function FlexibleSearchBar<T extends Record<string, unknown>>({
  data,
  filterFn,
  render,
  placeholder = "Rechercher...",
  inputClassName,
  ...props
}: SearchableProps<T>) {
  const { query, setQuery, filteredData } = useSearch<T>(data, filterFn);

  return (
    <div>
      <div className="mb-4">
        <SearchBar
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputClassName={inputClassName}
          {...props}
        />
      </div>
      {render(filteredData, query, setQuery)}
    </div>
  );
}
