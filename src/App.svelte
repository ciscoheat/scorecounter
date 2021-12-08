<script lang="ts">
	import Scorebuttons from './Scorebuttons.svelte'
	import game from './store'

	let scores : Map<string, number>
	$: {
		scores = new Map($game.players.map(p => [p, 0]))

		for (const point of $game.points) {
			scores.set(point.player, scores.get(point.player) + point.change)
		}
	}
</script>

<main>
	{#each $game.players as player}
		<div class="player">
			<input type="text" value="{player}"> <span class="score">{scores.get(player)}</span>
			<div class="points">
				<Scorebuttons player={player} update={game.updateScore} />
			</div>
		</div>
	{/each}
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
		padding: 1em;

		.player {
			margin-bottom: 20px;
			
			input {
			}
			
			.score {
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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>