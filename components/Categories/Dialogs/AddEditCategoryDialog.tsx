"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Category } from "@/lib/storage";
import { categoryFormSchema, type CategoryFormValues } from "@/app/categories/schema";
import Form from "@/app/categories/form.component";

interface AddEditCategoryDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (title: string, color: string) => void;
	editingCategory?: Category | null;
	isSubmitting?: boolean;
	existingCategories: Category[];
}

export default function AddEditCategoryDialog({
	isOpen,
	onClose,
	onSubmit,
	editingCategory = null,
	isSubmitting = false,
	existingCategories,
}: AddEditCategoryDialogProps) {
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			title: "",
			color: "#3b82f6",
		},
	});

	useEffect(() => {
		if (editingCategory) {
			form.reset({
				title: editingCategory.title,
				color: editingCategory.color,
			});
		} else {
			form.reset({
				title: "",
				color: "#3b82f6",
			});
		}
	}, [editingCategory, isOpen, form]);

	const handleSubmit = (values: CategoryFormValues) => {
		if (editingCategory) {
			if (
				existingCategories.some(
					(cat) => cat.id !== editingCategory.id && cat.title.toLowerCase() === values.title.toLowerCase()
				)
			) {
				form.setError("title", { message: "This category name already exists" });
				return;
			}
		} else {
			if (existingCategories.some((cat) => cat.title.toLowerCase() === values.title.toLowerCase())) {
				form.setError("title", { message: "This category already exists" });
				return;
			}
		}

		onSubmit(values.title, values.color);
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
				</DialogHeader>

				<Form
					form={form}
					editingCategory={!!editingCategory}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					onCancel={handleClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
