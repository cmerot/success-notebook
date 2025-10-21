<script lang="ts">
	import { cn } from '$lib/utils';
	import { emoticonSizes } from './emoticon-sizes';
	import Emoticon from './emoticon.svelte';
	import type { EmoticonProps } from './types';

	interface Props extends Omit<EmoticonProps, 'value'> {
		start: string;
		end: string;
	}
	const { start, end, size = 'md', ...restProps }: Props = $props();

	const hasStart = $derived(!!start);
	const hasEnd = $derived(!!end);
	const hasBoth = $derived(hasStart && hasEnd);

	const sizeConfig = $derived(emoticonSizes[size]);
</script>

{#if hasBoth}
	<Emoticon {size} class="relative" {...restProps}>
		<span class={cn('absolute', sizeConfig.dualPositionStart, sizeConfig.textDual)}>{start}</span>
		<span class={cn('absolute drop-shadow', sizeConfig.dualPositionEnd, sizeConfig.textDual)}>
			{end}
		</span>
	</Emoticon>
{:else if hasStart}
	<Emoticon value={start} {size} {...restProps} />
{:else if hasEnd}
	<Emoticon value={end} {size} {...restProps} />
{:else}
	<Emoticon {size} {...restProps} />
{/if}
