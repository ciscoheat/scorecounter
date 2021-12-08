<script lang="ts">
	import Scorebuttons from './Scorebuttons.svelte'
	import game from './store'

	let scores : Map<number, number>
	$: {
		scores = new Map($game.players.map(p => [p.id, 0]))

		for (const point of $game.points) {
			scores.set(point.player, scores.get(point.player) + point.points)
		}
	}
</script>

<main>
	<div>
	{#each $game.players as player}
		<div class="player">
			<input type="text" value="{player.name}" on:change={e => game.updatePlayer(player.id, e)}> <span class="score">{scores.get(player.id)}</span>
			<div class="points">
				<Scorebuttons player={player} update={game.updateScore} />
			</div>
		</div>
	{/each}
	</div>	
</main>
<footer>
	<button on:click={game.addPlayer}>Add player</button>
</footer>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
		padding: 1em;

		.player {
			margin-bottom: 30px;
			
			input {
			}
			
			.score {
				display: inline-block;
				text-align: center;
				min-width: 40px; 
				font-weight: bold;
				margin: 5px;
				padding: 7px 10px;
				background-color: #eee;
				border-radius: 10%;
				font-size: larger;
			}

			.points {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}
		}
	}

	footer {
		display: flex;
		justify-content: center;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>