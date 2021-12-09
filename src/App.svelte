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
		game.scores.update(player, points)

		if(lastUpdate.player == player)
			lastUpdate.score += points
		else
			lastUpdate = {
				player: player,
				score: points
			}

		message = 'Added ' + lastUpdate.score + ' point(s).'
	}

	const updatePlayer = (id : number, e) => game.players.update(id, (e.target as HTMLInputElement).value)
</script>

<main>
	<div>
	{#each $game.players as player}
		<div class="player">
			<div class="name">
				<input type="text" value="{player.name}" on:input={e => updatePlayer(player.id, e)}>
				{#if !player.name}
					<button on:click={() => game.players.delete(player.id)} class="delete">&#10006;</button>
				{/if}
			</div>
			<div class="score">
				{scores.get(player.id)}
			</div>
			<div class="scorebuttons">
				<Scorebuttons player={player} update={updateScore} />
			</div>
		</div>
	{/each}
	</div>	
</main>
<footer>
	<button on:click={game.players.add}>Add player</button>
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
			display: grid;
			align-items: baseline;
			column-gap: 5px;
			grid-template-columns: 1fr 50px;
			grid-template-rows: auto;
			grid-template-areas: 
				"name score"
				"scorebuttons scorebuttons";

			margin-bottom: 30px;

			.name {
				grid-area: name;
				display: flex;
				gap: 2px;
				
				input {
					width: 100%;
				}
				
				.delete {
					padding: 0;
					border: 0;
					background-color: transparent;
					text-align: center;
					color: red;
					font-size: larger;
				}
			}
			
			.score {
				grid-area: score;
				text-align: center;
				font-weight: bold;
				padding: 7px 10px;
				background-color: #eee;
				border-radius: 10%;
				font-size: larger;
			}

			.scorebuttons {
				grid-area: scorebuttons;
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