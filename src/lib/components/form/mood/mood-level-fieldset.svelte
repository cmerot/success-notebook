<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import { type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import { TextField } from '$lib/components/form/text';
	import { EmoticonLevelField, getMoodEmoticons } from '$lib/components/form/emoticon';

	const emoticons = getMoodEmoticons();
	interface Props {
		/**
		 * The form object returned from calling `superForm` in your component.
		 */
		form: FormPrimitive.FsSuperForm<T>;

		/**
		 * The path to the field in the form object.
		 * Should point to a MoodLevelSchemaType field.
		 */
		name: U;

		isEditMode: boolean;

		legend?: string;
		class?: string;
		placeholder?: string;
	}

	let { class: className, form, name, legend, placeholder, isEditMode }: Props = $props();
</script>

<Form.Fieldset {form} {name} class={className}>
	{#if legend}
		<Form.Legend class="mb-3 text-lg font-semibold text-primary">{legend}</Form.Legend>
	{/if}
	<div class="flex items-end space-x-1">
		<EmoticonLevelField
			{form}
			name={`${name}.level` as U}
			{isEditMode}
			size="sm"
			fallback={emoticons[5]}
		/>
		<TextField {form} name={`${name}.text` as U} {isEditMode} {placeholder} class="flex-1" />
	</div>
</Form.Fieldset>
