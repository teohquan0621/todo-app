import { useState } from "react";
import { toast } from "sonner";
import { loadTodos, saveTodos, Todo } from "@/lib/storage";
import {
	generateId,
	validateTasks,
	parseCSV,
	parseExcel,
	type ParsedTask,
} from "@/lib/bulkImport";

export const useBulkImport = () => {
	const [isLoading, setIsLoading] = useState(false);

	const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsLoading(true);

		try {
			let parsedTasks: ParsedTask[] = [];
			if (file.type === "text/csv" || file.name.endsWith(".csv")) {
				parsedTasks = await parseCSV(file);
			} else if (file.type.includes("spreadsheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
				parsedTasks = await parseExcel(file);
			} else {
				toast.error("Invalid file type. Please upload CSV or Excel file.");
				return;
			}

			if (parsedTasks.length === 0) {
				toast.error("No tasks found in the file.");
				return;
			}

			const { valid, errors } = validateTasks(parsedTasks);
			if (errors.length > 0) {
				const errorMessage = errors.slice(0, 3).join("\n");
				const additionalErrors = errors.length > 3 ? `\n...and ${errors.length - 3} more errors` : "";
				toast.error(`Validation errors:\n${errorMessage}${additionalErrors}`);
				return;
			}

			const currentTodos = loadTodos();
			const newTodos: Todo[] = valid.map((task, index) => ({
				id: generateId(),
				title: task.title,
				description: task.description || null,
				category: task.category,
				dueDate: task.parsedDateISO,
				status: task.parsedStatus,
				createdAt: new Date().toISOString(),
				completedAt: task.parsedCompletedAt,
				order: currentTodos.length + index,
			}));

			saveTodos([...currentTodos, ...newTodos]);
			window.dispatchEvent(new Event('todosImported'));
			toast.success(`Successfully imported ${newTodos.length} tasks!`);

			event.target.value = "";
		} catch (error) {
			toast.error(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleImport };
};
