import type { Snippet } from 'svelte';
import type { EmoticonSize } from './emoticon-sizes';
import type { HTMLAttributes } from 'svelte/elements';

export interface EmoticonProps extends HTMLAttributes<HTMLElement> {
	value?: string;
	fallback?: string;
	size?: EmoticonSize;
	class?: string;
	ariaLabel?: string;
	children?: Snippet<[]>;
}
