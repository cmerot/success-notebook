<script lang="ts" generics="T extends z.ZodObject<any>">
	import type { FsSuperForm } from 'formsnap';
	import { z } from 'zod';
	import FormErrors from './form-errors.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils';

	type InferredType = z.infer<T>;
	type Props = {
		form: FsSuperForm<InferredType>;
		title?: string;
		class?: string;
	};

	const { form, title, class: className }: Props = $props();
	const { tainted, errors } = form;

	let showErrors = $state(false);
	let hasErrors = $derived(Object.keys($errors).length > 0);
</script>

<Popover.Root bind:open={showErrors}>
	<Popover.Trigger
		class={cn(
			'rounded-lg p-2 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
			className
		)}
	>
		<span class="relative flex size-3">
			<span
				class="absolute inline-flex h-full w-full {$tainted &&
					'animate-ping'} rounded-full {hasErrors ? 'bg-destructive' : 'bg-sky-400'} opacity-75"
			>
			</span>
			<span
				class="relative inline-flex size-3 rounded-full {hasErrors
					? 'bg-destructive'
					: 'bg-sky-400'}"
			>
			</span>
			<span class="sr-only">Afficher les erreurs</span>
		</span>
	</Popover.Trigger>
	<Popover.Content class="w-80">
		<FormErrors {form} bind:open={showErrors} />
	</Popover.Content>
</Popover.Root>
