<script lang="ts">
	import PencilIcon from 'lucide-svelte/icons/pencil';
	import { dayFormSchema, type DayFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { FormStatus } from '$lib/components/form/status';
	import { formatDayLong } from '$lib/utils-date';
	import { TodoFieldset } from '$lib/components/form/todo';
	import { saveDayEntry } from '$lib/stores/backend-store';
	import * as Surface from '$lib/components/surface';
	import { EmoticonPicker } from '$lib/components/form/emoticon';
	import { TextField } from '$lib/components/form/text';
	import { Moon, Sun } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		data: {
			date: CalendarDate;
			day: {
				form: SuperValidated<DayFormType>;
				isNew: boolean;
			};
		};
		footer?: Snippet;
	}

	let { data, footer }: Props = $props();

	const form = useAutoSaveForm(data.day.form, {
		schema: dayFormSchema,
		onSave: (formData) => saveDayEntry(data.date, formData)
	});
	let { enhance: enhance } = form;
	let isEditMode = $state(false);
</script>

<form use:enhance>
	<Surface.Root class="theme-blue">
		<Surface.Header>
			{#snippet title()}
				<div class="mb-6 flex items-center gap-x-2">
					<EmoticonPicker {form} name="start.mood.icon" {isEditMode} class="inline" />
					<h2 class="text-2xl font-bold text-primary">{formatDayLong(data.date)}</h2>
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
				<span class="text-2xl">Matin</span>
				<Sun class="size-8" />
			</h2>

			<Surface.Section variant="outline">
				<TextField
					{form}
					label="Émotion(s) du matin"
					name="start.mood.text"
					{isEditMode}
					multiline={false}
				/>
			</Surface.Section>
			<Surface.Section variant="outline">
				<TextField {form} label="Je suis reconnaissant·e pour" name="start.grateful" {isEditMode} />
			</Surface.Section>
			<Surface.Section variant="outline">
				<TextField {form} label="J'attends avec impatience" name="start.desire" {isEditMode} />
			</Surface.Section>
			<Surface.Section variant="outline">
				<TextField
					{form}
					label="Je serais satisfait·e de ma journée si"
					name="start.goal"
					{isEditMode}
				/>
			</Surface.Section>
			<Surface.Section variant="outline">
				<TodoFieldset legend="To Do List" {form} name="start.todoList" {isEditMode} />
			</Surface.Section>
			<Surface.Section variant="outline">
				<TodoFieldset
					legend="To Relax List"
					{form}
					name="start.toRelaxList"
					{isEditMode}
					maxItems={3}
				/>
			</Surface.Section>
		</div>

		<div class="space-y-4">
			<h2 class="mt-12 flex items-center gap-3 text-primary">
				<span class="text-2xl">Soirée</span>
				<Moon class="size-8" />
			</h2>

			<Surface.Section variant="outline">
				<TextField
					{form}
					label="Les choses formidables vécues aujourd'hui + mes réussites"
					name="end.achievements"
					{isEditMode}
				/>
			</Surface.Section>
			<Surface.Section variant="outline">
				<TextField {form} label="Émotion(s) soir" name="end.mood.text" {isEditMode} />
			</Surface.Section>
		</div>

		{#if footer}
			<Surface.Footer>
				{@render footer()}
			</Surface.Footer>
		{/if}
	</Surface.Root>
</form>
