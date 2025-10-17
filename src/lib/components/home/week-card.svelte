<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { WeekFormType } from '$lib/schemas';

	interface Props {
		weekURL: string;
		weekEntry: WeekFormType | null;
	}

	let { weekURL, weekEntry }: Props = $props();
</script>

<!-- Week Card -->
<a href={weekURL} class="group block">
	<Card.Root class="theme-rose rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">📅</div>
					{#if weekEntry?.start.mantra}
						<h3 class="text-xl font-semibold italic">
							<q>
								{weekEntry.start.mantra}
							</q>
						</h3>
					{/if}
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<h3 class="text-lg font-semibold text-primary">Hebdomadaire</h3>
			Lundi au dimanche : routines et objectifs SMARTE
		</Card.Content>
		<Card.Footer>
			<Button class="w-full">Ouvrir →</Button>
		</Card.Footer>
	</Card.Root>
</a>
