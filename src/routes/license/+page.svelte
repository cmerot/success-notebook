<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import Header from '$lib/components/layout/header.svelte';
</script>

<Header title="License" />

<div class="p-3">
	<p>Cette application est distribuée sous licence MIT, une licence libre et permissive.</p>
	<div class="space-y-4 text-sm">
		<h3 class="text-base font-semibold">Qu'est-ce que cela signifie ?</h3>
		<ul class="list-disc space-y-2 pl-6 text-muted-foreground">
			<li>Vous pouvez utiliser cette application gratuitement</li>
			<li>Vous pouvez modifier le code source</li>
			<li>Vous pouvez distribuer vos modifications</li>
			<li>Vous pouvez l'utiliser dans des projets commerciaux</li>
			<li>Aucune garantie n'est fournie</li>
		</ul>

		<h3 class="pt-4 text-base font-semibold">Texte complet de la licence (en anglais)</h3>
		<div class="rounded-lg bg-muted p-4">
			<pre class="font-mono text-xs leading-relaxed whitespace-pre-wrap">MIT License

Copyright (c) 2025 success-notebook contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>
		</div>

		<p class="pt-2 text-xs text-muted-foreground">
			Note : La version anglaise est la seule version officielle et légalement valide de cette
			licence.
		</p>
	</div>
</div>
