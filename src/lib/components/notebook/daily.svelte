<script lang="ts">
	import { type DayFormType, type MonthFormType, type WeekFormType } from '$lib/schemas';
	import { startOfMonth, startOfWeek, type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { DayForm, WeekForm, MonthForm } from '.';

	interface Props {
		data: {
			date: CalendarDate;
			day: {
				form: SuperValidated<DayFormType>;
				isNew: boolean;
			};
			week: {
				form: SuperValidated<WeekFormType>;
				isNew: boolean;
			};
			month: {
				form: SuperValidated<MonthFormType>;
				isNew: boolean;
			};
		};
	}

	let { data }: Props = $props();

	const firstDayOfWeek = startOfWeek(data.date, navigator.language);
	const firstDayOfMonth = startOfMonth(data.date);
	const dayHref = ['', data.date.year, data.date.month, data.date.day, 'day'].join('/');
	const weekHref = ['', firstDayOfWeek.year, firstDayOfWeek.month, firstDayOfWeek.day, 'week'].join(
		'/'
	);
	const monthHref = [
		'',
		firstDayOfMonth.year,
		firstDayOfMonth.month,
		firstDayOfMonth.day,
		'month'
	].join('/');
</script>

<DayForm {data} bindToTime isEditable isEditMode={data.day.isNew}>
	{#snippet footer()}
		<Button href={dayHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</DayForm>

<WeekForm {data} bindToTime isEditable isEditMode={data.week.isNew}>
	{#snippet footer()}
		<Button href={weekHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</WeekForm>

<MonthForm {data} bindToTime isEditable isEditMode={data.month.isNew}>
	{#snippet footer()}
		<Button href={monthHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</MonthForm>
