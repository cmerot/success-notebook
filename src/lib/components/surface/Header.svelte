<script lang="ts">
	import { isSnippet } from '$lib/utils/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: Snippet | string;
		children?: Snippet;
		class?: string;
	}

	let { title, children, class: className = '' }: Props = $props();
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
