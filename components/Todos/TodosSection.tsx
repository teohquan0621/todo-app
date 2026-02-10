"use client";

import { useMemo, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Todo, Category } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePagination } from "@/hooks/usePagination";
import DraggableTodoItem from "@/components/Todos/DraggableTodoItem";
import TodoListHeader from "@/components/Todos/TodoListHeader";
import PaginationControls from "@/components/Todos/Paginations/PaginationControls";
import TodoListSkeleton from "@/components/Todos/Skeletons/TodoListSkeleton";
import SortFilter from "@/components/Todos/SortFilter";

interface TodosSectionProps {
	title: string;
	todos: Todo[];
	isLoaded: boolean;
	categories: Category[];
	selectedCategories: Set<string>;
	showCompleted: boolean;
	sortOrder: "asc" | "desc" | null;
	onAddClick?: () => void;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	onEdit: (todo: Todo) => void;
	onView: (todo: Todo) => void;
	onReorder: (reorderedTodos: Todo[]) => void;
	onSortChange: (order: "asc" | "desc" | null) => void;
}

export default function TodosSection({
	title,
	todos,
	isLoaded,
	categories,
	selectedCategories,
	showCompleted,
	sortOrder,
	onAddClick,
	onToggle,
	onDelete,
	onEdit,
	onView,
	onReorder,
	onSortChange,
}: TodosSectionProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const filteredTodos = useMemo(() => {
		return todos
			.filter((todo) => (showCompleted ? todo.status === 'completed' : todo.status === 'pending'))
			.filter((todo) => (selectedCategories.size === 0 ? true : selectedCategories.has(todo.category)))
			.filter((todo) => {
				const query = debouncedSearchQuery.toLowerCase();
				return todo.title.toLowerCase().includes(query) || (todo.description && todo.description.toLowerCase().includes(query));
			})
			.sort((a, b) => {
				if (sortOrder !== null) {
					const dateA = new Date(showCompleted ? a.completedAt || a.dueDate : a.dueDate).getTime();
					const dateB = new Date(showCompleted ? b.completedAt || b.dueDate : b.dueDate).getTime();
					return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
				}

				if (showCompleted) {
					const completedAtA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
					const completedAtB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
					return completedAtB - completedAtA;
				} else {
					const orderA = a.order ?? Number.MAX_VALUE;
					const orderB = b.order ?? Number.MAX_VALUE;
					return orderA - orderB;
				}
			});
	}, [todos, selectedCategories, showCompleted, debouncedSearchQuery, sortOrder]);

	const { currentPage, totalPages, itemsPerPage, paginatedItems, goToNextPage, goToPreviousPage, goToPage, setItemsPerPage } = usePagination(
		filteredTodos,
		10,
	);

	const emptyMessage = showCompleted
		? "No completed tasks yet. Complete your first task to see it here!"
		: "No active tasks yet. Add your first task to get started!";

	const isFiltering = debouncedSearchQuery !== "" || selectedCategories.size > 0 || sortOrder !== null;

	const handleReorder = (draggedId: string, targetId: string) => {
		const draggedIndex = todos.findIndex((t) => t.id === draggedId);
		const targetIndex = todos.findIndex((t) => t.id === targetId);

		if (draggedIndex === -1 || targetIndex === -1) return;

		const newTodos = [...todos];
		const [draggedTodo] = newTodos.splice(draggedIndex, 1);
		newTodos.splice(targetIndex, 0, draggedTodo);

		const updatedTodos = newTodos.map((todo, index) => ({
			...todo,
			order: index + 1,
		}));

		onReorder(updatedTodos);
	};

	return (
		<div className="space-y-6">
			<TodoListHeader
				title={title}
				count={filteredTodos.length}
				isLoaded={isLoaded}
				action={
					onAddClick && !showCompleted ? (
						<Button size="default" onClick={onAddClick} className="cursor-pointer">
							<Plus className="mr-2 h-4 w-4" />
							Add Task
						</Button>
					) : undefined
				}
			/>

			<Separator />

			<div className="flex gap-3">
				<Input
					type="text"
					placeholder="Search tasks by title or description..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="flex-1"
				/>
				<SortFilter sortOrder={sortOrder} onSortChange={onSortChange} />
			</div>

			{!isLoaded ? (
				<TodoListSkeleton />
			) : filteredTodos.length === 0 ? (
				<div className="text-center text-muted-foreground py-12">
					<p>{emptyMessage}</p>
				</div>
			) : (
			<DndProvider backend={HTML5Backend}>
				<div className="space-y-3">
				{paginatedItems.map((todo, index) => (
					<DraggableTodoItem
						key={todo.id}
						todo={todo}
						categories={categories}
						onToggle={onToggle}
						onDelete={onDelete}
						onEdit={showCompleted ? () => {} : onEdit}
						onView={onView}
						onReorder={handleReorder}
						index={index}
						draggable={!showCompleted && !isFiltering}
					/>
				))}
				</div>
			</DndProvider>
		)}

		<PaginationControls
			currentPage={currentPage}
			totalPages={totalPages}
			itemsPerPage={itemsPerPage}
			onPreviousClick={goToPreviousPage}
			onNextClick={goToNextPage}
			onPageClick={goToPage}
			onItemsPerPageChange={setItemsPerPage}
		/>
	</div>
	);
}
