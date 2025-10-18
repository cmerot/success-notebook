<script lang="ts">
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import { weekFormSchema, type WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { FormStatus } from '$lib/components/form/status';
	import { formatWeekLong } from '$lib/utils-date';
	import { saveWeekEntry } from '$lib/stores/backend-store';
	import * as Surface from '$lib/components/surface';
	import { RoutineFieldset } from '$lib/components/form/routine';
	import { GoalFieldset } from '$lib/components/form/goal';
	import { TextField } from '$lib/components/form/text';

	interface Props {
		data: {
			date: CalendarDate;
			week: {
				form: SuperValidated<WeekFormType>;
				isNew: boolean;
			};
		};
	}

	let { data }: Props = $props();

	const form = useAutoSaveForm(data.week.form, {
		schema: weekFormSchema,
		onSave: (formData) => saveWeekEntry(data.date, formData)
	});
	let { enhance: weekEnhance } = form;
	let isEditMode = $state(false);
</script>

<form use:weekEnhance>
	<Surface.Root class="theme-rose">
		<Surface.Header>
			{#snippet title()}
				<div class="mb-6 flex items-center gap-x-2">
					<span
						class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-input bg-background text-4xl"
						>🗓️</span
					>
					<h3 class="text-2xl font-bold text-primary">{formatWeekLong(data.date)}</h3>
					<FormStatus {form} class="ml-auto inline-block bg-transparent" />
					<button
						type="button"
						onclick={() => (isEditMode = !isEditMode)}
						aria-label={isEditMode ? 'Désactiver le mode édition' : 'Activer le mode édition'}
						class="rounded-lg p-2 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none {isEditMode
							? 'bg-primary text-primary-foreground hover:bg-primary/90'
							: 'text-muted-foreground'}"
					>
						<PencilIcon class="size-5" />
					</button>
				</div>
			{/snippet}
		</Surface.Header>
		<div class="space-y-4">
			<Surface.Section variant="outline">
				<TextField label="Mon mantra du mois" {form} name="start.mantra" {isEditMode} />
			</Surface.Section>

			<Surface.Section variant="outline">
				<GoalFieldset
					legend="Mes objectifs (SMARTE) de la semaine"
					{form}
					name="start.goals"
					{isEditMode}
				/>
			</Surface.Section>

			<Surface.Section variant="outline">
				<RoutineFieldset
					legend="Mes routines de la semaine"
					{form}
					name="start.routines"
					{isEditMode}
				/>
			</Surface.Section>
		</div>
		<div class="space-y-4">
			<Surface.Section variant="outline">
				<TextField
					{form}
					name="end.achievements"
					label="Mes réussites et fiertés de la semaine"
					{isEditMode}
				/>
			</Surface.Section>
		</div>
	</Surface.Root>
</form>
