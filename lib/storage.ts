const TODOS_STORAGE_KEY = 'todos';
const CATEGORIES_STORAGE_KEY = 'todoCategories';

export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export interface Category {
  id: string;
  title: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  dueDate: string;
  status: TodoStatus;
  createdAt: string;
  completedAt?: string | null;
  order?: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', title: 'Work', color: '#3b82f6' },
  { id: '2', title: 'Personal', color: '#8b5cf6' },
  { id: '3', title: 'Urgent', color: '#ef4444' },
];

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
}

export function loadTodos(): Todo[] {
  try {
    const saved = localStorage.getItem(TODOS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    return [];
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories to localStorage:', error);
  }
}

export function loadCategories(): Category[] {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error loading categories from localStorage:', error);
    return DEFAULT_CATEGORIES;
  }
}

export function clearTodos(): void {
  try {
    localStorage.removeItem(TODOS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing todos from localStorage:', error);
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const test = 'testing_localStorage';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
