<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { CalendarDate } from '@internationalized/date';

	type Props = {
		date: CalendarDate;
		type: string;
	};

	const { date, type }: Props = $props();
	// const href = `/success/${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}/${type}`;
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media class="text-4xl">🎉</Empty.Media>
		<Empty.Title>Surprise !</Empty.Title>
		<Empty.Description>Ceci est un composant de démonstration</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex flex-col gap-2">
			<Button>Consulter le carnet à cette date</Button>
			<Button variant="outline">Faire quelque chose d'autre</Button>
		</div>
	</Empty.Content>
</Empty.Root>
