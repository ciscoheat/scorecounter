<script lang="ts">
	export let player
	export let update
</script>

<div>
	{#each [-5, -2, -1] as point}
		<button on:click={e => update(player, point)}>{point}</button>
	{/each}
</div>
<div>
	{#each [1, 2, 5] as point}
		<button on:click={e => update(player, point)}>+{point}</button>
	{/each}
</div>
