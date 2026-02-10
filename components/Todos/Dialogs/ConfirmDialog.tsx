"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	isDangerous?: boolean;
}

export default function ConfirmDialog({
	isOpen,
	onOpenChange,
	onConfirm,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	isDangerous = false,
}: ConfirmDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex justify-end gap-2">
					<AlertDialogCancel className="cursor-pointer">{cancelText}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={isDangerous ? "bg-red-600 hover:bg-red-700 cursor-pointer" : "cursor-pointer"}
					>
						{confirmText}
					</AlertDialogAction>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
