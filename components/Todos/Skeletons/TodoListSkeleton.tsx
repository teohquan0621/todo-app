import { Skeleton } from "@/components/ui/skeleton";

interface TodoListSkeletonProps {
	count?: number;
}

export default function TodoListSkeleton({ count = 5 }: TodoListSkeletonProps) {
	return (
		<div className="space-y-3 w-full">
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton key={i} className="h-20 w-full rounded-lg" />
			))}
		</div>
	);
}
