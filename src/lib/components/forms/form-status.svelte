<script lang="ts" generics="T extends z.ZodObject<any>">
	import type { FsSuperForm } from 'formsnap';
	type Props = {
		form: FsSuperForm<InferredType>;
		title: string;
	};
	import { z } from 'zod';
	import FormErrors from './form-errors.svelte';
	type InferredType = z.infer<T>;
	const { form, title }: Props = $props();
	const { tainted } = form;

	let showErrors = $state(false);
</script>

<div class="bg-background p-3 text-foreground">
	<div class="flex items-center justify-end gap-2">
		<button class="relative flex size-3" onclick={() => (showErrors = !showErrors)}>
			<span
				class="absolute inline-flex h-full w-full {$tainted &&
					'animate-ping'} rounded-full bg-sky-400 opacity-75"
			>
			</span>
			<span class="relative inline-flex size-3 rounded-full bg-sky-400"> </span>
			<span class="sr-only">Afficher les erreurs</span>
		</button>
		<div>{title}</div>
	</div>
	<div class="grid transition-all duration-300 ease-in-out {showErrors ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}">
		<div class="overflow-hidden">
			<FormErrors {form} bind:open={showErrors} />
		</div>
	</div>
</div>
