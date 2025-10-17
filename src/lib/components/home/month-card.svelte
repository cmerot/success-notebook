<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { MonthFormType } from '$lib/schemas';

	interface Props {
		monthURL: string;
		monthEntry: MonthFormType | null;
	}

	let { monthURL, monthEntry }: Props = $props();
</script>

<!-- Month Card -->
<a href={monthURL} class="group block">
	<Card.Root class="theme-green rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">🗓️</div>
					{#if monthEntry?.start.mantra}
						<h3 class="text-xl font-semibold italic">
							<q>
								{monthEntry.start.mantra}
							</q>
						</h3>
					{/if}
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<h3 class="text-lg font-semibold text-primary">Mensuel</h3>
			Premier au dernier jour : nouvelles routines et bilan
		</Card.Content>
		<Card.Footer>
			<Button class="w-full">Ouvrir →</Button>
		</Card.Footer>
	</Card.Root>
</a>
