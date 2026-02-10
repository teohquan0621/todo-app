import CalendarPageClient from "./page.client";

export default function CalendarPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<main className="container mx-auto max-w-7xl px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Calendar View</h1>
					<p className="mt-2 text-lg text-slate-600 dark:text-slate-400">View your tasks by due date with category-based colors</p>
				</div>

				<CalendarPageClient />
			</main>
		</div>
	);
}
