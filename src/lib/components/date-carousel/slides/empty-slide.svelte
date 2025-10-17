<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { DayData, MonthData, WeekData } from '../utils';

	type Props = {
		data: DayData | WeekData | MonthData;
		type: string;
	};

	const { data, type }: Props = $props();

	let href = $derived(
		`/success/${data.date.year}/${String(data.date.month).padStart(2, '0')}/${String(data.date.day).padStart(2, '0')}/${type}`
	);
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
