import { parse as parseDateFns, isValid, startOfDay } from "date-fns";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import * as XLSX from "xlsx";
import { loadCategories, type Todo, TodoStatus } from "./storage";

export interface ParsedTask {
	title: string;
	description?: string;
	category: string;
	dueDate: string;
	status: TodoStatus;
	completedAt?: string;
}

export interface ValidatedTask extends ParsedTask {
	parsedDateISO: string;
	parsedStatus: TodoStatus;
	parsedCompletedAt: string | null;
}

export const generateId = () => {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const parseDate = (dateString: string): { date: Date | null; error: string | null } => {
	const trimmed = dateString?.toString().trim();
	if (!trimmed) {
		return { date: null, error: "Due date is required" };
	}

	const formats = [
		"dd-MM-yyyy",
		"MM-dd-yyyy",
		"yyyy-MM-dd",
		"dd/MM/yyyy",
		"MM/dd/yyyy",
		"yyyy/MM/dd",
		"dd-MM-yyyy HH:mm",
		"MM-dd-yyyy HH:mm",
		"yyyy-MM-dd HH:mm",
		"dd/MM/yyyy HH:mm",
		"MM/dd/yyyy HH:mm",
		"yyyy/MM/dd HH:mm",
		"dd-MM-yyyy HH:mm:ss",
		"MM-dd-yyyy HH:mm:ss",
		"yyyy-MM-dd HH:mm:ss",
		"dd/MM/yyyy HH:mm:ss",
		"MM/dd/yyyy HH:mm:ss",
		"yyyy/MM/dd HH:mm:ss",
	];
	for (const format of formats) {
		try {
			const parsed = parseDateFns(trimmed, format, new Date());
			if (isValid(parsed)) return { date: parsed, error: null };
		} catch {
		}
	}

	const nativeDate = new Date(trimmed);
	if (isValid(nativeDate)) return { date: nativeDate, error: null };

	return { date: null, error: "Invalid date format" };
};

export const validateTitle = (title: string): string | null => {
	const trimmed = title?.toString().trim();
	if (!trimmed) return "Title is required";
	if (trimmed.length < 3) return "Title must be at least 3 characters";
	if (trimmed.length > 100) return "Title must not exceed 100 characters";
	return null;
};

export const validateDescription = (description: string | undefined): string | null => {
	if (!description) return null;
	if (description.toString().length > 500) return "Description must not exceed 500 characters";
	return null;
};

export const validateCategory = (category: string, categoryTitles: Set<string>): string | null => {
	const trimmed = category?.toString().trim();
	if (!trimmed) return "Category is required";
	if (!categoryTitles.has(trimmed)) return `Category "${trimmed}" does not exist`;
	return null;
};

export const validateDate = (dateString: string): { error: string | null; parsedDate: Date | null } => {
	const { date, error } = parseDate(dateString);
	if (error) return { error, parsedDate: null };
	if (date && date < startOfDay(new Date())) return { error: "Due date must be today or later", parsedDate: null };
	return { error: null, parsedDate: date };
};

export const parseStatus = (statusString: string): TodoStatus => {
	const trimmed = statusString?.toString().trim().toLowerCase();
	if (trimmed === "completed") return TodoStatus.COMPLETED;
	return TodoStatus.PENDING;
};

export const validateCompletedAt = (completedAtString: string | undefined, status: TodoStatus): { error: string | null; date: string | null } => {
	if (status !== TodoStatus.COMPLETED || !completedAtString) {
		return { error: null, date: null };
	}

	const { date, error } = parseDate(completedAtString);
	if (error) return { error: "Invalid completedAt date format", date: null };
	if (!date) return { error: null, date: null };

	return { error: null, date: date.toISOString() };
};

export const validateTasks = (tasks: ParsedTask[]): { valid: ValidatedTask[]; errors: string[] } => {
	const errors: string[] = [];
	const validTasks: ValidatedTask[] = [];
	const categories = loadCategories();
	const categoryTitles = new Set(categories.map((c) => c.title));

	tasks.forEach((task, index) => {
		const rowErrors: string[] = [];
		let parsedDate: Date | null = null;

		const titleError = validateTitle(task.title);
		if (titleError) rowErrors.push(titleError);

		const descError = validateDescription(task.description);
		if (descError) rowErrors.push(descError);

		const categoryError = validateCategory(task.category, categoryTitles);
		if (categoryError) rowErrors.push(categoryError);

		const { error: dateError, parsedDate: pDate } = validateDate(task.dueDate);
		if (dateError) rowErrors.push(dateError);
		else parsedDate = pDate;

		const { error: completedAtError, date: parsedCompletedAtDate } = validateCompletedAt(task.completedAt, parseStatus(task.status));
		if (completedAtError) rowErrors.push(completedAtError);

		if (rowErrors.length > 0) {
			errors.push(`Row ${index + 1}: ${rowErrors.join(", ")}`);
		} else if (parsedDate) {
			validTasks.push({
				title: task.title.trim(),
				description: task.description?.trim() || undefined,
				category: task.category.trim(),
				dueDate: task.dueDate,
				status: task.status,
				completedAt: task.completedAt,
				parsedDateISO: parsedDate.toISOString().split("T")[0],
				parsedStatus: parseStatus(task.status),
				parsedCompletedAt: parsedCompletedAtDate,
			});
		}
	});

	return { valid: validTasks, errors };
};

export const parseCSV = (file: File): Promise<ParsedTask[]> => {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results: ParseResult<ParsedTask>) => {
				const tasks = results.data as ParsedTask[];
				resolve(tasks);
			},
			error: (error: Error) => {
				reject(new Error(`CSV parsing failed: ${error.message}`));
			},
		});
	});
};

