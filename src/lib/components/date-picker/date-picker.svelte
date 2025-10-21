<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	interface Props {
		children: Snippet;
		class?: string;
	}

	const { children, class: className }: Props = $props();

	let value = $state<DateValue>();

	$effect(() => {
		if (!value) return;
		goto(['', value.year, value.month, value.day].join('/'), { replaceState: true });
	});
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'bg-transparent'
			}),
			className
		)}
	>
		{@render children()}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar bind:value type="single" locale={navigator.language} />
	</Popover.Content>
</Popover.Root>
