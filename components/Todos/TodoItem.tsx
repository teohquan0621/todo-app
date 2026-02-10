"use client";

import { Todo, Category } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Eye, RotateCcw, AlertCircle } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	onEdit: (todo: Todo) => void;
	onView: (todo: Todo) => void;
	categories: Category[];
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onView, categories }: TodoItemProps) {
	const dueDate = parseISO(todo.dueDate);
	const isOverdue = todo.status !== 'completed' && isPast(dueDate) && new Date(todo.dueDate).toDateString() !== new Date().toDateString();
	const isCompleted = todo.completedAt !== null && todo.completedAt !== undefined;
	const formattedDate = format(dueDate, "MMM dd, yyyy");
	const formattedCompletedDateWithTime = isCompleted && todo.completedAt ? format(parseISO(todo.completedAt), "MMM dd, yyyy 'at' hh:mm a") : "";

	const categoryColor = categories.find((cat) => cat.title === todo.category)?.color || "#6b7280";

	const hexToRgba = (hex: string, alpha: number): string => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	return (
		<div
			className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
			style={{ backgroundColor: hexToRgba(categoryColor, 0.08) }}
		>
			{!isCompleted && <Checkbox checked={todo.status === 'completed'} onCheckedChange={() => onToggle(todo.id)} className="h-5 w-5 mt-1 cursor-pointer bg-white" />}

			<div className="flex-1 min-w-0">
				<div className="flex items-start gap-3">
					<div className="flex-1">
						<h3 className={"text-base font-semibold break-words"}>{todo.title}</h3>

						<div className="mt-3 flex flex-wrap items-center gap-2">
							<Badge className="text-white" style={{ backgroundColor: categoryColor }}>
								{todo.category}
							</Badge>
							{isCompleted ? (
								<Badge className="bg-green-500 hover:bg-green-600 text-white">
									Completed on {formattedCompletedDateWithTime}
								</Badge>
							) : (
								<>
									{isOverdue ? (
										<Badge className="bg-red-500 hover:bg-red-600 text-white gap-1.5">
											<AlertCircle className="h-3.5 w-3.5" />
											Overdue on {formattedDate}
										</Badge>
									) : (
												<Badge className="bg-slate-200 text-slate-900">Due on {formattedDate}</Badge>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-2 flex-shrink-0">
				<Button variant="ghost" size="sm" onClick={() => onView(todo)} className="h-8 w-8 p-0 cursor-pointer" title="View details">
					<Eye className="h-4 w-4" />
				</Button>
				{!isCompleted && (
					<Button variant="ghost" size="sm" onClick={() => onEdit(todo)} className="h-8 w-8 p-0 cursor-pointer">
						<Edit2 className="h-4 w-4" />
					</Button>
				)}
				{isCompleted && (
					<Button variant="ghost" size="sm" onClick={() => onToggle(todo.id)} className="h-8 w-8 p-0 cursor-pointer" title="Mark as incomplete">
						<RotateCcw className="h-4 w-4" />
					</Button>
				)}
				<Button variant="ghost" size="sm" onClick={() => onDelete(todo.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 cursor-pointer">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
