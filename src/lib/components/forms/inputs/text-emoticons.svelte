<script lang="ts" generics="T extends z.ZodObject<any>">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import type { SuperFormData, FormPath } from 'sveltekit-superforms/client';
	import { string, z } from 'zod';
	import type { FsSuperForm } from 'formsnap';
	import { fieldProxy } from 'sveltekit-superforms/client';
	import * as Popover from '$lib/components/ui/popover';
	import * as InputGroup from '$lib/components/ui/input-group';
	import type { Writable } from 'svelte/store';

	type InferredType = z.infer<T>;

	type Text = {
		text: string;
		icon: string;
	};

	interface Props {
		form: FsSuperForm<InferredType>;
		formData: SuperFormData<InferredType>;
		name: FormPath<InferredType>;
		label: string;
	}
	let { form, formData, name, label }: Props = $props();
	let value = $derived(fieldProxy(formData, name) as unknown as Writable<Text>);

	const icons = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
	let open = $state(false);
</script>

<Form.Field {form} {name} data-container>
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>{label}</Form.Label>
			<div data-variant="edit">
				<div>
					<InputGroup.Root class="rounded-md bg-background">
						<InputGroup.Input {...props} bind:value={$value.text} autocomplete="off" />
						<InputGroup.Addon align="inline-start" class="drounded-full dbg-background">
							<Popover.Root bind:open>
								<Popover.Trigger class="dbg-background px-1 text-lg"
									>{$value.icon || '☀️'}</Popover.Trigger
								>
								<Popover.Content>
									{#each icons as icon}
										<button
											class="p-4 text-4xl"
											onclick={() => {
												$value.icon = icon;
												open = false;
											}}
										>
											{icon}
										</button>
									{/each}
								</Popover.Content>
							</Popover.Root>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>
			</div>
			<div data-variant="view">
				<p>
					{#if $value.text || $value.icon}
						{$value.icon} {$value.text}
					{:else}
						...
					{/if}
				</p>
			</div>
		{/snippet}
	</Form.Control>
</Form.Field>
