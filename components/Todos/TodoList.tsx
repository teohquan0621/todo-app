"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useTodoCategories } from "@/hooks/useTodoCategories";
import { Todo, TodoStatus } from "@/lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodoFormDialog from "@/components/Todos/Dialogs/TodoFormDialog";
import ConfirmDialog from "@/components/Todos/Dialogs/ConfirmDialog";
import TodosSection from "@/components/Todos/TodosSection";

interface TodoListProps {
	selectedCategories: Set<string>;
	sortOrder: "asc" | "desc" | null;
	onSortChange: (order: "asc" | "desc" | null) => void;
}

export default function TodoList({ selectedCategories, sortOrder, onSortChange }: TodoListProps) {
	const { todos, isLoaded, addTodo, deleteTodo, updateTodo, toggleTodo, reorderTodos } = useTodos();
	const { categories } = useTodoCategories();
	const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);
	const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
	const [todoDialogMode, setTodoDialogMode] = useState<"add" | "edit" | "view">("add");
	const [confirmDialog, setConfirmDialog] = useState<{
		isOpen: boolean;
		type: "delete" | "toggle" | null;
		todoId: string | null;
	}>({
		isOpen: false,
		type: null,
		todoId: null,
	});

	const handleAddTodo = (todoData: { title: string; description?: string | null; category: string; dueDate: string; status: TodoStatus }) => {
		addTodo(todoData);
		setIsTodoDialogOpen(false);
		setSelectedTodo(null);
	};

	const handleEditTodo = (todo: Todo) => {
		setSelectedTodo(todo);
		setTodoDialogMode("edit");
		setIsTodoDialogOpen(true);
	};

	const handleUpdateTodo = (updatedTodo: Todo) => {
		updateTodo(updatedTodo.id, updatedTodo);
		setIsTodoDialogOpen(false);
		setSelectedTodo(null);
	};

	const handleCloseTodoDialog = () => {
		setIsTodoDialogOpen(false);
		setSelectedTodo(null);
		setTodoDialogMode("add");
	};

	const handleViewTodo = (todo: Todo) => {
		setSelectedTodo(todo);
		setTodoDialogMode("view");
		setIsTodoDialogOpen(true);
	};

	const handleDeleteTodo = (id: string) => {
		setConfirmDialog({
			isOpen: true,
			type: "delete",
			todoId: id,
		});
	};

	const confirmDelete = () => {
		if (confirmDialog.todoId) {
			deleteTodo(confirmDialog.todoId);
			setConfirmDialog({ isOpen: false, type: null, todoId: null });
		}
	};

	const handleToggleTodo = (id: string) => {
		setConfirmDialog({
			isOpen: true,
			type: "toggle",
			todoId: id,
		});
	};

	const confirmToggle = () => {
		if (confirmDialog.todoId) {
			toggleTodo(confirmDialog.todoId);
			setConfirmDialog({ isOpen: false, type: null, todoId: null });
		}
	};

	const todoToToggle = confirmDialog.todoId ? todos.find((t) => t.id === confirmDialog.todoId) : null;
	const isTogglingComplete = todoToToggle?.status === 'completed' ? true : false;

	return (
		<>
			<Tabs defaultValue="active" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="active">Active Tasks</TabsTrigger>
					<TabsTrigger value="completed">Completed Tasks</TabsTrigger>
				</TabsList>

				<TabsContent value="active" className="space-y-6 mt-6">
					<TodosSection
						title="Active Tasks"
						todos={todos}
						isLoaded={isLoaded}
						categories={categories}
						selectedCategories={selectedCategories}
						showCompleted={false}
						sortOrder={sortOrder}
						onAddClick={() => {
							setSelectedTodo(null);
							setIsTodoDialogOpen(true);
						}}
						onToggle={handleToggleTodo}
						onDelete={handleDeleteTodo}
						onEdit={handleEditTodo}
						onView={handleViewTodo}
						onReorder={reorderTodos}
						onSortChange={onSortChange}
					/>
				</TabsContent>

				<TabsContent value="completed" className="mt-6">
					<TodosSection
						title="Completed Tasks"
						todos={todos}
						isLoaded={isLoaded}
						categories={categories}
						selectedCategories={selectedCategories}
						showCompleted={true}
						sortOrder={sortOrder}
						onDelete={handleDeleteTodo}
						onView={handleViewTodo}
						onToggle={handleToggleTodo}
						onEdit={() => {}}
						onReorder={reorderTodos}
						onSortChange={onSortChange}
					/>
				</TabsContent>
			</Tabs>

			<TodoFormDialog
				isOpen={isTodoDialogOpen}
				onClose={handleCloseTodoDialog}
				todo={selectedTodo}
				mode={todoDialogMode}
				onAddTodo={handleAddTodo}
				onUpdateTodo={handleUpdateTodo}
				categories={categories}
			/>

			<ConfirmDialog
				isOpen={confirmDialog.isOpen}
				onOpenChange={(open) => {
					if (!open) {
						setConfirmDialog({ isOpen: false, type: null, todoId: null });
					}
				}}
				onConfirm={confirmDialog.type === "delete" ? confirmDelete : confirmToggle}
				title={confirmDialog.type === "delete" ? "Delete Task" : isTogglingComplete ? "Mark as Pending" : "Mark as Complete"}
				description={
					confirmDialog.type === "delete"
						? "Are you sure you want to delete this task? This action cannot be undone."
						: isTogglingComplete
							? "Are you sure you want to mark this task as pending? It will move back to your active tasks."
							: "Are you sure you want to mark this task as complete?"
				}
				confirmText={confirmDialog.type === "delete" ? "Delete" : isTogglingComplete ? "Mark as Pending" : "Mark as Complete"}
				isDangerous={confirmDialog.type === "delete"}
			/>
		</>
	);
}
