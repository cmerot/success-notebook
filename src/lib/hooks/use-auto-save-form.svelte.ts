import { superForm, type SuperValidated } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { debounce } from '$lib/utils';
import type { z } from 'zod';

interface UseAutoSaveFormOptions<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	schema: z.ZodType<any, any, any>;
	onSave: (data: T) => Promise<void>;
	debounceMs?: number;
}

export function useAutoSaveForm<T extends Record<string, unknown>>(
	data: SuperValidated<T>,
	options: UseAutoSaveFormOptions<T>
) {
	const form = superForm(data, {
		SPA: true,
		resetForm: false,
		validators: zod4(options.schema),
		dataType: 'json',
		async onUpdate({ form, cancel }) {
			if (form.valid) {
				try {
					await options.onSave(form.data);
					// At this point submitting the form will
					// do nothing, except mess with the focus
					// which does not play well with auto-save
					cancel();
					tainted.set(undefined);
				} catch (error) {
					console.error('Error saving form:', error);
				}
			}
		}
	});

	const { form: formData, tainted } = form;

	let isInitialized = $state(false);

	const autoSave = debounce(() => {
		// Only submit if form has actual user changes
		if (get(tainted)) {
			form.submit();
		}
	}, options.debounceMs ?? 1000);

	onMount(() => {
		formData.subscribe(() => {
			if (!isInitialized) {
				isInitialized = true;
				return;
			}
			autoSave();
		});
	});

	return form;
}
