<script lang="ts">
	import Scorebuttons from './Scorebuttons.svelte'
	import Message from './Message.svelte'
	import Timer from './Timer.svelte';

	import { game } from './store'
	import { tick } from 'svelte'
	
	import type { Player } from './types';

	$: scores = new Map($game.players.map(player => [
		player.id, 
		$game.points
			.filter(point => point.playerId == player.id)
			.reduce((score, point) => score + point.points, 0)
	]))

	let message = ''

	const updateLastScorer = () => {
		const lastPoint = $game.points.length-1
		const lastPlayer = lastPoint >= 0
			? $game.players.find(p => p.id == $game.points[lastPoint].playerId)
			: null

		if(lastPlayer) {
			let sum = 0
			for (let i = lastPoint; i >= 0; i--) {
				const point = $game.points[i];
				if(point.playerId != lastPlayer.id) break;
				else sum += point.points
			}
			return {player: lastPlayer, score: sum}
		} else {
			return {player: null, score: 0}
		}
	}

	const updateScore = async (player : Player, points : number) => {
		game.scores.update(player, points)
		const scorer = updateLastScorer()

		message = (scorer.score >= 0 ? 'Added' : 'Removed') + ' ' + 
			Math.abs(scorer.score) + ' point' + (Math.abs(scorer.score) == 1 ? '' : 's') + ' to ' + scorer.player.name + '.'
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

	const focusOnLastInputField = async () => {
		await tick()
		// Focus on the last input field, to enter player name.
		const el : HTMLInputElement = document.querySelector('main .player:last-child input')
		if(el) el.focus()
	}

	const addPlayer = () => {
		game.players.add()
		focusOnLastInputField()
	}

	let resetType
	const reset = () => {
		if(resetType == '' || !window.confirm('Are you sure?')) return

		game.reset(resetType)
		
		if(resetType == 'all')
			focusOnLastInputField()

		resetType = ''
	}
</script>

<header>
	<Timer />
</header>
<main>
	<div>
	{#each $game.players as player}
		<div class="player">
			<div class="name">
				<input type="text" value="{player.name}" on:keyup={e => updatePlayer(e, player)}>
				{#if !player.name}
					<div on:click={() => game.players.delete(player.id)} class="delete">&#10006;</div>
				{/if}
			</div>
			<div class="score" class:selected={player.id == $game.points[$game.points.length-1]?.playerId}>
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
	<select bind:value={resetType} on:change={reset}>
		<option value="">Reset</option>
		<option value="scores">Scores</option>
		<option value="all">All</option>
	</select>
</footer>

<Message message={message} />


<style lang="scss">
	header {
		position: sticky;
		top: 0;
		padding-top: 10px;
		border-bottom: 1px solid #ddd;
		background-color: #fcfcfc;
	}

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
				align-items: baseline;
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
				box-sizing: border-box;
				text-align: center;
				font-weight: bold;
				padding: 7px 10px;
				background-color: #eee;
				border-radius: 10%;
				font-size: larger;

				&.selected {
					padding: 6px 10px;
					border: 1px solid #888;
				}
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
		align-items: baseline;

		button {
			margin: 10px;
		}

		select {
			height: 36px;
		}
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>