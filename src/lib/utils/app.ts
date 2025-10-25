/**
 * Reloads the application
 * Used after settings changes to apply new configuration
 */
export function reloadApp(): void {
	if (typeof window !== 'undefined') {
		window.location.reload();
	}
}
