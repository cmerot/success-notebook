<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils/utils';
	import Emoticon from './emoticon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { RotateCcw } from 'lucide-svelte';
	import type { EmoticonSize } from './emoticon-sizes';
	import { levelEmoticons, moodLevels, type MoodLevel } from './level-emoticons';

	interface Props {
		value?: number | undefined;
		label?: string;
		size?: EmoticonSize;
		class?: string;
		fallback?: string;
		ariaLabel?: string;
	}

	let {
		value = $bindable(),
		label = 'Choisis ton niveau',
		size = 'md',
		class: className,
		fallback,
		ariaLabel
	}: Props = $props();

	let isOpen = $state(false);

	function selectLevel(level: MoodLevel) {
		value = level;
		isOpen = false;
	}

	function clearLevel() {
		value = undefined;
		isOpen = false;
	}

	const currentEmoticon = $derived(
		value && value in levelEmoticons ? levelEmoticons[value as MoodLevel] : undefined
	);

	const reversedLevels = $derived([...moodLevels].reverse());
</script>

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger>
		<Emoticon
			value={currentEmoticon}
			{size}
			{fallback}
			{ariaLabel}
			class={cn(
				'rounded-full border-2 border-primary/20 transition-all hover:border-primary hover:bg-accent',
				className
			)}
		/>
	</Popover.Trigger>
	<Popover.Content class="w-full p-4" side="top">
		<div class="mb-3 flex items-center justify-between">
			<div class="text-sm font-medium text-foreground">{label}</div>
			{#if value !== undefined}
				<Button variant="ghost" onclick={clearLevel} aria-label="Supprimer le niveau">
					<RotateCcw />
				</Button>
			{/if}
		</div>
		<div class="flex justify-center gap-3">
			{#each reversedLevels as level}
				<button
					type="button"
					onclick={() => selectLevel(level)}
					class={cn(
						'transition-all duration-200',
						value === level
							? 'scale-110 border-primary'
							: 'scale-100 border-transparent opacity-50 hover:scale-105 hover:opacity-75'
					)}
					aria-label={`Niveau ${level}`}
				>
					<Emoticon value={levelEmoticons[level]} size="sm" class="border-2" />
				</button>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
