<script lang="ts">
	import { type CalendarDate, type DateValue } from '@internationalized/date';
	import { cn } from '$lib/utils/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { today } from '$lib/utils/date';
	import { resolve } from '$app/paths';

	interface Props {
		children: Snippet;
		class?: string;
		date: CalendarDate;
	}

	let { children, date, class: className }: Props = $props();

	let open = $state(false);

	function handleChange(value?: DateValue) {
		console.log('handleChange', value);
		if (!value) return;

		if (today.compare(value) === 0) {
			if (page.url.pathname !== resolve('/')) goto(resolve('/'));
			open = false;
			return;
		}

		const targetPath = resolve(`/${value.year}/${value.month}/${value.day}`);
		if (date.compare(value) === 0) {
			if (page.url.pathname !== targetPath) goto(targetPath);
			open = false;
			return;
		}

		// If on a form page, go back first to remove it, then replace the date page
		// See README for an extended description of the problem, under "navigation sequences"
		const isOnFormPage = page.url.pathname.match(/\/(day)|(month)|(week)$/);
		if (isOnFormPage) {
			history.go(-1);
			setTimeout(() => {
				goto(targetPath, { replaceState: true });
				open = false;
			}, 100);
			return;
		}

		const replaceState = page.url.pathname !== resolve('/');
		goto(targetPath, { replaceState });
		open = false;
	}
</script>

<Popover.Root bind:open>
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
		<Calendar
			preventDeselect={true}
			onValueChange={handleChange}
			value={date}
			type="single"
			locale={navigator.language}
		/>
	</Popover.Content>
</Popover.Root>
