<script lang="ts">
	import {
		getDayData,
		getMonthData,
		getWeekData,
		type DayData,
		type MonthData,
		type WeekData
	} from '$lib/components/date-carousel/utils.svelte';
	import InfiniteCarousel from '$lib/components/date-carousel/infinite-carousel.svelte';
	import {
		getDayOffset,
		getMonthOffset,
		getWeekOffset
	} from '$lib/components/date-carousel/utils.svelte';
	import { today, startOfWeek, startOfMonth, getLocalTimeZone } from '@internationalized/date';
	import { DaySlide, WeekSlide, MonthSlide } from '$lib/components/date-carousel/slides';
	import { type Slide as SlideType } from '$lib/components/date-carousel/use-carousel.svelte';
	import { title } from '$lib/stores/frontend-store';

	const locale = navigator.language;
	const baseDate = $state(today(getLocalTimeZone()));

	let isUpdating = $state(false);

	function handleDayChange(data: DayData) {
		if (isUpdating) return;

		selectedDay = data.date;
		title.set(selectedDay);

		// Week and month update
		const weekOffset = getWeekOffset(baseDate, data.date);
		const monthOffset = getMonthOffset(baseDate, data.date);

		isUpdating = true;
		weekRef?.carousel.setOffset(weekOffset);
		monthRef?.carousel.setOffset(monthOffset);
		isUpdating = false;
	}

	function handleWeekChange(data: WeekData) {
		if (isUpdating) return;

		selectedWeek = data.date;
		// title.set(selectedDate);

		// Day and month update
		const start = startOfWeek(data.date, locale);
		const dayOffset = getDayOffset(baseDate, start);
		const monthOffset = getMonthOffset(baseDate, data.date);

		isUpdating = true;
		dayRef?.carousel.setOffset(dayOffset);
		monthRef?.carousel.setOffset(monthOffset);
		isUpdating = false;
	}

	function handleMonthChange(data: MonthData) {
		if (isUpdating) return;

		selectedMonth = data.date;
		// title.set(selectedDate);

		// Day and week update
		const start = startOfMonth(data.date);
		const dayOffset = getDayOffset(baseDate, start);
		const weekOffset = getWeekOffset(baseDate, start);

		isUpdating = true;
		dayRef?.carousel.setOffset(dayOffset);
		weekRef?.carousel.setOffset(weekOffset);
		isUpdating = false;
	}

	let selectedDay = $state(baseDate);
	let selectedMonth = $state(baseDate);
	let selectedWeek = $state(baseDate);

	let dayRef: InfiniteCarousel<DayData>;
	let weekRef: InfiniteCarousel<WeekData>;
	let monthRef: InfiniteCarousel<MonthData>;

	let monthOpen = $state(false);
	let weekOpen = $state(false);
	let dayOpen = $state(false);
</script>

<div class="flex flex-col">
	<InfiniteCarousel
		bind:this={dayRef}
		getData={getDayData}
		onChange={handleDayChange}
		class="flex-1"
		windowSize={69}
	>
		{#snippet slideSnippet(slide: SlideType<DayData>)}
			<DaySlide bind:open={dayOpen} data={slide.data} />
		{/snippet}
	</InfiniteCarousel>
	<InfiniteCarousel
		bind:this={weekRef}
		getData={getWeekData}
		onChange={handleWeekChange}
		class="flex-1"
		windowSize={11}
	>
		{#snippet slideSnippet(slide: SlideType<WeekData>)}
			<WeekSlide bind:open={weekOpen} data={slide.data} />
		{/snippet}
	</InfiniteCarousel>
	<InfiniteCarousel
		bind:this={monthRef}
		getData={getMonthData}
		onChange={handleMonthChange}
		class="flex-1"
	>
		{#snippet slideSnippet(slide: SlideType<MonthData>)}
			<MonthSlide bind:open={monthOpen} data={slide.data} />
		{/snippet}
	</InfiniteCarousel>
</div>
