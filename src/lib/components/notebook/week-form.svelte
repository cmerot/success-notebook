<script lang="ts">
	import { getWeekFormSchema, getWeekConfig, type WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import { formatWeek, getWeekSectionEditMode } from '$lib/utils/date';
	import { saveWeekEntry } from '$lib/services/entries';
	import { Emoticon } from '$lib/components/form/emoticon';
	import BaseForm from './base-form.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			week: {
				form: SuperValidated<WeekFormType>;
			};
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();

	const weekConfig = getWeekConfig();
</script>

<BaseForm
	data={{ date: data.date, form: data.week.form }}
	config={weekConfig}
	schema={getWeekFormSchema()}
	onSave={(formData) => saveWeekEntry(data.date, formData)}
	formatTitle={(date: CalendarDate) => formatWeek(date, { size: 'md' })}
	getSectionEditMode={getWeekSectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons()}
		<Emoticon value={weekConfig.emoji} />
	{/snippet}
</BaseForm>
