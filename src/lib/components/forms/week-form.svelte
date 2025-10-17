<script lang="ts">
	import { formatWeekLong } from '$lib/utils-date';
	import { weekFormSchema, type WeekFormType } from '$lib/schemas';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import { CalendarCheck2, Sun } from 'lucide-svelte';
	import { debounce, toggleSection } from '$lib/utils';
	import { saveWeekEntry } from '$lib/stores/backend-store';
	import type { CalendarDate } from '@internationalized/date';
	import Text from './inputs/text.svelte';
	import ToggleEditModeButton from './toggle-edit-mode-button.svelte';
	import TextMultiline from './inputs/text-multiline.svelte';
	import Goals from './inputs/goals.svelte';
	import Goals2 from './inputs/goals2.svelte';
	import Routines from './inputs/routines.svelte';
	import Header from '../layout/header.svelte';
	import { Separator } from '$lib/components/separator';

	interface Props {
		data: {
			date: CalendarDate;
			form: SuperValidated<WeekFormType>;
			isNew: boolean;
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		SPA: true,
		resetForm: false,
		validators: zod4(weekFormSchema),
		dataType: 'json',
		async onUpdate({ form, cancel }) {
			if (form.valid) {
				await saveWeekEntry(data.date, form.data);

				// At this point submitting the form will
				// do nothing, except mess with the focus
				// which does not play well with auto-save
				cancel();
				$tainted = undefined;
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

<Header title="Mes succès de la semaine" class="theme-rose">
	<div class="flex items-center justify-end gap-2 bg-background p-3 text-foreground">
		<span class="relative flex size-3">
			<span
				class="absolute inline-flex h-full w-full {$tainted &&
					'animate-ping'} rounded-full bg-sky-400 opacity-75"
			>
			</span>
			<span class="relative inline-flex size-3 rounded-full bg-sky-400"> </span>
		</span>
		<div>{formatWeekLong(data.date)}</div>
	</div>
</Header>

<main>
	<form use:enhance class="theme-rose">
		<Separator class="h-[2.5vh] from-background to-rose-600" />
		<section data-section="start" data-edit-mode={editMode} class="group">
			<div class="space-y-8 bg-primary/10 p-4">
				<h2 class="flex items-center">
					<span class="mr-3 flex text-2xl text-primary">Lundi matin</span>
					<Sun class="size-8 text-primary" />
					<ToggleEditModeButton onclick={toggleSection} />
				</h2>
				<Text {form} {formData} name="start.mantra" label="Mon mantra de la semaine" />
				<Goals {form} {formData} name="start.goals" legend="Mes objectifs (SMARTE) de la semaine" />
				<Routines {form} {formData} name="start.routines" legend="Mes routines de la semaine" />
			</div>
		</section>

		<Separator class="h-[2.5vh] from-rose-600 to-background" />
		<Separator class="h-[2.5vh] from-background to-rose-600" />

		<section data-section="end" data-edit-mode={editMode} class="group">
			<div class="space-y-8 bg-primary/10 p-4">
				<h2 class=" flex items-center">
					<span class="mr-3 flex text-2xl text-primary">Dimanche soir</span>
					<CalendarCheck2 class="size-8 text-primary" />
					<ToggleEditModeButton onclick={toggleSection} />
				</h2>
				<Goals2
					{form}
					{formData}
					name="start.goals"
					legend="Mes objectifs (SMARTE) de la semaine"
				/>
				<TextMultiline
					{form}
					{formData}
					name="end.achievements"
					label="Mes réussites et fiertés de la semaine"
				/>
			</div>
		</section>

		<Separator class="h-[2.5vh] from-rose-600 to-background" />
	</form>
</main>
