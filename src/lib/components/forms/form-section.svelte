<script lang="ts">
	import { toggleSection } from '$lib/utils';
	import type { Component } from 'lucide-svelte';
	import ToggleEditModeButton from './toggle-edit-mode-button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		section: string;
		editMode: 'edit' | 'view';
		title: string;
		children: Snippet;
		icon?: typeof Component;
	}

	let { section, editMode, title, children, icon: Icon }: Props = $props();
</script>

<section data-section={section} data-edit-mode={editMode} class="group">
	<div class="space-y-8 bg-primary/10 p-4">
		<h2 class="flex items-center">
			<span class="mr-3 flex text-2xl text-primary">{title}</span>
			<Icon class="size-8 text-primary" />
			<ToggleEditModeButton onclick={toggleSection} />
		</h2>
		{@render children()}
	</div>
</section>
