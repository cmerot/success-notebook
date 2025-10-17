<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import type { MonthData } from '$lib/components/date-carousel/utils.svelte';
	import { formatMonth } from '$lib/utils-date';
	import EmptyContent from './empty-slide.svelte';

	type Props = {
		open: boolean;
		data: MonthData;
	};

	let { open = $bindable(), data }: Props = $props();
</script>

<Collapsible.Root bind:open>
	<Collapsible.Trigger class="flex w-full items-end p-4 text-left">
		<div class="grow text-xl">Mes succès du mois</div>
		<div>{formatMonth(data.date)}</div>
	</Collapsible.Trigger>

	<Collapsible.Content
		hiddenUntilFound
		class="space-y-2 overflow-hidden  border-border data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down data-[state=open]:border-t"
	>
		<EmptyContent {data} type="month" />
	</Collapsible.Content>
</Collapsible.Root>
