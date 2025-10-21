<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils/utils';
	import Emoticon from './emoticon.svelte';
	import type { EmoticonProps } from './types';
	import { emoticons } from './emoticons-list';
	import { Button } from '$lib/components/ui/button';
	import { RotateCcw } from 'lucide-svelte';

	interface Props extends EmoticonProps {
		label?: string;
	}

	let {
		value = $bindable(),
		label = 'Choisis ton émoticône',
		class: className,
		...restProps
	}: Props = $props();

	let isOpen = $state(false);

	function selectEmoticon(emoticon: string) {
		value = emoticon;
		isOpen = false;
	}

	function clearEmoticon() {
		value = '';
		isOpen = false;
	}
</script>

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger>
		<Emoticon
			{value}
			class={cn('transition-all hover:border-primary hover:bg-accent', className)}
			{...restProps}
		/>
	</Popover.Trigger>
	<Popover.Content class="w-80 p-4">
		<div class="mb-2 flex items-center justify-between">
			<div class="text-sm font-medium text-foreground">{label}</div>
			{#if value}
				<Button variant="ghost" onclick={clearEmoticon} aria-label="Supprimer l'émoticône">
					<RotateCcw />
				</Button>
			{/if}
		</div>
		<div class="grid grid-cols-8 gap-2">
			{#each emoticons as emoticon}
				<button
					type="button"
					onclick={() => selectEmoticon(emoticon)}
					class="flex h-10 w-10 items-center justify-center rounded-md text-2xl transition-all hover:bg-accent focus:ring-2 focus:ring-ring focus:outline-none"
					aria-label={`Sélectionner ${emoticon}`}
				>
					{emoticon}
				</button>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
