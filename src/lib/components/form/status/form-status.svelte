<script lang="ts" generics="T extends z.ZodObject<any>">
	import type { FsSuperForm } from 'formsnap';
	import { z } from 'zod';
	import FormErrors from './form-errors.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils/utils';
	import { Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	type InferredType = z.infer<T>;

	interface Props {
		form: FsSuperForm<InferredType>;
		isEditMode?: boolean;
		isEditable?: boolean;
	}

	let { form, isEditMode = $bindable(false), isEditable = false }: Props = $props();
	const { tainted, errors } = form;

	let showErrors = $state(false);
	let hasErrors = $derived(Object.keys($errors).length > 0);
</script>

{#if isEditable}
	{#if isEditMode}
		<Popover.Root bind:open={showErrors}>
			<Popover.Trigger
				class={cn(
					'rounded-lg bg-transparent p-3 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none'
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
	{/if}
	<button
		type="button"
		onclick={() => (isEditMode = !isEditMode)}
		aria-label={isEditMode ? 'Désactiver le mode édition' : 'Activer le mode édition'}
		class={cn(
			'rounded-lg p-2 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
			isEditMode
				? 'bg-primary text-primary-foreground hover:bg-primary/90'
				: 'text-muted-foreground'
		)}
	>
		<Pencil class="size-5" />
	</button>
{/if}
