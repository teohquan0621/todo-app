"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { useTodoCategories } from "@/hooks/useTodoCategories";
import { useTodos } from "@/hooks/useTodos";
import { Category } from "@/lib/storage";
import AddEditCategoryDialog from "@/components/Categories/Dialogs/AddEditCategoryDialog";
import DeleteCategoryDialog from "@/components/Categories/Dialogs/DeleteCategoryDialog";

const generateUniqueId = () => {
	return `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function CategoriesPageClient() {
	const { categories, isLoaded, addCategory, deleteCategory, updateCategory } = useTodoCategories();
	const { todos } = useTodos();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

	const countTodosUsingCategory = (categoryTitle: string): number => {
		return todos.filter(todo => todo.category === categoryTitle).length;
	};

	const handleAddCategory = (title: string, color: string) => {
		setIsSubmitting(true);

		try {
			if (editingCategory) {
				updateCategory(editingCategory.id, {
					title: title,
					color: color,
				});
				toast.success("Category updated successfully");
			} else {
				const newCategory: Category = {
					id: generateUniqueId(),
					title: title,
					color: color,
				};
				addCategory(newCategory);
				toast.success("Category added successfully");
			}
			setEditingCategory(null);
			setIsDialogOpen(false);
		} catch (error) {
			toast.error(editingCategory ? "Failed to update category" : "Failed to add category");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteCategory = (categoryId: string) => {
		setDeleteConfirmId(categoryId);
	};

	const handleConfirmDelete = () => {
		if (deleteConfirmId) {
			try {
				deleteCategory(deleteConfirmId);
				toast.success("Category deleted successfully");
				setDeleteConfirmId(null);
			} catch (error) {
				toast.error("Failed to delete category");
				console.error(error);
			}
		}
	};

	const handleEditCategory = (category: Category) => {
		setEditingCategory(category);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingCategory(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-slate-900">All Categories</h3>
				<Button onClick={() => setIsDialogOpen(true)} size="sm" className="gap-2 cursor-pointer">
					<Plus className="h-4 w-4" />
					New Category
				</Button>
			</div>
			<div className="space-y-2">
				{!isLoaded ? (
					<div className="space-y-2">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-12 w-full rounded-md" />
						))}
					</div>
				) : categories.length === 0 ? (
						<p className="text-sm text-slate-500 py-4">No categories yet. Create one to get started!</p>
				) : (
					categories.map((category) => (
						<div
							key={category.id}
							className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
						>
							<div
								className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0"
								style={{ backgroundColor: category.color }}
							/>
							<span className="text-sm font-medium text-slate-900 flex-1">{category.title}</span>
							<code className="text-xs text-slate-500 font-mono">{category.color}</code>
							<button
								onClick={() => handleEditCategory(category)}
								className="p-2 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
								title="Edit category"
							>
								<Edit2 className="h-4 w-4 text-slate-600" />
							</button>
							<button
								onClick={() => handleDeleteCategory(category.id)}
								disabled={countTodosUsingCategory(category.title) > 0}
								className="p-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-100 disabled:hover:bg-transparent"
								title={countTodosUsingCategory(category.title) > 0 ? `Cannot delete: ${countTodosUsingCategory(category.title)} task(s) using this category` : "Delete category"}
							>
								<Trash2 className="h-4 w-4 text-red-600" />
							</button>
						</div>
					))
				)}
			</div>

			<AddEditCategoryDialog
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
				onSubmit={handleAddCategory}
				editingCategory={editingCategory}
				isSubmitting={isSubmitting}
				existingCategories={categories}
			/>

			<DeleteCategoryDialog isOpen={deleteConfirmId !== null} onCancel={() => setDeleteConfirmId(null)} onConfirm={handleConfirmDelete} />
		</div>
	);
}
