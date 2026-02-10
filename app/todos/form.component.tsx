"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/storage";
import { type TodoFormValues } from "./schema";

interface TodoDialogFormProps {
	form: UseFormReturn<TodoFormValues>;
	isEditMode: boolean;
	isSubmitting: boolean;
	categories: Category[];
	onSubmit: (values: TodoFormValues) => void;
	onCancel: () => void;
}

export default function TodoDialogForm({ form, isEditMode, isSubmitting, categories, onSubmit, onCancel }: TodoDialogFormProps) {
	const submitButtonText = isEditMode ? "Save Changes" : "Add Task";
	const submitButtonLoadingText = isEditMode ? "Saving..." : "Adding...";

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Enter task title..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="Enter task description (optional)..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="cursor-pointer">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.length === 0 ? (
										<div className="px-2 py-1.5 text-sm text-muted-foreground">No categories available. Create one first.</div>
									) : (
										categories.map((cat) => (
											<SelectItem key={cat.id} value={cat.title}>
												<div className="flex items-center gap-2">
													<div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
													{cat.title}
												</div>
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="dueDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Due Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-start text-left font-normal cursor-pointer",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? format(field.value, "PPP") : "Pick a date"}
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={!isEditMode ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0)) : undefined}
										autoFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-2 justify-end pt-4">
					<Button variant="outline" type="button" onClick={onCancel} className="cursor-pointer">
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting} className="cursor-pointer">
						{isSubmitting ? submitButtonLoadingText : submitButtonText}
					</Button>
				</div>
			</form>
		</Form>
	);
}
