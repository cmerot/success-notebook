<script lang="ts">
	import { formatMonth } from '$lib/utils-date';
	import { monthFormSchema, type MonthFormType } from '$lib/schemas';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Calendar1, CalendarCheck } from 'lucide-svelte';
	import { saveMonthEntry } from '$lib/stores/backend-store';
	import type { CalendarDate } from '@internationalized/date';
	import Text from './inputs/text.svelte';
	import TextMultiline from './inputs/text-multiline.svelte';
	import Header from '../layout/header.svelte';
	import Goals from './inputs/goals.svelte';
	import MonthRoutines from './inputs/month-routines.svelte';
	import { Separator } from '$lib/components/separator';
	import FormStatus from './form-status.svelte';
	import FormSection from './form-section.svelte';

	interface Props {
		date: CalendarDate;
		data: {
			form: SuperValidated<MonthFormType>;
			isNew: boolean;
		};
	}

	let { date, data }: Props = $props();

	const form = useAutoSaveForm(data.form, {
		schema: monthFormSchema,
		onSave: (formData) => saveMonthEntry(date, formData)
	});

	let { form: formData, enhance } = form;
	let editMode = $state<'edit' | 'view'>(data.isNew ? 'edit' : 'view');
</script>

<Header title="Mes succès du mois" class="theme-green">
	<FormStatus {form} title={formatMonth(date)} />
</Header>

<main>
	<form use:enhance class="theme-green">
		<Separator class="h-[2.5vh] from-background to-lime-600" />

		<FormSection section="start" {editMode} title="1er jour du mois" icon={Calendar1}>
			<Text {form} {formData} name="start.mantra" label="Mon mantra du mois" />
			<Goals {form} {formData} name="start.goals" legend="Mes objectifs (SMARTE) du mois" />
			<MonthRoutines
				{form}
				{formData}
				name="start.routines"
				legend="Mes (nouvelles) routines du mois"
			/>
		</FormSection>

		<Separator class="h-[2.5vh] from-lime-600 to-background" />
		<Separator class="h-[2.5vh] from-background to-lime-600" />

		<FormSection section="end" {editMode} title="Dernier jour du mois" icon={CalendarCheck}>
			<TextMultiline
				{form}
				{formData}
				name="end.achievements"
				label="Mes réussites et fiertés du mois"
			/>
		</FormSection>

		<Separator class="h-[2.5vh] from-lime-600 to-background" />
	</form>
</main>
