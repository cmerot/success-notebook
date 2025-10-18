<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: Snippet | string;
		children?: Snippet;
		class?: string;
	}

	let { title, children, class: className = '' }: Props = $props();

	// Helper function to check if title is a snippet
	const isSnippet = (value: unknown): value is Snippet => {
		return typeof value === 'function';
	};
</script>

<header class="w-full pb-4 {className}">
	{#if title}
		{#if isSnippet(title)}
			{@render title()}
		{:else}
			<h2 class="mb-2 text-2xl font-bold text-primary">
				{title}
			</h2>
		{/if}
	{/if}
	{#if children}
		<div>
			{@render children()}
		</div>
	{/if}
</header>
