<script lang="ts">
	import { formatDay } from '$lib/utils-date';
	import { dayFormSchema, type DayFormType } from '$lib/schemas';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import { Moon, Sun } from 'lucide-svelte';
	import { debounce, toggleSection } from '$lib/utils';
	import { saveDayEntry } from '$lib/stores/backend-store';
	import type { CalendarDate } from '@internationalized/date';
	import TodoList from './inputs/todo-list.svelte';
	import Text from './inputs/text.svelte';
	import ToggleEditModeButton from './toggle-edit-mode-button.svelte';
	import TextMultiline from './inputs/text-multiline.svelte';
	import Header from '../layout/header.svelte';
	import TextEmoticons from './inputs/text-emoticons.svelte';
	import { Separator } from '$lib/components/separator';

	interface Props {
		data: {
			date: CalendarDate;
			form: SuperValidated<DayFormType>;
			isNew: boolean;
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		SPA: true,
		resetForm: false,
		validators: zod4(dayFormSchema),
		dataType: 'json',
		async onUpdate({ form, cancel }) {
			if (form.valid) {
				await saveDayEntry(data.date, form.data);
				// At this point submitting the form will
				// do nothing, except mess with the focus
				// which does not play well with auto-save
				cancel();
				$tainted = undefined;
			}
		}
	});
	let { form: formData, enhance, tainted } = form;

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

<Header title="Mes succès du quotidien" class="theme-blue">
	<div class="flex items-center justify-end gap-2 bg-background p-3 text-foreground">
		<span class="relative flex size-3">
			<span
				class="absolute inline-flex h-full w-full {$tainted &&
					'animate-ping'} rounded-full bg-sky-400 opacity-75"
			>
			</span>
			<span class="relative inline-flex size-3 rounded-full bg-sky-400"> </span>
		</span>
		<div>{formatDay(data.date)}</div>
	</div>
</Header>

<main>
	<form use:enhance class="theme-blue">
		<Separator class="h-[2.5vh] from-background to-blue-600" />
		<section data-section="start" data-edit-mode={editMode} class="group">
			<div class="space-y-8 bg-primary/10 p-4">
				<h2 class="flex items-center">
					<span class="mr-3 flex text-2xl text-primary">Matin</span>
					<Sun class="size-8 text-primary" />
					<ToggleEditModeButton onclick={toggleSection} />
				</h2>
				<Text {form} {formData} name="start.grateful" label="Je suis reconnaissant·e pour" />
				<TextEmoticons {form} {formData} name="start.mood" label="Émotion(s) du matin" />
				<Text {form} {formData} name="start.desire" label="J'attends avec impatience" />
				<Text {form} {formData} name="start.goal" label="Je serais satisfait·e de ma journée si" />
				<TodoList {form} {formData} name="start.todoList" legend="To Do List" />
				<TodoList {form} {formData} name="start.toRelaxList" legend="To Relax List" />
			</div>
		</section>

		<Separator class="h-[2.5vh] from-blue-600 to-background" />
		<Separator class="h-[2.5vh] from-background to-blue-600" />

		<section data-section="end" data-edit-mode={editMode} class="group">
			<div class="space-y-8 bg-primary/10 p-4">
				<h2 class=" flex items-center">
					<span class="mr-3 flex text-2xl text-primary">Soirée</span>
					<Moon class="size-8 text-primary" />
					<ToggleEditModeButton onclick={toggleSection} />
				</h2>
				<TextMultiline
					{form}
					{formData}
					name="end.achievements"
					label="Les choses formidables vécues aujourd'hui + mes réussites"
				/>
				<TextEmoticons {form} {formData} name="end.mood" label="Émotion(s) du soir" />
			</div>
		</section>

		<Separator class="h-[2.5vh] from-violet-600 to-background" />
	</form>
</main>
