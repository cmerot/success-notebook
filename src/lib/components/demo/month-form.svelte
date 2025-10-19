<script lang="ts">
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import { monthFormSchema, type MonthFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { FormStatus } from '$lib/components/form/status';
	import { formatMonth } from '$lib/utils-date';
	import { saveMonthEntry } from '$lib/stores/backend-store';
	import * as Surface from '$lib/components/surface';
	import { GoalFieldset } from '$lib/components/form/goal';
	import { TextField, TextFieldset } from '$lib/components/form/text';
	import { Calendar1, CalendarCheck, Sun } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		data: {
			date: CalendarDate;
			month: {
				form: SuperValidated<MonthFormType>;
				isNew: boolean;
			};
		};
		footer?: Snippet;
	}

	let { data, footer }: Props = $props();

	const form = useAutoSaveForm(data.month.form, {
		schema: monthFormSchema,
		onSave: (formData) => saveMonthEntry(data.date, formData)
	});
	let { enhance } = form;
	let isEditMode = $state(false);
</script>

<form use:enhance>
	<Surface.Root class="theme-green">
		<Surface.Header>
			{#snippet title()}
				<div class="mb-6 flex items-center gap-x-2">
					<span
						class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-input bg-background text-4xl"
						>📈</span
					>
					<h2 class="text-2xl font-bold text-primary">{formatMonth(data.date)}</h2>
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
			<h2 class="flex items-center gap-3 text-primary">
				<span class="text-2xl">1er jour du mois</span>
				<Calendar1 class="size-8" />
			</h2>

			<Surface.Section variant="outline">
				<TextField label="Mon mantra du mois" {form} name="start.mantra" {isEditMode} />
			</Surface.Section>

			<Surface.Section variant="outline">
				<GoalFieldset
					legend="Mes objectifs (SMARTE) du mois"
					{form}
					name="start.goals"
					{isEditMode}
				/>
			</Surface.Section>

			<Surface.Section variant="outline">
				<TextFieldset
					legend="Mes (nouvelles) routines du mois"
					{form}
					name="start.routines"
					{isEditMode}
				/>
			</Surface.Section>
		</div>

		<div class="space-y-4">
			<h2 class="mt-12 flex items-center gap-3 text-primary">
				<span class="text-2xl">Dernier jour du mois</span>
				<CalendarCheck class="size-8" />
			</h2>

			<Surface.Section variant="outline">
				<TextField
					label="Mes réussites et fiertés du mois"
					{form}
					name="end.achievements"
					{isEditMode}
				/>
			</Surface.Section>
		</div>

		{#if footer}
			<Surface.Footer>
				{@render footer()}
			</Surface.Footer>
		{/if}
	</Surface.Root>
</form>
