<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { Button } from '$lib/components/ui/button';
	import ThemeSelector from '$lib/components/theme-selector.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	// Navigation items
	const navItems = [
		{ href: resolve('/'), label: "Aujourd'hui" },
		{ href: resolve('/historic'), label: 'Historique' },
		{ href: resolve('/data'), label: 'Vos données' },
		{ href: resolve('/about'), label: 'Aide et à propos' }
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
					class="h-auto w-full justify-start rounded-none text-lg"
				>
					{item.label}
				</Button>
			</li>
		{/each}
	</ul>
</nav>
