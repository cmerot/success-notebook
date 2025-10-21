<script lang="ts">
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { monthFormSchema, type MonthFormType } from '$lib/schemas';
	import { monthConfig } from '$lib/components/notebook/config';
	import { formatMonth, getMonthSectionEditMode } from '$lib/utils/date';
	import { saveMonthEntry } from '$lib/stores/backend-store';
	import { Emoticon } from '$lib/components/form/emoticon';
	import type { Snippet } from 'svelte';
	import BaseForm from './base-form.svelte';

	interface Props {
		data: {
			date: CalendarDate;
			month: {
				form: SuperValidated<MonthFormType>;
			};
		};
		bindToTime?: boolean;
		isEditMode?: boolean;
		footer?: Snippet;
	}

	let { data, bindToTime = false, isEditMode = $bindable(false), footer }: Props = $props();

	const monthData = {
		date: data.date,
		form: data.month.form
	};
</script>

<BaseForm
	data={monthData}
	config={monthConfig}
	schema={monthFormSchema}
	onSave={(formData) => saveMonthEntry(data.date, formData)}
	formatTitle={formatMonth}
	getSectionEditMode={getMonthSectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons()}
		<Emoticon value={monthConfig.emoji} size="sm" />
	{/snippet}
</BaseForm>
