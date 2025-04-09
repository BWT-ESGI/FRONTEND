import { useState, useMemo } from "react";

function defaultFilterFn<T extends Record<string, unknown>>(item: T, query: string): boolean {
  if (!query.trim()) return true;
  return Object.values(item).some(
    (value) =>
      value !== null &&
      value !== undefined &&
      value.toString().toLowerCase().includes(query.toLowerCase())
  );
}

export function useSearch<T extends Record<string, unknown>>(
  data: T[],
  filterFn?: (item: T, query: string) => boolean,
  initialQuery: string = ""
) {
  const [query, setQuery] = useState(initialQuery);
  const effectiveFilterFn = filterFn || defaultFilterFn;

  const filteredData = useMemo(() => {
    return data.filter((item) => effectiveFilterFn(item, query));
  }, [data, query, effectiveFilterFn]);

  return { query, setQuery, filteredData };
}
