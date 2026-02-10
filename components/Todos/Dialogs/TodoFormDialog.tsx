"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Todo, Category, TodoStatus } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseISO, format } from "date-fns";
import { toast } from "sonner";
import { todoFormSchema, type TodoFormValues } from "@/app/todos/schema";
import Form from "@/app/todos/form.component";

interface TodoDialogProps {
	isOpen: boolean;
	onClose: () => void;
	todo?: Todo | null;
	mode: "add" | "edit" | "view";
	onAddTodo?: (todo: { title: string; description?: string | null; category: string; dueDate: string; status: TodoStatus }) => void;
	onUpdateTodo?: (todo: Todo) => void;
	categories: Category[];
}

export default function TodoDialog({ isOpen, onClose, todo = null, mode, onAddTodo, onUpdateTodo, categories }: TodoDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isAddMode = mode === "add";
	const isEditMode = mode === "edit";
	const isViewMode = mode === "view";

	const form = useForm<TodoFormValues>({
		resolver: zodResolver(todoFormSchema),
		defaultValues: {
			title: "",
			description: "",
			category: categories[0]?.title || "Work",
			dueDate: new Date(),
		},
	});

	useEffect(() => {
		if (todo && isOpen) {
			form.reset({
				title: todo.title,
				description: todo.description ?? "",
				category: todo.category,
				dueDate: parseISO(todo.dueDate),
				status: todo.status,
			});
		} else if (!todo && isOpen) {
			form.reset({
				title: "",
				description: "",
				category: categories[0]?.title || "Work",
				dueDate: new Date(),
			});
		}
	}, [todo, isOpen, categories, form, mode]);

	const handleSubmit = async (values: TodoFormValues) => {
		setIsSubmitting(true);
		try {
			if (isEditMode && todo && onUpdateTodo) {
				onUpdateTodo({
					...todo,
					title: values.title,
					description: values.description || null,
					category: values.category,
					dueDate: values.dueDate.toISOString(),
				});
				toast.success("Task updated successfully");
			} else if (isAddMode && onAddTodo) {
				onAddTodo({
					title: values.title,
					description: values.description || null,
					category: values.category,
					dueDate: values.dueDate.toISOString(),
					status: TodoStatus.PENDING,
				});
				toast.success("Task added successfully");
			}

			form.reset();
			onClose();
		} catch (error) {
			toast.error(isEditMode ? "Failed to update task" : "Failed to add task");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	const title = isViewMode ? "Task Details" : isEditMode ? "Edit Task" : "Add New Task";

	const categoryColor = isViewMode && todo
		? categories.find((cat) => cat.title === todo.category)?.color || "#6b7280"
		: "#6b7280";

	const dueDate = isViewMode && todo ? parseISO(todo.dueDate) : null;

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent key={mode} className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{isViewMode && todo ? (

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<h4 className="text-sm font-semibold text-slate-700">Title</h4>
							<p className="text-base">{todo.title}</p>
						</div>

						{todo.description && (
							<div className="space-y-2">
								<h4 className="text-sm font-semibold text-slate-700">Description</h4>
								<p className="text-sm p-3 rounded-md bg-muted">
									{todo.description}
								</p>
							</div>
						)}

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<h4 className="text-sm font-semibold text-slate-700">Category</h4>
								<Badge className="text-white w-fit" style={{ backgroundColor: categoryColor }}>
									{todo.category}
								</Badge>
							</div>

							<div className="space-y-2">
								<h4 className="text-sm font-semibold text-slate-700">Due Date</h4>
								<p className="text-sm">{dueDate ? format(dueDate, "MMM dd, yyyy") : "-"}</p>
							</div>
						</div>

						<div className="space-y-2">
							<h4 className="text-sm font-semibold text-slate-700">Status</h4>
							<Badge variant={todo.status === TodoStatus.PENDING ? "default" : "secondary"}>{todo.status === TodoStatus.COMPLETED ? "Completed" : "Pending"}</Badge>
						</div>

						{todo.createdAt && (
							<div className="space-y-2 text-xs text-muted-foreground">
								<p>Created: {format(parseISO(todo.createdAt), "MMM dd, yyyy hh:mm a")}</p>
								{todo.completedAt && <p>Completed: {format(parseISO(todo.completedAt), "MMM dd, yyyy hh:mm a")}</p>}
							</div>
						)}
					</div>
				) : (

					<Form
						form={form}
						isEditMode={isEditMode}
						isSubmitting={isSubmitting}
						categories={categories}
						onSubmit={handleSubmit}
						onCancel={() => handleOpenChange(false)}
					/>
				)}

				{isViewMode && (
					<DialogFooter>
						<Button onClick={onClose} className="cursor-pointer">
							Close
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
