<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { Writable } from 'svelte/store';
	import { fieldProxy, type FormPath } from 'sveltekit-superforms';
	import type * as FormPrimitive from 'formsnap';
	import EmoticonsLevel from './emoticons-level.svelte';
	import type { EmoticonSize } from './emoticon-sizes';

	interface Props {
		form: FormPrimitive.FsSuperForm<T>;
		startName: U;
		endName: U;
		fallback?: string;
		class?: string;
		size?: EmoticonSize;
	}

	let { form, startName, endName, ...restProps }: Props = $props();

	const start = fieldProxy(form.form, startName) as unknown as Writable<number | undefined>;
	const end = fieldProxy(form.form, endName) as unknown as Writable<number | undefined>;
</script>

<EmoticonsLevel start={$start} end={$end} {...restProps} />
