<script lang="ts">
	import Scorebuttons from './Scorebuttons.svelte'
	import Message from './Message.svelte'

	import game from './store'

	import { tick } from 'svelte'
	import type { Player } from './types';

	$: scores = new Map($game.players.map(player => [
		player.id, 
		$game.points
			.filter(point => point.player == player.id)
			.reduce((score, point) => score + point.points, 0)
	]))

	let lastScorer = {player: (null as Player), score: 0}
	let message = ''

	const updateScore = (player : Player, points : number) => {
		game.scores.update(player, points)

		if(lastScorer.player == player)
			lastScorer.score += points
		else
			lastScorer = {
				player: player,
				score: points
			}

		message = (lastScorer.score >= 0 ? 'Added' : 'Removed') + ' ' + 
			Math.abs(lastScorer.score) + ' point' + (Math.abs(lastScorer.score) == 1 ? '' : 's') + ' to ' + lastScorer.player.name + '.'
	}

	const updatePlayer = (e : KeyboardEvent, player : Player) => {
		const target = e.target as HTMLInputElement

		if(e.code == 'Enter') {
			if(!player.name)
				game.players.delete(player.id)
			else
				addPlayer()
		} else {
			game.players.update(player.id, target.value)
		}
	}

	const addPlayer = async () => {
		game.players.add()
		await tick()
		// Focus on the last input field, to enter player name.
		const el : HTMLInputElement = document.querySelector('main .player:last-child input')
		if(el) el.focus()
	}
</script>

<main>
	<div>
	{#each $game.players as player}
		<div class="player">
			<div class="name">
				<input type="text" value="{player.name}" on:keyup={e => updatePlayer(e, player)}>
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
	<button on:click={addPlayer}>Add player</button>
	<button on:click={() => {if(window.confirm('Are you sure?')) game.reset()}}>Reset</button>
</footer>

<Message message={message} />

<style lang="scss">
	main {
		padding-top: 30px;
		display: flex;
		justify-content: center;

		.player {
			display: grid;
			align-items: baseline;
			column-gap: 5px;
			grid-template-columns: 200px 50px;
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