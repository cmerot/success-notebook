<script lang="ts">
	import { formatDay } from '$lib/utils-date';
	import { dayFormSchema, type DayFormType } from '$lib/schemas';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Moon, Sun } from 'lucide-svelte';
	import { saveDayEntry } from '$lib/stores/backend-store';
	import type { CalendarDate } from '@internationalized/date';
	import TodoList from './inputs/todo-list.svelte';
	import Text from './inputs/text.svelte';
	import TextMultiline from './inputs/text-multiline.svelte';
	import Header from '../layout/header.svelte';
	import TextEmoticons from './inputs/text-emoticons.svelte';
	import { Separator } from '$lib/components/separator';
	import FormStatus from './form-status.svelte';
	import FormSection from './form-section.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			form: SuperValidated<DayFormType>;
			isNew: boolean;
		};
	}

	let { data }: Props = $props();

	const form = useAutoSaveForm(data.form, {
		schema: dayFormSchema,
		onSave: (formData) => saveDayEntry(data.date, formData)
	});

	let { form: formData, enhance } = form;
	let editMode = $state<'edit' | 'view'>(data.isNew ? 'edit' : 'view');
</script>

<Header title="Mes succès du quotidien" class="theme-blue">
	<FormStatus {form} title={formatDay(data.date)} />
</Header>

<main>
	<form use:enhance class="theme-blue">
		<Separator class="h-[2.5vh] from-background to-blue-600" />

		<FormSection section="start" {editMode} title="Matin" icon={Sun}>
			<Text {form} {formData} name="start.grateful" label="Je suis reconnaissant·e pour" />
			<TextEmoticons {form} {formData} name="start.mood" label="Émotion(s) du matin" />
			<Text {form} {formData} name="start.desire" label="J'attends avec impatience" />
			<Text {form} {formData} name="start.goal" label="Je serais satisfait·e de ma journée si" />
			<TodoList {form} {formData} name="start.todoList" legend="To Do List" />
			<TodoList {form} {formData} name="start.toRelaxList" legend="To Relax List" />
		</FormSection>

		<Separator class="h-[2.5vh] from-blue-600 to-background" />
		<Separator class="h-[2.5vh] from-background to-blue-600" />

		<FormSection section="end" {editMode} title="Soirée" icon={Moon}>
			<TextMultiline
				{form}
				{formData}
				name="end.achievements"
				label="Les choses formidables vécues aujourd'hui + mes réussites"
			/>
			<TextEmoticons {form} {formData} name="end.mood" label="Émotion(s) du soir" />
		</FormSection>

		<Separator class="h-[2.5vh] from-violet-600 to-background" />
	</form>
</main>
