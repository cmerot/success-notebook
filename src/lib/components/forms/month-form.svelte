<script lang="ts">
	import { formatMonth } from '$lib/utils-date';
	import { monthFormSchema, type MonthFormType } from '$lib/schemas';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import { Calendar1, CalendarCheck } from 'lucide-svelte';
	import { debounce, toggleSection } from '$lib/utils';
	import { saveMonthEntry } from '$lib/stores/backend-store';
	import type { CalendarDate } from '@internationalized/date';
	import Text from './inputs/text.svelte';
	import ToggleEditModeButton from './toggle-edit-mode-button.svelte';
	import TextMultiline from './inputs/text-multiline.svelte';
	import Header from '../layout/header.svelte';
	import Goals from './inputs/goals.svelte';
	import MonthRoutines from './inputs/month-routines.svelte';
	import { Separator } from '$lib/components/separator';
	import FormStatus from './form-status.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			form: SuperValidated<MonthFormType>;
			isNew: boolean;
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		SPA: true,
		resetForm: false,
		validators: zod4(monthFormSchema),
		dataType: 'json',
		async onUpdate({ form, cancel }) {
			if (form.valid) {
				try {
					await saveMonthEntry(data.date, form.data);
					// At this point submitting the form will
					// do nothing, except mess with the focus
					// which does not play well with auto-save
					cancel();
					$tainted = undefined;
				} catch (error) {
					console.log('yo', error);
				}
			} else {
				console.log('here');
			}
		}
	});
	let { form: formData, enhance, tainted, errors } = form;

	let isInitialized = $state(false);

	const debounced = debounce(() => {
		// Only submit if form has actual user changes
		if ($tainted) {
			form.submit();
		}
	}, 1000);

	onMount(() => {
		formData.subscribe(() => {
			if (!isInitialized) {
				isInitialized = true;
				return;
			}
			debounced();
		});
	});

	let editMode = $state<'edit' | 'view'>(data.isNew ? 'edit' : 'view');
</script>

<Header title="Mes succès du mois" class="theme-green">
	<FormStatus {form} title={formatMonth(data.date)} />
</Header>

<main>
	<form use:enhance class="theme-green">
		<Separator class="h-[2.5vh] from-background to-lime-600" />

		<section data-section="start" data-edit-mode={editMode} class="group">
			<div class="space-y-8 bg-primary/10 p-4">
				<h2 class="flex items-center">
					<span class="mr-3 flex text-2xl text-primary">1er jour du mois</span>
					<Calendar1 class="size-8 text-primary" />
					<ToggleEditModeButton onclick={toggleSection} />
				</h2>
				<Text {form} {formData} name="start.mantra" label="Mon mantra du mois" />
				<Goals {form} {formData} name="start.goals" legend="Mes objectifs (SMARTE) du mois" />
				<MonthRoutines
					{form}
					{formData}
					name="start.routines"
					legend="Mes (nouvelles) routines du mois"
				/>
			</div>
		</section>

		<Separator class="h-[2.5vh] from-lime-600 to-background" />
		<Separator class="h-[2.5vh] from-background to-lime-600" />

		<section data-section="end" data-edit-mode={editMode} class="group">
			<div class="space-y-8 bg-primary/10 p-4">
				<h2 class=" flex items-center">
					<span class="mr-3 flex text-2xl text-primary">Dernier jour du mois</span>
					<CalendarCheck class="size-8 text-primary" />
					<ToggleEditModeButton onclick={toggleSection} />
				</h2>
				<TextMultiline
					{form}
					{formData}
					name="end.achievements"
					label="Mes réussites et fiertés du mois"
				/>
			</div>
		</section>

		<Separator class="h-[2.5vh] from-lime-600 to-background" />
	</form>
</main>
