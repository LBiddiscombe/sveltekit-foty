<script lang="ts">
	import p5 from 'p5';

	interface Props {
		sketch: (p: p5, width: number, height: number) => void;
	}

	let { sketch }: Props = $props();

	let container: HTMLDivElement;
	let instance: p5 | null = null;

	$effect(() => {
		if (!container) return;

		const w = container.clientWidth;
		const h = container.clientHeight;

		if (w === 0 || h === 0) return;

		instance = new p5((p: p5) => {
			sketch(p, w, h);
		}, container);

		return () => {
			instance?.remove();
			instance = null;
		};
	});
</script>

<div bind:this={container} class="w-full" style="aspect-ratio: 2/3"></div>
