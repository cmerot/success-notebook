<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		start: string;
		end: string;
		class?: string;
		fallback?: string;
	}
	const { start, end, class: className, fallback = '☀️' }: Props = $props();

	const hasStart = $derived(!!start);
	const hasEnd = $derived(!!end);
	const hasBoth = $derived(hasStart && hasEnd);
</script>

<div
	class={cn(
		'relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-input bg-background',
		className
	)}
	aria-label="Émoticône sélectionnée"
>
	{#if hasBoth}
		<span class="absolute top-1 left-2 text-3xl">{start}</span>
		<span class="absolute right-2 bottom-1 text-3xl drop-shadow">{end}</span>
	{:else if hasStart}
		<span class="text-4xl">{start}</span>
	{:else if hasEnd}
		<span class="text-4xl">{end}</span>
	{:else}
		<span class="text-4xl">{fallback}</span>
	{/if}
</div>
