import type { Snippet } from 'svelte';
import type { EmoticonSize } from './emoticon-sizes';

export interface EmoticonProps {
	value?: string;
	fallback?: string;
	size?: EmoticonSize;
	class?: string;
	ariaLabel?: string;
	children?: Snippet<[]>;
}
