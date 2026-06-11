<script lang="ts">
	interface Props {
		onclick?: () => void;
		disabled?: boolean;
		variant?: 'primary' | 'secondary' | 'danger';
		children?: import('svelte').Snippet;
	}

	let { onclick, disabled = false, variant = 'primary', children }: Props = $props();
</script>

<button
	{onclick}
	{disabled}
	class="w-full px-4 py-3 text-center font-pixel text-xs uppercase tracking-wide transition-opacity disabled:cursor-not-allowed disabled:opacity-40 {variant ===
	'primary'
		? 'bg-success text-dark'
		: variant === 'secondary'
			? 'bg-warning text-dark'
			: 'bg-danger text-dark'}"
>
	{@render children?.()}
</button>
