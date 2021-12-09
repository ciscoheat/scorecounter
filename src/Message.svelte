<script lang="ts">
	import { fade } from 'svelte/transition'

	export let timeout = 4000
	export let message

	let msgTimer;

	$: if(message) {
		if(msgTimer) clearTimeout(msgTimer)
		msgTimer = setTimeout(() => message = '', timeout)
	}
</script>

{#if message}
<div transition:fade class="message">
	<div class="inner">{message}</div>
</div>
{/if}

<style lang="scss">
	.message {
		position: fixed;
		width: 100%;
		bottom: 10px;
		
		.inner {
			width: 90%;
			border-radius: 1px;
			margin: 0 auto;
			padding: 10px;
			color: white;
			background-color: #f95;
			text-align: center;
			max-width: 500px;
		}
	}
</style>