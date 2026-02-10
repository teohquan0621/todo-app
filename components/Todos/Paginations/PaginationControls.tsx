import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
	onPreviousClick: () => void;
	onNextClick: () => void;
	onPageClick?: (page: number) => void;
	onItemsPerPageChange?: (value: number) => void;
}

export default function PaginationControls({
	currentPage,
	totalPages,
	itemsPerPage,
	onPreviousClick,
	onNextClick,
	onPageClick,
	onItemsPerPageChange,
}: PaginationControlsProps) {
	const handlePageClick = (page: number) => {
		if (onPageClick) {
			onPageClick(page);
		}
	};

	return (
		<div className="flex pt-6 items-center gap-4">
			<Select value={String(itemsPerPage)} onValueChange={(value) => onItemsPerPageChange?.(Number(value))}>
				<SelectTrigger className="w-fit cursor-pointer">
					<SelectValue placeholder="Items per page" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="5">5 per page</SelectItem>
					<SelectItem value="10">10 per page</SelectItem>
					<SelectItem value="25">25 per page</SelectItem>
					<SelectItem value="50">50 per page</SelectItem>
				</SelectContent>
			</Select>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={onPreviousClick}
							className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
							aria-disabled={currentPage === 1}
						/>
					</PaginationItem>

					<PaginationItem>
						<Select value={String(currentPage)} onValueChange={(value) => handlePageClick(Number(value))}>
							<SelectTrigger className="w-fit cursor-pointer">
								<SelectValue placeholder="Select page" />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<SelectItem key={page} value={String(page)}>
										Page {page} of {totalPages}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</PaginationItem>

					<PaginationItem>
						<PaginationNext
							onClick={onNextClick}
							className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
							aria-disabled={currentPage === totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
