<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import type { EasingFunction, TransitionConfig } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	import type { Snippet } from 'svelte';

	let {
		key,
		duration = 300,
		children
	}: { key: string; duration?: number; children: Snippet } = $props();

	type Params = {
		delay?: number;
		duration?: number;
		easing?: EasingFunction;
	};

	let isBackNavigation = $state(false);

	beforeNavigate((navigation) => {
		// Detect if this is a back navigation
		isBackNavigation = navigation.type === 'popstate';
	});

	function slideIn(
		_node: Element,
		{ delay = 0, duration = 300, easing = cubicOut }: Params = {}
	): TransitionConfig {
		return {
			delay,
			duration,
			easing,
			css: (t) => {
				// Slide from right (100%) to center (0) for forward navigation
				// Slide from left (-100%) to center (0) for back navigation
				const direction = isBackNavigation ? -100 : 100;
				const x = direction * (1 - t);
				return `transform: translateX(${x}%);`;
			}
		};
	}

	function slideOut(
		_node: Element,
		{ delay = 0, duration = 300, easing = cubicOut }: Params = {}
	): TransitionConfig {
		return {
			delay,
			duration,
			easing,
			css: (t) => {
				// Slide from center (0) to left (-100%) for forward navigation
				// Slide from center (0) to right (100%) for back navigation
				const direction = isBackNavigation ? 100 : -100;
				const x = direction * (1 - t);
				return `transform: translateX(${x}%);`;
			}
		};
	}
</script>

{#key key}
	<div
		in:slideIn={{ duration }}
		out:slideOut={{ duration }}
		style="position: absolute; width: 100%; height: 100%;"
	>
		{@render children()}
	</div>
{/key}
