<script lang="ts">
	import {
		getDayDataAtOffset,
		getMonthDataAtOffset,
		getWeekDataAtOffset,
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
	import { today, getLocalTimeZone } from '@internationalized/date';
	import { DaySlide, WeekSlide, MonthSlide } from '$lib/components/date-carousel/slides';
	import { type Slide as SlideType } from '$lib/components/date-carousel/use-carousel.svelte';
	import { title } from '$lib/stores/frontend-store';

	const baseDate = $state(today(getLocalTimeZone()));

	let isUpdating = $state(false);

	function handleDayChange(data: DayData) {
		if (isUpdating) return;

		// Week and month update
		const weekOffset = getWeekOffset(baseDate, data.date);
		const monthOffset = getMonthOffset(baseDate, data.date);

		isUpdating = true;
		weekRef?.carousel.setOffset(weekOffset);
		monthRef?.carousel.setOffset(monthOffset);
		isUpdating = false;

		// Title update, we always use the day date for that
		title.set(data.date);
	}

	function handleWeekChange(data: WeekData) {
		if (isUpdating) return;

		// Day and month update
		const dayOffset = getDayOffset(baseDate, data.date);
		const monthOffset = getMonthOffset(baseDate, data.date);

		isUpdating = true;
		dayRef?.carousel.setOffset(dayOffset);
		monthRef?.carousel.setOffset(monthOffset);
		isUpdating = false;

		// Plus we need to update the title
		const dayData = getDayDataAtOffset(baseDate, dayOffset);
		title.set(dayData.date);
	}

	function handleMonthChange(data: MonthData) {
		if (isUpdating) return;

		// Day and week update
		const dayOffset = getDayOffset(baseDate, data.date);
		const weekOffset = getWeekOffset(baseDate, data.date);

		isUpdating = true;
		dayRef?.carousel.setOffset(dayOffset);
		weekRef?.carousel.setOffset(weekOffset);
		isUpdating = false;

		// Title update
		const dayData = getDayDataAtOffset(baseDate, dayOffset);
		title.set(dayData.date);
	}

	let dayRef: InfiniteCarousel<DayData>;
	let weekRef: InfiniteCarousel<WeekData>;
	let monthRef: InfiniteCarousel<MonthData>;

	let monthOpen = $state(false);
	let weekOpen = $state(false);
	let dayOpen = $state(false);
</script>

<div class="flex flex-col">
	<!-- Day carousel -->
	<InfiniteCarousel
		bind:this={dayRef}
		getData={(offset: number) => getDayDataAtOffset(baseDate, offset)}
		onChange={handleDayChange}
		class="flex-1"
		windowSize={69}
	>
		{#snippet slideSnippet(slide: SlideType<DayData>)}
			<DaySlide bind:open={dayOpen} data={slide.data} />
		{/snippet}
	</InfiniteCarousel>

	<!-- Week carousel -->
	<InfiniteCarousel
		bind:this={weekRef}
		getData={(offset: number) => getWeekDataAtOffset(baseDate, offset)}
		onChange={handleWeekChange}
		class="flex-1"
		windowSize={11}
	>
		{#snippet slideSnippet(slide: SlideType<WeekData>)}
			<WeekSlide bind:open={weekOpen} data={slide.data} />
		{/snippet}
	</InfiniteCarousel>

	<!-- Month carousel -->
	<InfiniteCarousel
		bind:this={monthRef}
		getData={(offset: number) => getMonthDataAtOffset(baseDate, offset)}
		onChange={handleMonthChange}
		class="flex-1"
	>
		{#snippet slideSnippet(slide: SlideType<MonthData>)}
			<MonthSlide bind:open={monthOpen} data={slide.data} />
		{/snippet}
	</InfiniteCarousel>
</div>
