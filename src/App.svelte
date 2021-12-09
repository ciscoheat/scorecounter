<script lang="ts">
	import Scorebuttons from './Scorebuttons.svelte'
	import Message from './Message.svelte'

	import game from './store'

	let scores : Map<number, number>
	$: {
		scores = new Map($game.players.map(p => [p.id, 0]))

		for (const point of $game.points) {
			scores.set(point.player, scores.get(point.player) + point.points)
		}
	}

	let lastUpdate = {player: null, score: 0}
	let message = ''

	const updateScore = (player, points) => {
		game.updateScore(player, points)

		if(lastUpdate.player == player)
			lastUpdate.score += points
		else
			lastUpdate = {
				player: player,
				score: points
			}

		message = 'Added ' + lastUpdate.score + ' point(s).'
	}
</script>

<main>
	<div>
	{#each $game.players as player}
		<div class="player">
			<input type="text" value="{player.name}" on:input={e => game.updatePlayer(player.id, e)}> 
			<span class="score">{scores.get(player.id)}</span>
			<div class="points">
				<Scorebuttons player={player} update={updateScore} />
			</div>
		</div>
	{/each}
	</div>	
</main>
<footer>
	<button on:click={game.addPlayer}>Add player</button>
	<button on:click={() => {if(window.confirm('Are you sure?')) game.reset()}}>Reset</button>
</footer>

<Message message={message} />

<style lang="scss">
	body {
		margin: 0; 
		padding: 0;
		height: 100vh;
	}

	main {
		padding-top: 30px;
		display: flex;
		justify-content: center;

		.player {
			margin-bottom: 30px;
			
			.score {
				display: inline-block;
				text-align: center;
				min-width: 40px; 
				font-weight: bold;
				margin-left: 5px;
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

		button {
			margin: 10px;
		}
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>