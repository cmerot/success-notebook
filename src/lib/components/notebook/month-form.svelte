<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { MonthFormType } from '$lib/schemas';
	import { formatMonth, getMonthSectionEditMode } from '$lib/utils/date';
	import { saveMonthEntry } from '$lib/services/entries';
	import { Emoticon } from '$lib/components/form/emoticon';
	import type { Snippet } from 'svelte';
	import BaseForm from './base-form.svelte';
	import type { FormConfig } from '$lib/types/form';
	import type { z } from 'zod';

	interface Props {
		data: {
			date: CalendarDate;
			config: FormConfig;
			form: SuperValidated<MonthFormType>;
			schema: z.ZodType<MonthFormType>;
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();
</script>

<BaseForm
	{data}
	onSave={(formData) => saveMonthEntry(data.date, formData)}
	formatTitle={(date: CalendarDate) => formatMonth(date, { size: 'md' })}
	getSectionEditMode={getMonthSectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons()}
		<Emoticon value={data.config.emoji} />
	{/snippet}
</BaseForm>
