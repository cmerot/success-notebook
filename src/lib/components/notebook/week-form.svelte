<script lang="ts">
	import type { WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import { formatWeek, getWeekSectionEditMode } from '$lib/utils/date';
	import { saveWeekEntry } from '$lib/services/entries';
	import { Emoticon } from '$lib/components/form/emoticon';
	import BaseForm from './base-form.svelte';
	import type { FormConfig } from '$lib/types/form';
	import type { z } from 'zod';

	interface Props {
		data: {
			date: CalendarDate;
			config: FormConfig;
			form: SuperValidated<WeekFormType>;
			schema: z.ZodType<WeekFormType>;
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();
</script>

<BaseForm
	{data}
	onSave={(formData) => saveWeekEntry(data.date, formData)}
	formatTitle={(date: CalendarDate) => formatWeek(date, { size: 'md' })}
	getSectionEditMode={getWeekSectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons()}
		<Emoticon value={data.config.emoji} />
	{/snippet}
</BaseForm>
