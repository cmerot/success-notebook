<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { CircleQuestionMark, History, Database, Info } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	// Navigation items
	const navItems: Array<{ href: string; label: string; icon: ComponentType }> = [
		{ href: resolve('/help'), label: 'Comment utiliser votre carnet', icon: CircleQuestionMark },
		{ href: resolve('/history'), label: 'Historique', icon: History },
		{ href: resolve('/data'), label: 'Gestion de vos données', icon: Database },
		{ href: resolve('/about'), label: 'À propos', icon: Info }
	];

	function navigate(href: string) {
		goto(href, { replaceState: true });
	}
</script>

<Header title="Navigation" variant="sidebar" />

<nav>
	<ul class="flex flex-col">
		{#each navItems as item}
			<li>
				<Button
					onclick={() => navigate(item.href)}
					variant="ghost"
					class="w-full justify-start gap-3 rounded-none text-lg"
				>
					<item.icon class="size-5" />
					{item.label}
				</Button>
			</li>
		{/each}
	</ul>
</nav>
