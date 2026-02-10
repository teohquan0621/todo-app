'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, saveTodos, loadTodos, isLocalStorageAvailable, TodoStatus } from '@/lib/storage';

interface UseTodosReturn {
  todos: Todo[];
  isLoaded: boolean;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setTodos: (todos: Todo[]) => void;
  reorderTodos: (todos: Todo[]) => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodosState] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      setIsLoaded(true);
      return;
    }

    const loadedTodos = loadTodos();
    setTodosState(loadedTodos);
    setIsLoaded(true);

    const handleTodosImported = () => {
      const updatedTodos = loadTodos();
      setTodosState(updatedTodos);
    };

    window.addEventListener('todosImported', handleTodosImported);
    return () => {
      window.removeEventListener('todosImported', handleTodosImported);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && isLocalStorageAvailable()) {
      saveTodos(todos);
    }
  }, [todos]);

  const addTodo = useCallback(
    (todo: Omit<Todo, 'id' | 'createdAt'>) => {
      const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order || 0)) : 0;
      const newTodo: Todo = {
        ...todo,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      };
      setTodosState((prev) => [...prev, newTodo]);
    },
    [todos]
  );

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodosState((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodosState((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodosState((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const newStatus = todo.status === TodoStatus.PENDING ? TodoStatus.COMPLETED : TodoStatus.PENDING;
          return {
            ...todo,
            status: newStatus,
            completedAt: newStatus === TodoStatus.COMPLETED ? new Date().toISOString() : null,
          };
        }
        return todo;
      })
    );
  }, []);

  const setTodos = useCallback((newTodos: Todo[]) => {
    setTodosState(newTodos);
  }, []);

  const reorderTodos = useCallback((reorderedTodos: Todo[]) => {
    setTodosState(reorderedTodos);
  }, []);

  return {
    todos,
    isLoaded,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setTodos,
    reorderTodos,
  };
}
