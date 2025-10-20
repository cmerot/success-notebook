<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';

	interface Props {
		value?: string;
	}

	let { value = $bindable('☀️') }: Props = $props();

	const emoticons = [
		'😊',
		'😃',
		'😄',
		'😁',
		'😆',
		'😅',
		'🤣',
		'😂',
		'🙂',
		'🙃',
		'😉',
		'😌',
		'😍',
		'🥰',
		'😘',
		'😗',
		'😙',
		'😚',
		'😋',
		'😛',
		'😝',
		'😜',
		'🤪',
		'🤨',
		'🧐',
		'🤓',
		'😎',
		'🤩',
		'🥳',
		'😏',
		'😒',
		'😞',
		'😔',
		'😟',
		'😕',
		'🙁',
		'😣',
		'😖',
		'😫',
		'😩',
		'🥺',
		'😢',
		'😭',
		'😤',
		'😠',
		'😡',
		'🤬',
		'🤯',
		'😳',
		'🥵',
		'🥶',
		'😱',
		'😨',
		'😰',
		'😥',
		'😓',
		// Weather emoticons
		'☀️',
		'🌤️',
		'⛅',
		'🌥️',
		'☁️',
		'🌦️',
		'🌧️',
		'⛈️',
		'🌩️',
		'🌨️',
		'❄️',
		'🌪️',
		'🌈',
		'🌙',
		'⭐',
		'🌡️',
		'💧',
		'💨'
	];

	let isOpen = $state(false);

	function selectEmoticon(emoticon: string) {
		value = emoticon;
		isOpen = false;
	}
</script>

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger
		class={'inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-input bg-background text-4xl transition-all hover:border-primary hover:bg-accent'}
		aria-label="Choisir une émoticône"
	>
		{#if value}
			{value}
		{:else}
			<span class="opacity-50 transition-opacity hover:opacity-100">☀️</span>
		{/if}
	</Popover.Trigger>
	<Popover.Content class="w-80 p-4">
		<div class="mb-2 text-sm font-medium text-foreground">Choisis ton émoticône</div>
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
