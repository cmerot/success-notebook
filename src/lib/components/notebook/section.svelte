<script lang="ts">
	import * as Surface from '$lib/components/surface';
	import type { Component } from 'lucide-svelte';
	import type { FieldState } from '$lib/types/form';

	interface Props {
		title: string;
		icon: typeof Component;
		fields: FieldState[];
	}

	let { title, icon: Icon, fields }: Props = $props();
</script>

<div class="space-y-4">
	<h2 class="flex items-center gap-3 text-primary">
		<span class="text-2xl">{title}</span>
		<Icon class="size-8" />
	</h2>

	{#each fields as field}
		{#if field.shouldShow}
			<Surface.Section variant="outline">
				{@const FieldComponent = field.config.component}
				<FieldComponent {...field.props} />
			</Surface.Section>
		{/if}
	{/each}
</div>
