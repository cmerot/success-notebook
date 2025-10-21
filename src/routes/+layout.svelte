<script lang="ts">
	import { dev } from '$app/environment';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import {
		SlideoverTransition,
		FlushTransition,
		CarouselTransition
	} from '$lib/components/transitions';
	import TailwindIndicator from '$lib/components/tailwind-indicator.svelte';

	let { children, data } = $props();
</script>

<SlideoverTransition key={data.url} duration={300}>
	{@render children()}
</SlideoverTransition>

<Toaster />
<ModeWatcher />

{#if dev}
	<TailwindIndicator />
{/if}
