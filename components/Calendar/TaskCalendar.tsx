"use client";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ms } from "date-fns/locale/ms";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Todo } from "@/lib/storage";
import { Category } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TodoFormDialog from "@/components/Todos/Dialogs/TodoFormDialog";

interface TaskCalendarProps {
	todos: Todo[];
	categories: Category[];
}

const locales = {
	ms: ms,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
	locale: "ms",
});

interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	resource: {
		todo: Todo;
		category: Category | undefined;
	};
}

export function TaskCalendar({ todos, categories }: TaskCalendarProps) {
	const [date, setDate] = useState(new Date());
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["pending"]);
	const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
	const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);

	const events: CalendarEvent[] = useMemo(() => {
		return todos
			.filter((todo) => {
				const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(todo.category);

				const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(todo.status);

				return categoryMatch && statusMatch;
			})
			.map((todo) => {
				const dueDate = new Date(todo.dueDate);
				const category = categories.find((cat) => cat.title === todo.category);
				return {
					id: todo.id,
					title: todo.title,
					start: new Date(dueDate.setHours(0, 0, 0, 0)),
					end: new Date(dueDate.setHours(23, 59, 59, 999)),
					resource: {
						todo,
						category,
					},
				};
			});
	}, [todos, categories, selectedCategories, selectedStatuses]);

	const eventStyleGetter = (event: CalendarEvent) => {
		const bgColor = event.resource.category?.color || "#6b7280";
		const style = {
			backgroundColor: bgColor,
			borderRadius: "4px",
			opacity: 0.9,
			color: "white",
			border: `1px solid ${bgColor}`,
			display: "block",
			padding: "2px 4px",
			fontSize: "12px",
			fontWeight: 500,
		};
		return { style };
	};

	const handlePrevMonth = () => {
		setDate(new Date(date.getFullYear(), date.getMonth() - 1));
	};

	const handleNextMonth = () => {
		setDate(new Date(date.getFullYear(), date.getMonth() + 1));
	};

	const handleToday = () => {
		setDate(new Date());
	};

	const toggleCategoryFilter = (categoryTitle: string) => {
		setSelectedCategories((prev) => (prev.includes(categoryTitle) ? prev.filter((cat) => cat !== categoryTitle) : [...prev, categoryTitle]));
	};

	const toggleStatusFilter = (status: string) => {
		setSelectedStatuses([status]);
	};

	return (
		<>
			<style>{`
				.rbc-date-cell {
					text-align: right;
					padding: 0.5rem;
				}
			`}</style>

			<div className="grid grid-cols-4 gap-4 mb-4">
				<Card className="w-full h-full p-4 col-span-3">
					<div className="flex flex-col gap-4 h-full">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold tracking-tight">{format(date, "MMMM yyyy")}</h2>
								<p className="text-sm text-muted-foreground">
									{events.length} upcoming {events.length === 1 ? "task" : "tasks"}
								</p>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" size="sm" onClick={handlePrevMonth}>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button variant="outline" size="sm" onClick={handleToday}>
									Today
								</Button>
								<Button variant="outline" size="sm" onClick={handleNextMonth}>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<div className="flex-1 rounded-lg border overflow-hidden">
							<Calendar
								localizer={localizer}
								events={events}
								startAccessor="start"
								endAccessor="end"
								style={{ height: "100%", minHeight: "500px" }}
								view="month"
								views={["month"]}
								date={date}
								onNavigate={setDate}
								eventPropGetter={eventStyleGetter}
								popup
								toolbar={false}
								components={{
									event: ({ event }: { event: CalendarEvent }) => (
										<div
											className="truncate text-xs p-1 cursor-pointer hover:opacity-75 transition-opacity"
											onClick={() => {
												setSelectedTodo(event.resource.todo);
												setIsTodoDialogOpen(true);
											}}
										>
											<span className="font-medium">{event.title}</span>
										</div>
									),
								}}
							/>
						</div>
					</div>
				</Card>

				<Card className="w-full h-full p-4">
					<div>
						<h3 className="text-sm font-semibold mb-3">Status</h3>
						<div className="flex flex-wrap gap-2 mb-4">
							<Button
								onClick={() => toggleStatusFilter("pending")}
								variant={selectedStatuses.includes("pending") ? "default" : "outline"}
								size="sm"
								className={
									selectedStatuses.includes("pending")
										? "bg-black hover:bg-gray-900 text-white cursor-pointer"
										: "opacity-60 cursor-pointer"
								}
								title="Filter by pending"
							>
								Pending
							</Button>
							<Button
								onClick={() => toggleStatusFilter("completed")}
								variant={selectedStatuses.includes("completed") ? "default" : "outline"}
								size="sm"
								className={
									selectedStatuses.includes("completed")
										? "bg-black hover:bg-gray-900 text-white cursor-pointer"
										: "opacity-60 cursor-pointer"
								}
								title="Filter by completed"
							>
								Completed
							</Button>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-semibold mb-3">Categories</h3>
						<div className="flex flex-wrap gap-2">
							{selectedCategories.length > 0 && (
								<button
									onClick={() => setSelectedCategories([])}
									className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-900 bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
									title="Clear all filters"
								>
									All
								</button>
							)}
							{categories.map((category) => (
								<button
									key={category.id}
									onClick={() => toggleCategoryFilter(category.title)}
									className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white transition-opacity cursor-pointer hover:opacity-90"
									style={{
										backgroundColor: category.color,
										opacity: selectedCategories.length === 0 || selectedCategories.includes(category.title) ? 1 : 0.7,
										outline: selectedCategories.includes(category.title) ? `2px solid ${category.color}` : "none",
										outlineOffset: selectedCategories.includes(category.title) ? "2px" : "0px",
									}}
									title={`Filter by ${category.title}`}
								>
									{category.title}
								</button>
							))}
						</div>
					</div>
				</Card>
			</div>

			<TodoFormDialog
				isOpen={isTodoDialogOpen}
				onClose={() => {
					setIsTodoDialogOpen(false);
				}}
				todo={selectedTodo}
				mode="view"
				categories={categories}
			/>
		</>
	);
}
