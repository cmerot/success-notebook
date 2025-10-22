<script lang="ts">
	import { type CalendarDate, type DateValue } from '@internationalized/date';
	import { cn } from '$lib/utils/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		children: Snippet;
		class?: string;
		date: CalendarDate;
	}

	let { children, date, class: className }: Props = $props();

	let value = $state<DateValue>(date);

	$effect(() => {
		const targetPath = ['', value.year, value.month, value.day].join('/');
		if (page.url.pathname === targetPath) return;

		goto(targetPath, {
			replaceState: page.url.pathname !== '/'
		});
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
