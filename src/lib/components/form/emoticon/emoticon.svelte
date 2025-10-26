<script lang="ts">
	import { cn } from '$lib/utils/utils';
	import { emoticonSizes } from './emoticon-sizes';
	import type { EmoticonProps } from './types';

	const {
		value,
		class: className,
		fallback = '☀️',
		size = 'md',
		ariaLabel = 'Émoticône',
		children,
		...restProps
	}: EmoticonProps = $props();

	const sizeConfig = $derived(emoticonSizes[size]);
</script>

<div
	class={cn(
		'inline-flex items-center justify-center rounded-full bg-background',
		sizeConfig.container,
		sizeConfig.textSingle,
		value ? '' : children ? '' : 'opacity-30',
		className
	)}
	aria-label={ariaLabel}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else if value}
		{value}
	{:else}
		{fallback}
	{/if}
</div>
