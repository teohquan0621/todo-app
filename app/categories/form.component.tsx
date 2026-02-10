"use client";

import { UseFormReturn } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type CategoryFormValues } from "./schema";

interface AddEditCategoryFormProps {
	form: UseFormReturn<CategoryFormValues>;
	editingCategory: boolean;
	isSubmitting: boolean;
	onSubmit: (values: CategoryFormValues) => void;
	onCancel: () => void;
}

export default function AddEditCategoryForm({ form, editingCategory, isSubmitting, onSubmit, onCancel }: AddEditCategoryFormProps) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter category name (e.g., Shopping, Health)..."
									autoFocus
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="color"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Color</FormLabel>
							<div className="cursor-pointer">
								<HexColorPicker color={field.value} onChange={field.onChange} />
							</div>
							<div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">
								<div
									className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600"
									style={{ backgroundColor: field.value }}
								/>
								<code className="text-sm font-mono flex-1">{field.value}</code>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-2 justify-end pt-4">
					<Button variant="outline" type="button" onClick={onCancel} className="cursor-pointer">
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting} className="cursor-pointer">
						{isSubmitting ? (editingCategory ? "Updating..." : "Adding...") : editingCategory ? "Update Category" : "Add Category"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
