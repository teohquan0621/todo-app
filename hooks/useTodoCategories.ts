'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category, loadCategories, saveCategories, isLocalStorageAvailable } from '@/lib/storage';

export function useTodoCategories() {
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setIsLoaded(true);
      return;
    }

    const loadedCategories = loadCategories();
    setCategoriesState(loadedCategories);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isLocalStorageAvailable()) {
      saveCategories(categories);
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback((category: Category) => {
    setCategoriesState((prev) => {
      if (prev.some((cat) => cat.id === category.id)) return prev;
      return [...prev, category];
    });
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategoriesState((prev) => prev.filter((cat) => cat.id !== categoryId));
  }, []);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    setCategoriesState((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, ...updates } : cat))
    );
  }, []);

  return {
    categories,
    isLoaded,
    addCategory,
    deleteCategory,
    updateCategory,
  };
}
