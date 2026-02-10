import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface TodoListHeaderProps {
	title: string;
	count?: number;
	isLoaded?: boolean;
	action?: ReactNode;
}

export default function TodoListHeader({ title, count, isLoaded = true, action }: TodoListHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">{title}</h2>
				{isLoaded && count !== undefined && (
					<Badge variant="black" className="ml-3 px-2.5 text-[14px]">
						{count}
					</Badge>
				)}
			</div>
			{action}
		</div>
	);
}
