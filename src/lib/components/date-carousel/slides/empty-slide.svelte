<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { DayData, MonthData, WeekData } from '../utils';
	import { startOfMonth, startOfWeek } from '@internationalized/date';

	type Props = {
		data: DayData | WeekData | MonthData;
		type: string;
	};

	const { data, type }: Props = $props();

	const firstDayOfWeek = $derived(startOfWeek(data.date, navigator.language));
	const firstDayOfMonth = $derived(startOfMonth(data.date));
	const dayHref = $derived(['', data.date.year, data.date.month, data.date.day].join('/'));
	const weekHref = $derived(
		['', firstDayOfWeek.year, firstDayOfWeek.month, firstDayOfWeek.day, 'week'].join('/')
	);
	const monthHref = $derived(
		['', firstDayOfMonth.year, firstDayOfMonth.month, firstDayOfMonth.day, 'month'].join('/')
	);

	let href = $derived(type == 'day' ? dayHref : type == 'week' ? weekHref : monthHref);
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media class="text-4xl">🎉</Empty.Media>
		<Empty.Title>Surprise !</Empty.Title>
		<Empty.Description>Ceci est un composant de démonstration</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex flex-col gap-2">
			<Button {href}>Consulter le carnet à cette date</Button>
			<Button variant="outline">Faire quelque chose d'autre</Button>
		</div>
	</Empty.Content>
</Empty.Root>
