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
				isEditMode: boolean;
			};
			week: {
				form: SuperValidated<WeekFormType>;
				isEditMode: boolean;
			};
			month: {
				form: SuperValidated<MonthFormType>;
				isEditMode: boolean;
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

<DayForm {data} bindToTime isEditMode={data.day.isEditMode}>
	{#snippet footer()}
		<Button href={dayHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</DayForm>

<WeekForm {data} bindToTime isEditMode={data.week.isEditMode}>
	{#snippet footer()}
		<Button href={weekHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</WeekForm>

<MonthForm {data} bindToTime isEditMode={data.month.isEditMode}>
	{#snippet footer()}
		<Button href={monthHref} class="w-full">Ouvrir →</Button>
	{/snippet}
</MonthForm>
