<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { getMonthFormSchema, getMonthConfig, type MonthFormType } from '$lib/schemas';
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

	const monthConfig = getMonthConfig();
</script>

<BaseForm
	data={{ date: data.date, form: data.month.form }}
	config={monthConfig}
	schema={getMonthFormSchema()}
	onSave={(formData) => saveMonthEntry(data.date, formData)}
	formatTitle={(date: CalendarDate) => formatMonth(date, { size: 'md' })}
	getSectionEditMode={getMonthSectionEditMode}
	{bindToTime}
	bind:isEditMode
	{footer}
>
	{#snippet emoticons()}
		<Emoticon value={monthConfig.emoji} />
	{/snippet}
</BaseForm>
