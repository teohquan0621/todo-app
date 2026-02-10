"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import TodoList from "@/components/Todos/TodoList";
import CategoriesList from "@/components/Categories/CategoriesList";
import BulkImportCard from "@/components/Todos/BulkImportCard";
import { Navigation } from "@/components/Navigation";

export default function Home() {
	const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

	const handleToggleCategory = (categoryTitle: string) => {
		const newSelected = new Set(selectedCategories);
		if (newSelected.has(categoryTitle)) {
			newSelected.delete(categoryTitle);
		} else {
			newSelected.add(categoryTitle);
		}
		setSelectedCategories(newSelected);
	};

	const handleClearFilter = () => {
		setSelectedCategories(new Set());
	};
	
	return (
		<>
			<Navigation />
			
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<Card className="p-6">
						<TodoList selectedCategories={selectedCategories} sortOrder={sortOrder} onSortChange={setSortOrder} />
					</Card>
				</div>

				<div className="lg:col-span-1">
					<Card className="p-6">
						<CategoriesList selectedCategories={selectedCategories} onToggleCategory={handleToggleCategory} onClearFilter={handleClearFilter} />
					</Card>

					<Card className="p-6 mt-4">
						<BulkImportCard />
					</Card>
				</div>
			</div>
		</>
	);
}
