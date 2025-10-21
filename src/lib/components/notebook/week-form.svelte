<script lang="ts">
	import { weekFormSchema, type WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import { weekConfig } from '$lib/components/notebook/config';
	import { formatWeek, getWeekSectionEditMode } from '$lib/utils-date';
	import { saveWeekEntry } from '$lib/stores/backend-store';
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

	const weekData = {
		date: data.date,
		form: data.week.form
	};
</script>

<BaseForm
	data={weekData}
	config={weekConfig}
	schema={weekFormSchema}
	onSave={(formData) => saveWeekEntry(data.date, formData)}
	formatTitle={formatWeek}
	getSectionEditMode={getWeekSectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons()}
		<Emoticon value={weekConfig.emoji} size="sm" />
	{/snippet}
</BaseForm>
