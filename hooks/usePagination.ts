import { useState, useMemo, useEffect } from 'react';

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  paginatedItems: any[];
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  setItemsPerPage: (value: number) => void;
}

const ITEMS_PER_PAGE_KEY = 'todoAppItemsPerPage';

export function usePagination<T>(items: T[], initialItemsPerPage: number = 10): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  useEffect(() => {
    const saved = localStorage.getItem(ITEMS_PER_PAGE_KEY);
    if (saved) {
      setItemsPerPageState(Number(saved));
    }
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const setItemsPerPage = (value: number) => {
    setItemsPerPageState(value);
    localStorage.setItem(ITEMS_PER_PAGE_KEY, String(value));
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setItemsPerPage,
  };
}
