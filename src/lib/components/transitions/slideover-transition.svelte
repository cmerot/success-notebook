<script lang="ts">
	/**
	 * Navigation flow:
	 *
	 * - home -> menu: menu slides from left
	 * - menu -> back: menu slides to left
	 * - menu -> page: page slides from right
	 * - home -> page: page slides from right
	 * - page -> back: page slides to right
	 */

	import { cubicOut } from 'svelte/easing';
	import type { EasingFunction, TransitionConfig } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		key: string;
		duration?: number;
	};

	type Params = {
		delay?: number;
		duration?: number;
		easing?: EasingFunction;
	};

	let { children, key, duration = 300 }: Props = $props();

	let navigationState = $state<{
		isBack: boolean;
		fromPath: string;
		toPath: string;
	}>({
		isBack: false,
		fromPath: '',
		toPath: ''
	});

	beforeNavigate((navigation) => {
		const fromPath = navigation.from?.url.pathname || '';
		const toPath = navigation.to?.url.pathname || '';
		const isBack = navigation.type === 'popstate';

		navigationState = { isBack, fromPath, toPath };
	});

	function slideIn(
		_node: Element,
		{ delay = 0, duration = 300, easing = cubicOut }: Params = {}
	): TransitionConfig {
		const { isBack, toPath } = navigationState;
		const isThisPageMenu = toPath === '/menu';
		return {
			delay,
			duration,
			easing,
			css: (t) => {
				// Backward navigation - new page stays still underneath
				if (isBack) {
					return `transform: translateX(0); z-index: 1;`;
				}

				// Forward navigation (page) - page comes from right
				// Forward navigation (menu) - menu comes from left
				const startX = isThisPageMenu ? -100 : 100; // Menu: left (-100), Normal: right (100)
				const x = startX * (1 - t); // Animate from startX to 0
				return `transform: translateX(${x}%); z-index: 2;`;
			}
		};
	}

	function slideOut(
		_node: Element,
		{ delay = 0, duration = 300, easing = cubicOut }: Params = {}
	): TransitionConfig {
		const { isBack, fromPath } = navigationState;
		const isThisPageMenu = fromPath === '/menu';
		return {
			delay,
			duration,
			easing,
			css: (t) => {
				// Backward navigation (page) - page leaves to right
				// Backward navigation (menu) - menu leaves to left
				if (isBack) {
					const endX = isThisPageMenu ? -100 : 100; // Menu: left (-100), Normal: right (100)
					const x = endX * (1 - t); // Animate from 0 to endX (t goes from 1 to 0 in out transitions)
					return `transform: translateX(${x}%); z-index: 2;`;
				}

				// Case 1 & Case 1': Forward navigation - old page stays still underneath
				return `transform: translateX(0); z-index: 1;`;
			}
		};
	}
</script>

{#key key}
	<div
		in:slideIn={{ duration }}
		out:slideOut={{ duration }}
		style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; overflow-x: hidden; overflow-y: auto;"
		class="bg-background"
	>
		{@render children()}
	</div>
{/key}
