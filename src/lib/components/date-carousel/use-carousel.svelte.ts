import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';

export interface Slide<TData> {
	data: TData;
	key: string;
	offset: number;
}
export interface CarouselConfig<TData> {
	getData: (offset: number) => TData;
	windowSize?: number; // Must be odd and at least 3 (default 9)
	onChange?: (data: TData) => void;
}
export interface CarouselState<TData> {
	emblaApi: EmblaCarouselType | undefined;
	currentOffset: number;
	slides: Slide<TData>[];
	onInit: (event: CustomEvent<EmblaCarouselType>) => void;
	goToNext: () => void;
	goToPrev: () => void;
	scrollTo: (index: number) => void;
	setOffset: (offset?: number) => void;
	options: EmblaOptionsType;
}
export function useCarousel<TData>(config: CarouselConfig<TData>): CarouselState<TData> {
	const { windowSize = 5 } = config;

	// Validate windowSize
	if (windowSize < 3 || windowSize % 2 === 0) {
		throw new Error('windowSize must be an odd number >= 3 (e.g., 3, 5, 7)');
	}

	const centerIndex = Math.floor(windowSize / 2);

	let emblaApi = $state<EmblaCarouselType | undefined>(undefined);
	let currentOffset = $state(0);

	const slides = $derived.by(() => {
		return Array.from({ length: windowSize }, (_, i) => {
			// Calculate the data offset for this slide position
			// relative to the currently selected slide's offset
			const relativePosition = i - centerIndex;
			const offset = currentOffset + relativePosition;

			return {
				data: config.getData(offset),
				offset,
				key: `carousel-${i}` // Stable keys based on position
			};
		});
	});

	let internalSelect = false;
	function onInit(event: CustomEvent<EmblaCarouselType>) {
		emblaApi = event.detail;

		let timeoutId: number;

		emblaApi.on('select', (emblaApi: EmblaCarouselType) => {
			if (internalSelect) return;

			const selectedIndex = emblaApi.selectedScrollSnap();
			config.onChange?.(slides[selectedIndex].data);

			// After a brief delay, reset the carousel to the center slide
			// and update the currentOffset to the newly selected slide's offset
			// This creates the infinite scrolling effect
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				currentOffset = slides[selectedIndex].offset;
				internalSelect = true;
				emblaApi.scrollTo(centerIndex, true);
				internalSelect = false;
			}, 1000);
		});
	}

	const options: EmblaOptionsType = {
		startIndex: centerIndex,
		skipSnaps: true,
		duration: 20
	};
	function goToNext() {
		emblaApi?.scrollNext();
	}

	function goToPrev() {
		emblaApi?.scrollPrev();
	}

	function scrollTo(index: number) {
		emblaApi?.scrollTo(index);
	}

	function setOffset(offset = 0) {
		let slideIndex = slides.findIndex((slide) => slide.offset === offset);
		if (slideIndex === -1) {
			// If the desired offset is outside the current window,
			// we need to update the current window by updating currentOffset
			currentOffset = offset;
			slideIndex = slides.findIndex((slide) => slide.offset === offset);
			config.onChange?.(slides[slideIndex].data);
		} else {
			// If the offset is within the current window,
			// just trigger scrollTo which will trigger onChange
			emblaApi?.scrollTo(slideIndex);
		}
	}

	return {
		emblaApi,
		get currentOffset() {
			return currentOffset;
		},
		get slides() {
			return slides;
		},
		goToPrev,
		goToNext,
		scrollTo,
		onInit,
		setOffset,
		options
	};
}
