<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { cn } from '$lib/utils/utils';

	interface Props {
		title: string;
		theme?: string;
		children?: Snippet<[]>;
		nav?: Snippet<[]>;
		class?: string;
		variant?: 'sidebar' | 'default';
	}

	const { title, children, nav, class: className, variant = 'default' }: Props = $props();

	const variants = {
		default: 'sticky z-50 overflow-x-hidden bg-primary text-primary-foreground',
		sidebar: 'sticky z-50 overflow-x-hidden border-b bg-sidebar text-sidebar-foreground'
	};
</script>

<!-- Fixed Navigation Header -->
<header class={cn(variants[variant], className)} style="top: env(safe-area-inset-top)">
	<div class="flex items-center gap-x-3 p-3">
		{#if nav}
			{@render nav()}
		{:else}
			<Button variant="ghost" size="icon" class="-ml-1" onclick={() => history.back()}>
				<ArrowLeft class="size-6" />
				<span class="sr-only">Retour</span>
			</Button>
		{/if}
		<h1 class="text-xl">{title}</h1>
	</div>
	{@render children?.()}
</header>
