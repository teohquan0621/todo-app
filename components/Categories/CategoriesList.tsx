"use client";

import { useTodoCategories } from "@/hooks/useTodoCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

interface CategoriesListProps {
	selectedCategories: Set<string>;
	onToggleCategory: (categoryTitle: string) => void;
	onClearFilter: () => void;
}

export default function CategoriesList({ selectedCategories, onToggleCategory, onClearFilter }: CategoriesListProps) {
	const { categories, isLoaded } = useTodoCategories();

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-slate-900">Categories Filter</h2>
			</div>

			<div className="flex flex-wrap gap-2">
				{!isLoaded ? (
					<div className="flex flex-wrap gap-2 w-full">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-8 w-24 rounded-full" />
						))}
					</div>
				) : categories.length === 0 ? (
					<p className="text-sm text-slate-500">No categories yet. Create one to get started!</p>
				) : (
					<>
						{selectedCategories.size > 0 && (
							<button
								onClick={onClearFilter}
								className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-900 bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
								title="Clear all filters"
							>
								All
								<X className="h-3.5 w-3.5" />
							</button>
						)}
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => onToggleCategory(category.title)}
								className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white transition-opacity cursor-pointer hover:opacity-90"
								style={{
									backgroundColor: category.color,
									opacity: selectedCategories.has(category.title) ? 1 : 0.7,
									outline: selectedCategories.has(category.title) ? `2px solid ${category.color}` : 'none',
									outlineOffset: selectedCategories.has(category.title) ? '2px' : '0px',
								}}
								title={`Filter by ${category.title}`}
							>
								{category.title}
							</button>
						))}
					</>
				)}
			</div>
		</div>
	);
}
