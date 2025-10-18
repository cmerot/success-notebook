<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import TodoCheckbox from './todo-checkbox.svelte';
	import EditableTextBare from '../text/editable-text-bare.svelte';
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import type { CheckListItemType } from '$lib/schemas/common.js';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		name: U;
		isEditMode: boolean;
		onBlur?: () => void;
		placeholder?: string;
	}

	let { form, name, isEditMode, onBlur, placeholder = 'Nouvelle tâche...' }: Props = $props();

	const todo = fieldProxy(form.form, name) as unknown as Writable<CheckListItemType>;

	const completedClasses = $derived($todo.completed ? 'text-muted-foreground line-through' : '');
	const inputClass = $derived(`flex-1 ${completedClasses}`);
	const viewClass = $derived(
		`flex-1 text-left ${$todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`
	);
</script>

{#if isEditMode || $todo.text}
	<Form.Control>
		{#snippet children({ props })}
			<label
				class="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
			>
				<TodoCheckbox
					{...isEditMode ? {} : props}
					bind:checked={$todo.completed}
					disabled={isEditMode && !$todo.text}
				/>
				<EditableTextBare
					{isEditMode}
					bind:value={$todo.text}
					{placeholder}
					{onBlur}
					formProps={isEditMode ? props : {}}
					{inputClass}
					{viewClass}
					emptyText=""
				/>
			</label>
		{/snippet}
	</Form.Control>
{/if}
