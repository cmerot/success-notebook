<script lang="ts">
	let width = $state(0);
	let dpr = $state(1);

	$effect(() => {
		width = window.innerWidth;
		dpr = window.devicePixelRatio;

		const handleResize = () => {
			width = window.innerWidth;
			dpr = window.devicePixelRatio;
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div style="text-3xl text-white">xxs</div>

<div
	class="fixed bottom-1 left-1 z-50 flex h-6 w-auto items-center justify-center gap-2 rounded-full bg-gray-800 p-3 font-mono text-xs text-white"
>
	<div class="block xs:hidden">xxs</div>
	<div class="hidden xs:block sm:hidden">xs</div>
	<div class="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">sm</div>
	<div class="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
	<div class="hidden lg:block xl:hidden 2xl:hidden">lg</div>
	<div class="hidden xl:block 2xl:hidden">xl</div>
	<div class="hidden 2xl:block">2xl</div>
	<div>{width}px</div>
	<div>@{dpr}x</div>
</div>
