<script lang="ts">
	import type { DayFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import { formatDay, getDaySectionEditMode } from '$lib/utils/date';
	import { saveDayEntry } from '$lib/services/entries';
	import { EmoticonsLevelField } from '$lib/components/form/emoticon';
	import BaseForm from './base-form.svelte';
	import type { FormConfig } from '$lib/types/form';
	import type { z } from 'zod';

	interface Props {
		data: {
			date: CalendarDate;
			form: SuperValidated<DayFormType>;
			schema: z.ZodType<DayFormType>;
			config: FormConfig;
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();
</script>

<BaseForm
	{data}
	onSave={(formData) => saveDayEntry(data.date, formData)}
	formatTitle={formatDay}
	getSectionEditMode={getDaySectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons({ form })}
		<EmoticonsLevelField {form} startName="start.mood.level" endName="end.mood.level" size="md" />
	{/snippet}
</BaseForm>
