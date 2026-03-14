'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
  categories: string[];
  currentCategory?: string;
  currentSort?: string;
};

export function FilterControls({
  categories,
  currentCategory,
  currentSort,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build a new query string, preserving existing params while updating one
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset pagination when filters change — avoids showing empty pages
      if (name !== 'page') {
        params.delete('page');
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (category: string) => {
    router.push(`${pathname}?${createQueryString('category', category)}`);
  };

  const handleSortChange = (sort: string) => {
    router.push(`${pathname}?${createQueryString('sort', sort)}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange('')}
          className={`rounded px-3 py-1 text-sm ${
            !currentCategory ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat.toLowerCase())}
            className={`rounded px-3 py-1 text-sm ${
              currentCategory?.toLowerCase() === cat.toLowerCase()
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort control */}
      <select
        value={currentSort || ''}
        onChange={(e) => handleSortChange(e.target.value)}
        className="rounded border px-3 py-1 text-sm"
      >
        <option value="">Recent</option>
        <option value="title">Sort by title</option>
      </select>

      {/* Clear all filters */}
      {(currentCategory || currentSort) && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-red-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
