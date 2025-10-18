<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type { CheckListItemType } from '$lib/schemas/common.js';
	import type { Writable } from 'svelte/store';
	import TodoControl from './todo-control.svelte';
	import type * as FormPrimitive from 'formsnap';

	type FieldsetProps<T extends Record<string, unknown>, U extends FormPath<T>, M = any> = {
		/**
		 * The form object returned from calling `superForm` in your component.
		 */
		form: FormPrimitive.FsSuperForm<T, M>;

		/**
		 * The path to the field in the form object.
		 * Should point to a CheckListItemType[] field.
		 */
		name: U;

		isEditMode: boolean;

		legend?: string;
		class?: string;
		/**
		 * Maximum number of items allowed in the list.
		 * If not specified, there's no limit.
		 */
		maxItems?: number;
	};

	let {
		class: className,
		form,
		name,
		legend,
		maxItems,
		isEditMode,
		...restProps
	}: FieldsetProps<T, U> = $props();
	let value = fieldProxy(form.form, name) as unknown as Writable<CheckListItemType[]>;

	// Ensure there's always one empty item at the end (within maxItems limit)
	$effect(() => {
		if (!isEditMode) return;
		const items = $value;

		// If there are no items, add one empty item
		if (items.length === 0) {
			$value = [{ text: '', completed: false }];
			return;
		}

		const lastItem = items[items.length - 1];

		// If the last item has text and we're under maxItems, add a new empty item
		if (lastItem?.text && (!maxItems || items.length < maxItems)) {
			$value = [...items, { text: '', completed: false }];
		}
	});

	// Clean up empty items when leaving edit mode
	$effect(() => {
		if (isEditMode) return;
		const items = $value;

		// Remove all empty items when not in edit mode
		const nonEmptyItems = items.filter((item) => item.text.trim() !== '');
		if (nonEmptyItems.length !== items.length) {
			$value = nonEmptyItems;
		}
	});

	// Handle blur event to remove empty items (except the last one)
	function handleItemBlur(index: number) {
		const items = $value;
		const isLastItem = index === items.length - 1;
		const item = items[index];

		// Remove the item if it's empty and not the last item
		if (!item.text && !isLastItem) {
			$value = items.filter((_, i) => i !== index);
		}
	}
</script>

<Form.Fieldset {form} {name} class={className}>
	{#if legend}
		<Form.Legend class="mb-3 text-lg font-semibold text-primary">{legend}</Form.Legend>
	{/if}
	<div class="space-y-1">
		{#each $value as todo, i (i)}
			<TodoControl
				{...restProps}
				{form}
				{isEditMode}
				name={`${name}[${i}]` as FormPath<T>}
				onBlur={() => handleItemBlur(i)}
			/>
		{:else}
			<div class="rounded-lg px-3 py-2">...</div>
		{/each}
	</div>
	{#if maxItems && $value.length >= maxItems}
		<p class="mt-2 text-sm text-muted-foreground">
			Maximum of {maxItems} items reached
		</p>
	{/if}
</Form.Fieldset>
