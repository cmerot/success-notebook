<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import type { WeekData } from '$lib/components/date-carousel/utils.svelte';
	import { formatWeek } from '$lib/utils-date';
	import EmptyContent from './empty-slide.svelte';

	type Props = {
		open: boolean;
		data: WeekData;
	};

	let { open = $bindable(), data }: Props = $props();
</script>

<Collapsible.Root bind:open>
	<Collapsible.Trigger class="flex w-full items-end p-4 text-left">
		<div class="grow text-xl">Mes succès de la semaine</div>
		<div>{formatWeek(data.date)}</div>
	</Collapsible.Trigger>
	<Collapsible.Content
		hiddenUntilFound
		class="space-y-2 overflow-hidden  border-border data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down data-[state=open]:border-t"
	>
		<EmptyContent {data} type="week" />
	</Collapsible.Content>
</Collapsible.Root>
