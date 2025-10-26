<script lang="ts">
	import { type DayFormType, type MonthFormType, type WeekFormType } from '$lib/schemas';
	import { type CalendarDate } from '@internationalized/date';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { DayForm, WeekForm, MonthForm } from '.';
	import { ArrowRight } from 'lucide-svelte';
	import type { FormConfig } from '$lib/types/form';
	import type { z } from 'zod';

	interface Props {
		data: {
			date: CalendarDate;
			day: {
				form: SuperValidated<DayFormType>;
				isEditMode: boolean;
				url: string;
				schema: z.ZodType<DayFormType>;
				config: FormConfig;
			};
			week: {
				form: SuperValidated<WeekFormType>;
				isEditMode: boolean;
				url: string;
				schema: z.ZodType<WeekFormType>;
				config: FormConfig;
			};
			month: {
				form: SuperValidated<MonthFormType>;
				isEditMode: boolean;
				url: string;
				schema: z.ZodType<MonthFormType>;
				config: FormConfig;
			};
		};
	}

	let { data }: Props = $props();
</script>

<DayForm data={{ ...data.day, date: data.date }} bindToTime isEditMode={data.day.isEditMode}>
	{#snippet footer()}
		<Button size="lg" href={data.day.url} class="w-full">Carnet quotidien <ArrowRight /></Button>
	{/snippet}
</DayForm>

<WeekForm data={{ ...data.week, date: data.date }} bindToTime isEditMode={data.week.isEditMode}>
	{#snippet footer()}
		<Button size="lg" href={data.week.url} class="w-full">Carnet hebdo <ArrowRight /></Button>
	{/snippet}
</WeekForm>

<MonthForm data={{ ...data.month, date: data.date }} bindToTime isEditMode={data.month.isEditMode}>
	{#snippet footer()}
		<Button size="lg" href={data.month.url} class="w-full">Carnet mensuel <ArrowRight /></Button>
	{/snippet}
</MonthForm>
