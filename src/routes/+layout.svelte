<script lang="ts">
	import { dev } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import TailwindIndicator from '$lib/components/tailwind-indicator.svelte';
	import { initSchemas } from '$lib/schemas';

	let { children } = $props();

	// Track navigation path history to detect direction
	let pathHistory: string[] = $state([]);
	let initialized = false;

	// Initialize schemas with user settings
	onMount(async () => {
		await initSchemas();
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// Initialize path history with the starting page
		if (!initialized && navigation.from) {
			pathHistory.push(navigation.from.url.pathname);
			initialized = true;
		}

		const fromPath = navigation.from?.url.pathname || '';
		const toPath = navigation.to?.url.pathname || '';

		// Detect back navigation: check if target path exists earlier in history
		let isBack = false;
		if (navigation.type === 'popstate') {
			const lastIndex = pathHistory.lastIndexOf(toPath);
			isBack = lastIndex >= 0 && lastIndex < pathHistory.length - 1;
		}

		// Update path history
		if (navigation.type === 'popstate' && isBack) {
			while (pathHistory.length > 0 && pathHistory[pathHistory.length - 1] !== toPath) {
				pathHistory.pop();
			}
		} else if (navigation.type === 'popstate') {
			pathHistory.push(toPath);
		} else {
			pathHistory.push(toPath);
		}

		// Determine transition type
		const menuPath = resolve('/menu');
		const isToMenu = toPath === menuPath;
		const isFromMenu = fromPath === menuPath;
		const transitionType = isBack
			? isFromMenu
				? 'back-from-menu'
				: 'back'
			: isToMenu
				? 'forward-to-menu'
				: 'forward';

		document.documentElement.dataset.transition = transitionType;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children()}

<Toaster />
<ModeWatcher />

{#if dev}
	<TailwindIndicator />
{/if}
