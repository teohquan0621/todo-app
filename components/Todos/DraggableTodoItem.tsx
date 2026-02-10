"use client";

import { useDrag, useDrop } from "react-dnd";
import { Todo, Category } from "@/lib/storage";
import TodoItem from "@/components/Todos/TodoItem";

interface DraggableTodoItemProps {
	todo: Todo;
	categories: Category[];
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	onEdit: (todo: Todo) => void;
	onView: (todo: Todo) => void;
	onReorder: (draggedId: string, targetId: string) => void;
	index: number;
	draggable?: boolean;
}

const ITEM_TYPE = "TODO";

export default function DraggableTodoItem({
	todo,
	categories,
	onToggle,
	onDelete,
	onEdit,
	onView,
	onReorder,
	index,
	draggable = true,
}: DraggableTodoItemProps) {
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: ITEM_TYPE,
			item: { id: todo.id, index },
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[],
	);

	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: ITEM_TYPE,
			drop: (item: { id: string; index: number }) => {
				onReorder(item.id, todo.id);
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
			}),
		}),
		[onReorder, todo.id],
	);

	const todoItemElement = (
		<TodoItem
			todo={todo}
			onToggle={onToggle}
			onDelete={onDelete}
			onEdit={onEdit}
			onView={onView}
			categories={categories}
		/>
	);

	if (!draggable) {
		return todoItemElement;
	}

	return (
		<div
			ref={(node) => {
				drag(drop(node));
			}}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			className={`transition-opacity ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isOver ? 'bg-blue-50' : ''}`}
		>
			{todoItemElement}
		</div>
	);
}
