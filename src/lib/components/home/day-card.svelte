<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { formatDayLong } from '$lib/utils-date';
	import Check from '@lucide/svelte/icons/check';
	import type { CalendarDate } from '@internationalized/date';
	import { dayFormSchema, type DayFormType } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { useAutoSaveForm } from '$lib/hooks/use-auto-save-form.svelte';
	import { saveDayEntry } from '$lib/stores/backend-store';
	import TodoList from '../forms/inputs/todo-list2.svelte';
	import ToggleEditModeButton from '../forms/toggle-edit-mode-button.svelte';
	import { toggleSection } from '$lib/utils';

	interface Props {
		date: CalendarDate;
		data: {
			form: SuperValidated<DayFormType>;
			isNew: boolean;
		};
	}

	let { date, data }: Props = $props();

	const form = useAutoSaveForm(data.form, {
		schema: dayFormSchema,
		onSave: (formData) => saveDayEntry(date, formData)
	});

	let { form: formData, enhance } = form;

	const href = ['success', date.year, date.month, date.day, 'day'].join('/');
</script>

<form use:enhance>
	<Card.Root class="theme-blue rounded-none border-none bg-primary/10 shadow-none ">
		<Card.Header class="space-y-4">
			<Card.Title class="text-primary">
				<div class="flex items-center gap-x-4">
					<div class="text-4xl">
						{#if $formData.start.mood.icon}
							{$formData.start.mood.icon}
						{:else}
							☀️
						{/if}
					</div>
					<div class="text-xl text-primary">{formatDayLong(date)}</div>
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if $formData.start.todoList.length || $formData.start.toRelaxList.length}
				<div class="mb-2 space-y-4 rounded-2xl bg-background p-4">
					{#if $formData.start.todoList.length}
						<div>
							<h3 class="font-semibold text-primary">To Do</h3>
							<ul>
								{#each $formData.start.todoList as todo}
									<li class="py-1">
										<Check class="inline {todo.completed ? '' : 'text-muted'}" />
										<span class={todo.completed ? 'line-through' : ''}> {todo.text}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
					{#if $formData.start.toRelaxList.length}
						<div>
							<h3 class="font-semibold text-primary">To Relax</h3>
							<ul>
								{#each $formData.start.toRelaxList as todo}
									<li class="py-1">
										<Check class="inline {todo.completed ? '' : 'text-muted'}" />
										<span class={todo.completed ? 'line-through' : ''}> {todo.text}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
			<h3 class="text-lg font-semibold text-primary">Quotidien</h3>
			Matin et soirée : gratitude, objectifs et réflexions
		</Card.Content>
		<Card.Footer>
			<Button {href} class="w-full">Ouvrir →</Button>
		</Card.Footer>
	</Card.Root>
</form>
