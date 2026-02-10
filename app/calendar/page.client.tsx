"use client";

import { useTodos } from "@/hooks/useTodos";
import { useTodoCategories } from "@/hooks/useTodoCategories";
import { TaskCalendar } from "@/components/Calendar/TaskCalendar";
import { Navigation } from "@/components/Navigation";

export default function CalendarPageClient() {
	const { todos, isLoaded: todosLoaded } = useTodos();
	const { categories, isLoaded: categoriesLoaded } = useTodoCategories();

	if (!todosLoaded || !categoriesLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading calendar...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<Navigation />
			<TaskCalendar todos={todos} categories={categories} />
		</div>
	);
}
