<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { dayFormSchema, type WeekFormType } from '$lib/schemas';
	import type { CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { saveWeekEntry } from '$lib/stores/backend-store';

	interface Props {
		date: CalendarDate;
		data: {
			form: SuperValidated<WeekFormType>;
			isNew: boolean;
		};
	}

	let { date, data }: Props = $props();

	const form = useAutoSaveForm(data.form, {
		schema: dayFormSchema,
		onSave: (formData) => saveWeekEntry(date, formData)
	});

	let { form: formData, enhance } = form;

	const href = ['success', date.year, date.month, date.day, 'week'].join('/');
</script>

<form use:enhance>
	<Card.Root class="theme-rose rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">📅</div>
					{#if $formData?.start.mantra}
						<h3 class="text-xl font-semibold italic">
							<q>
								{$formData.start.mantra}
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
			<Button {href} class="w-full">Ouvrir →</Button>
		</Card.Footer>
	</Card.Root>
</form>
