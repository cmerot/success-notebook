<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import Emoticons from './emoticons.svelte';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		startName: U;
		endName: U;
		fallback?: string;
		class?: string;
	}

	let { form, startName, endName, ...restProps }: Props = $props();

	const start = fieldProxy(form.form, startName) as unknown as Writable<string>;
	const end = fieldProxy(form.form, endName) as unknown as Writable<string>;
</script>

<Emoticons start={$start} end={$end} {...restProps} />
