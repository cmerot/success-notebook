<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { invoke } from '@tauri-apps/api/core';
	import { ping } from 'tauri-plugin-statusbar-api';

	let response = $state('');

	function updateResponse(returnValue: string | null) {
		response +=
			`[${new Date().toLocaleTimeString()}] ` +
			(typeof returnValue === 'string' ? returnValue : JSON.stringify(returnValue)) +
			'<br>';
	}

	function _ping() {
		ping('Pong!').then(updateResponse).catch(updateResponse);
	}

	export async function ping2(value: string): Promise<string | null> {
		return await invoke<{ value?: string }>('plugin:statusbar|ping', {
			payload: {
				value
			}
		}).then((r) => (r.value ? r.value : null));
	}

	function _ping2() {
		ping2('Pong!')
			.then((result) => {
				console.log(result);
				updateResponse(result);
			})
			.catch(updateResponse);
	}
</script>

<Header title="StatusBar" variant="sidebar" />

<div class="space-y-8 p-8">
	<Button onclick={_ping}>Ping with plugin API</Button>
	<Button onclick={_ping2}>Ping2 with invoke</Button>
	<div>{@html response}</div>
</div>
