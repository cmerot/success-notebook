<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	function showMenu() {
		goto('/menu');
	}
</script>

<div class="flex h-full flex-col">
	<Header title="Carnet de succès" variant="sidebar">
		{#snippet nav()}
			<nav>
				<Button variant="ghost" size="icon" onclick={showMenu} class="-ml-1">
					<Menu class="size-6" />
					<span class="sr-only">Ouvrir le menu</span>
				</Button>
			</nav>
		{/snippet}
	</Header>
	<div class="flex flex-1 flex-col items-center justify-center bg-destructive">
		<p class="p-4 text-[5vw] font-semibold text-background">{page.status}</p>
		<h1 class="p-4 text-center text-[10vw] font-semibold text-background">
			💥 {page.error?.message}
		</h1>
	</div>
</div>
