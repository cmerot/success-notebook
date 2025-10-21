export type EmoticonSize = 'sm' | 'md' | 'lg';

export interface EmoticonSizeConfig {
	container: string;
	textSingle: string;
	textDual: string;
	dualPositionStart: string;
	dualPositionEnd: string;
}

export const emoticonSizes: Record<EmoticonSize, EmoticonSizeConfig> = {
	sm: {
		container: 'h-12 w-12 xs:h-16 xs:w-16 sm:h-20 sm:w-20',
		textSingle: 'text-2xl xs:text-4xl sm:text-5xl',
		textDual: 'text-xl xs:text-3xl sm:text-4xl',
		dualPositionStart: 'top-0.5 left-1 xs:top-1 xs:left-2 sm:top-1.5 sm:left-2.5',
		dualPositionEnd: 'right-1 bottom-0.5 xs:right-2 xs:bottom-1 sm:right-2.5 sm:bottom-1.5'
	},
	md: {
		container: 'h-16 w-16 xs:h-20 xs:w-20 sm:h-24 sm:w-24',
		textSingle: 'text-4xl xs:text-5xl sm:text-6xl',
		textDual: 'text-3xl xs:text-4xl sm:text-5xl',
		dualPositionStart: 'top-1 left-2 xs:top-1.5 xs:left-2.5 sm:top-2 sm:left-3',
		dualPositionEnd: 'right-2 bottom-1 xs:right-2.5 xs:bottom-1.5 sm:right-3 sm:bottom-2'
	},
	lg: {
		container: 'h-20 w-20 xs:h-24 xs:w-24 sm:h-28 sm:w-28',
		textSingle: 'text-5xl xs:text-6xl sm:text-7xl',
		textDual: 'text-4xl xs:text-5xl sm:text-6xl',
		dualPositionStart: 'top-1.5 left-2.5 xs:top-2 xs:left-3 sm:top-2.5 sm:left-3.5',
		dualPositionEnd: 'right-2.5 bottom-1.5 xs:right-3 xs:bottom-2 sm:right-3.5 sm:bottom-2.5'
	}
};