export const parseExcel = (file: File): Promise<ParsedTask[]> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const workbook = XLSX.read(e.target?.result, { type: "array" });
				const sheet = workbook.Sheets[workbook.SheetNames[0]];
				let tasks = XLSX.utils.sheet_to_json<ParsedTask>(sheet);

				const excelDateToISO = (excelDate: number, includeTime: boolean = false): string => {
					const date = new Date((excelDate - 25569) * 86400 * 1000);
					const year = date.getUTCFullYear();
					const month = String(date.getUTCMonth() + 1).padStart(2, "0");
					const day = String(date.getUTCDate()).padStart(2, "0");
					
					if (includeTime) {
						const hours = String(date.getUTCHours()).padStart(2, "0");
						const minutes = String(date.getUTCMinutes()).padStart(2, "0");
						const seconds = String(date.getUTCSeconds()).padStart(2, "0");
						return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
					}
					
					return `${year}-${month}-${day}`;
				};

				tasks = tasks.map((task) => {
					const converted: ParsedTask = { ...task };
					
					if (typeof task.dueDate === "number") {
						converted.dueDate = excelDateToISO(task.dueDate);
					}
					
					if (typeof task.completedAt === "number") {
						converted.completedAt = excelDateToISO(task.completedAt, true);
					}

					return converted;
				});

				resolve(tasks);
			} catch (error) {
				reject(new Error(`Excel parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`));
			}
		};
		reader.onerror = () => reject(new Error("File reading failed"));
		reader.readAsArrayBuffer(file);
	});
};

export const exportTasksToCSV = (tasks: Todo[]) => {
	if (tasks.length === 0) {
		return;
	}

	const headers = ["title", "description", "category", "dueDate", "status", "completedAt"];
	const rows = tasks.map((task) => [
		`"${(task.title || "").replace(/"/g, '""')}"`,
		`"${(task.description || "").replace(/"/g, '""')}"`,
		`"${(task.category || "").replace(/"/g, '""')}"`,
		task.dueDate,
		task.status,
		task.completedAt || "",
	]);

	const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", `tasks-${new Date().toISOString().split("T")[0]}.csv`);
	link.style.visibility = "hidden";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

export const exportTasksToExcel = (tasks: Todo[]) => {
	if (tasks.length === 0) {
		return;
	}

	const data = tasks.map((task) => ({
		Title: task.title,
		Description: task.description || "",
		Category: task.category,
		"Due Date": task.dueDate,
		Status: task.status,
		"Completed At": task.completedAt || "",
	}));

	const worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

	const fileName = `tasks-${new Date().toISOString().split("T")[0]}.xlsx`;
	XLSX.writeFile(workbook, fileName);
};
