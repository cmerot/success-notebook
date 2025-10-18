<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: Snippet | string;
		children: Snippet;
		class?: string;
		variant?: 'default' | 'outline';
	}

	let { title, children, class: className = '', variant = 'default' }: Props = $props();

	// Helper function to check if title is a snippet
	const isSnippet = (value: unknown): value is Snippet => {
		return typeof value === 'function';
	};
	const outlineClasses = 'p-3 rounded-lg bg-background';
</script>

<section class={cn(`w-full ${variant == 'outline' ? outlineClasses : ''}`, className)}>
	{#if title}
		<h3 class="mb-3 text-lg font-semibold text-primary">
			{#if isSnippet(title)}
				{@render title()}
			{:else}
				{title}
			{/if}
		</h3>
	{/if}
	<div>
		{@render children()}
	</div>
</section>
