import { Card } from "@/components/ui/card";
import CategoriesPageClient from "./page.client";
import { Navigation } from "@/components/Navigation";

export default function CategoriesPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<main className="container mx-auto max-w-7xl px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900">
						Categories
					</h1>
					<p className="mt-2 text-lg text-slate-600">
						Create and manage your task categories.
					</p>
				</div>

				<Navigation	/>

				<Card className="p-6">
					<CategoriesPageClient />
				</Card>
			</main>
		</div>
	);
}
