"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, ListTodo, Link as LinkIcon } from "lucide-react";

export function Navigation() {
	const pathname = usePathname();

	const isTasksPage = pathname === "/";
	const isCalendarPage = pathname === "/calendar";
	const isCategoriesPage = pathname === "/categories";

	return (
		<nav className="flex gap-2 mb-6">
			<Link href="/">
				<Button variant={isTasksPage ? "default" : "outline"} className="gap-2 cursor-pointer">
					<ListTodo className="h-4 w-4" />
					My Tasks
				</Button>
			</Link>

			<Link href="/calendar">
				<Button variant={isCalendarPage ? "default" : "outline"} className="gap-2 cursor-pointer">
					<Calendar className="h-4 w-4" />
					Calendar
				</Button>
			</Link>

			<Link href="/categories">
				<Button variant={isCategoriesPage ? "default" : "outline"} className="gap-2 cursor-pointer">
					<LinkIcon className="h-4 w-4" />
					Categories
				</Button>
			</Link>
		</nav>
	);
}
