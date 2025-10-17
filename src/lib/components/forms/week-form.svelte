<script lang="ts">
	import { formatWeekLong } from '$lib/utils-date';
	import { weekFormSchema, type WeekFormType } from '$lib/schemas';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { CalendarCheck2, Sun } from 'lucide-svelte';
	import { saveWeekEntry } from '$lib/stores/backend-store';
	import type { CalendarDate } from '@internationalized/date';
	import Text from './inputs/text.svelte';
	import TextMultiline from './inputs/text-multiline.svelte';
	import Goals from './inputs/goals.svelte';
	import Goals2 from './inputs/goals2.svelte';
	import Routines from './inputs/routines.svelte';
	import Header from '../layout/header.svelte';
	import { Separator } from '$lib/components/separator';
	import FormStatus from './form-status.svelte';
	import FormSection from './form-section.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			form: SuperValidated<WeekFormType>;
			isNew: boolean;
		};
	}

	let { data }: Props = $props();

	const form = useAutoSaveForm(data.form, {
		schema: weekFormSchema,
		onSave: (formData) => saveWeekEntry(data.date, formData)
	});

	let { form: formData, enhance } = form;
	let editMode = $state<'edit' | 'view'>(data.isNew ? 'edit' : 'view');
</script>

<Header title="Mes succès de la semaine" class="theme-rose">
	<FormStatus {form} title={formatWeekLong(data.date)} />
</Header>

<main>
	<form use:enhance class="theme-rose">
		<Separator class="h-[2.5vh] from-background to-rose-600" />

		<FormSection section="start" {editMode} title="Lundi matin" icon={Sun}>
			<Text {form} {formData} name="start.mantra" label="Mon mantra de la semaine" />
			<Goals {form} {formData} name="start.goals" legend="Mes objectifs (SMARTE) de la semaine" />
			<Routines {form} {formData} name="start.routines" legend="Mes routines de la semaine" />
		</FormSection>

		<Separator class="h-[2.5vh] from-rose-600 to-background" />
		<Separator class="h-[2.5vh] from-background to-rose-600" />

		<FormSection section="end" {editMode} title="Dimanche soir" icon={CalendarCheck2}>
			<Goals2 {form} {formData} name="start.goals" legend="Mes objectifs (SMARTE) de la semaine" />
			<TextMultiline
				{form}
				{formData}
				name="end.achievements"
				label="Mes réussites et fiertés de la semaine"
			/>
		</FormSection>

		<Separator class="h-[2.5vh] from-rose-600 to-background" />
	</form>
</main>
