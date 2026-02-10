"use client";

import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteCategoryDialogProps {
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export default function DeleteCategoryDialog({ isOpen, onCancel, onConfirm }: DeleteCategoryDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Category</AlertDialogTitle>
					<AlertDialogDescription>Are you sure you want to delete this category? This action cannot be undone.</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex gap-2 justify-end">
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
						Delete
					</AlertDialogAction>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
