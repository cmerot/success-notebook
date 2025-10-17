<script lang="ts">
	import { Eye, SquarePen } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		onclick: (event: MouseEvent) => void;
	}

	const { onclick }: Props = $props();
</script>

<Button {onclick} class="relative ml-auto h-10 w-10 rounded-full">
	<SquarePen
		class="absolute size-5 opacity-100 transition-opacity duration-200 group-data-[edit-mode=edit]:opacity-0"
	/>
	<Eye
		class="absolute size-5 opacity-100 transition-opacity duration-200 group-data-[edit-mode=view]:opacity-0"
	/>
</Button>
