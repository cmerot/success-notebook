<script lang="ts">
	import { cn } from '$lib/utils/utils';
	import { emoticonSizes } from './emoticon-sizes';
	import Emoticon from './emoticon.svelte';
	import type { EmoticonSize } from './emoticon-sizes';
	import { getMoodEmoticons, type MoodScale } from './emoticons-level';

	interface Props {
		start: number | undefined;
		end: number | undefined;
		size?: EmoticonSize;
		fallback?: string;
		class?: string;
		ariaLabel?: string;
	}
	const { start, end, size = 'md', fallback, class: className, ariaLabel }: Props = $props();

	const levelEmoticons = getMoodEmoticons();
	const startEmoticon = $derived(
		start !== undefined && start in levelEmoticons ? levelEmoticons[start as MoodScale] : undefined
	);
	const endEmoticon = $derived(
		end !== undefined && end in levelEmoticons ? levelEmoticons[end as MoodScale] : undefined
	);

	const hasStart = $derived(!!startEmoticon);
	const hasEnd = $derived(!!endEmoticon);
	const hasBoth = $derived(hasStart && hasEnd);

	const sizeConfig = $derived(emoticonSizes[size]);
</script>

{#if hasBoth}
	<Emoticon {size} {fallback} {ariaLabel} class={cn('relative', className)}>
		<span class={cn('absolute', sizeConfig.dualPositionStart, sizeConfig.textDual)}>
			{startEmoticon}
		</span>
		<span class={cn('absolute drop-shadow', sizeConfig.dualPositionEnd, sizeConfig.textDual)}>
			{endEmoticon}
		</span>
	</Emoticon>
{:else if hasStart}
	<Emoticon value={startEmoticon} {size} {fallback} {ariaLabel} class={className} />
{:else if hasEnd}
	<Emoticon value={endEmoticon} {size} {fallback} {ariaLabel} class={className} />
{:else}
	<Emoticon {size} {fallback} {ariaLabel} class={className} />
{/if}
