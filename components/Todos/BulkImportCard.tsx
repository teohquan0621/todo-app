"use client";

import { FileUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBulkImport } from "@/hooks/useBulkImport";
import { useTodos } from "@/hooks/useTodos";
import { exportTasksToCSV, exportTasksToExcel } from "@/lib/bulkImport";
import { Separator } from "../ui/separator";

export default function BulkImportCard() {
	const { isLoading, handleImport } = useBulkImport();
	const { todos } = useTodos();

	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-sm">Bulk Import & Export</h3>
			<p className="text-xs text-muted-foreground mb-4">
				Import tasks from CSV or Excel files. Columns: title, description (optional), category, dueDate, status, completedAt (optional)
			</p>

			<label htmlFor="bulk-import-input">
				<Button variant="outline" size="sm" asChild className="w-full cursor-pointer">
					<span>
						<FileUp className="w-4 h-4 mr-2" />
						Choose File
					</span>
				</Button>
				<input id="bulk-import-input" type="file" accept=".csv, .xlsx, .xls" onChange={handleImport} disabled={isLoading} className="hidden" />
			</label>

			<div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
				<p>
					<strong>CSV Format:</strong>
				</p>
				<div className="block bg-muted p-2 rounded text-xs">title, description, category, dueDate, status, completedAt</div>
				<p>
					<strong>Example:</strong>
				</p>
				<div className="block bg-muted p-2 rounded text-xs">Buy groceries, Milk and eggs, Personal, 2026-02-15, completed, 2026-02-15</div>
				<p className="text-xs mt-2">
					<strong>Notes:</strong> status accepts "pending" or "completed" (case-insensitive). completedAt is optional and only used if status is completed.
				</p>
			</div>

            <Separator className="my-6" />

			<div className="grid grid-cols-2 gap-3">
				<Button variant="black" size="sm" onClick={() => exportTasksToCSV(todos)} disabled={todos.length === 0} className="w-full cursor-pointer">
					<Download className="w-4 h-4 mr-2" />
					Export to CSV
				</Button>
				<Button variant="black" size="sm" onClick={() => exportTasksToExcel(todos)} disabled={todos.length === 0} className="w-full cursor-pointer">
					<Download className="w-4 h-4 mr-2" />
					Export to Excel
				</Button>
			</div>
		</div>
	);
}
