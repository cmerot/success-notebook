<script lang="ts">
	import { getDayFormSchema, getDayConfig, type DayFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import { formatDay, getDaySectionEditMode } from '$lib/utils/date';
	import { saveDayEntry } from '$lib/stores/backend-store';
	import { EmoticonsField } from '$lib/components/form/emoticon';
	import BaseForm from './base-form.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			day: {
				form: SuperValidated<DayFormType>;
			};
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();
</script>

<BaseForm
	data={{ date: data.date, form: data.day.form }}
	config={getDayConfig()}
	schema={getDayFormSchema()}
	onSave={(formData) => saveDayEntry(data.date, formData)}
	formatTitle={formatDay}
	getSectionEditMode={getDaySectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons({ form })}
		<EmoticonsField {form} startName="start.mood.icon" endName="end.mood.icon" size="md" />
	{/snippet}
</BaseForm>
