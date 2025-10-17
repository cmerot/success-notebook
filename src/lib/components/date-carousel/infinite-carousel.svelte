<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { useCarousel, type Slide } from './use-carousel.svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { cn } from '$lib/utils';

	type Props = {
		getData: (offset: number) => T;
		slideSnippet: Snippet<[Slide<T>]>;
		onChange?: (data: T) => void;
		windowSize?: number;
		class?: string;
	};

	const { getData, slideSnippet, onChange, windowSize, class: className }: Props = $props();

	// Initialize carousel and let Svelte track reactivity through getters
	export const carousel = useCarousel<T>({ getData, onChange, windowSize });
</script>

<div
	class={cn('overflow-hidden', className)}
	use:emblaCarouselSvelte={{ options: carousel.options, plugins: [] }}
	onemblaInit={carousel.onInit}
>
	<div class="flex [touch-action:pan-y_pinch-zoom] space-x-5 [backface-visibility:hidden]">
		{#each carousel.slides as slide (slide.key)}
			<div class="min-w-0 flex-[0_0_100%] select-none">
				{@render slideSnippet(slide)}
			</div>
		{/each}
	</div>
</div>
