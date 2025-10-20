<script lang="ts">
	import type { Snippet } from 'svelte';

	interface FooterProps {
		children: Snippet;
		class?: string;
	}

	let { children, class: className = '' }: FooterProps = $props();
</script>

<footer class="mt-auto w-full pt-4 text-sm {className}">
	{@render children()}
</footer>
