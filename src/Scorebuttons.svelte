<script lang="ts">
	import type { Player } from "./types";

	export let player : Player
	export let update : (player : Player, points : number) => void
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
