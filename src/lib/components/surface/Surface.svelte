<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SurfaceProps {
		children: Snippet;
		class?: string;
	}

	let { children, class: className = '' }: SurfaceProps = $props();
</script>

<div class="w-full overflow-hidden {className}">
	<!-- Top fade in gradient -->
	<div class="h-20 bg-gradient-to-b from-transparent to-primary/10"></div>

	<!-- Main content with solid background -->
	<div class="space-y-4 bg-primary/10 px-2 xs:px-4">
		{@render children()}
	</div>

	<!-- Bottom fade out gradient -->
	<div class="h-20 bg-gradient-to-b from-primary/10 to-transparent"></div>
</div>
