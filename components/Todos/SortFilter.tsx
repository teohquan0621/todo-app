"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SortFilterProps {
	sortOrder: "asc" | "desc" | null;
	onSortChange: (order: "asc" | "desc" | null) => void;
}

export default function SortFilter({ sortOrder, onSortChange }: SortFilterProps) {
	return (
		<Select value={sortOrder || "default"} onValueChange={(value) => {
			if (value === "default") onSortChange(null);
			else onSortChange(value as "asc" | "desc");
		}}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Sort by due date" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="default">Default</SelectItem>
				<SelectItem value="asc">Earliest First</SelectItem>
				<SelectItem value="desc">Latest First</SelectItem>
			</SelectContent>
		</Select>
	);
}
