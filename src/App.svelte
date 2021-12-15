<script lang="ts">
	import Scorebuttons from './Scorebuttons.svelte'
	import Message from './Message.svelte'
	import Timer from './Timer.svelte';

	import { game } from './store'
	import { onDestroy, tick } from 'svelte'
	
	import type { Player } from './types'

	///////////////////////////////////////////////////////

	let scores = game.points

	const scores_update = async (player : Player, points : number) => {
		timer_stop()
		scores.update(player, points)
		message_displayAddedScore()
	}

	const scores_lastPlayer = (player : Player) => 
		player.id == $game.points[$game.points.length-1]?.playerId

	///////////////////////////////////////////////////////

	let message = ''

	const message_displayAddedScore = () => {
		const lastPoint = $game.points.length-1
		const lastPlayer = lastPoint >= 0
			? $game.players.find(p => p.id == $game.points[lastPoint].playerId)
			: null

		if(lastPlayer) {
			let sum = 0
			for (let i = lastPoint; i >= 0; i--) {
				const point = $game.points[i];

				if(point.playerId != lastPlayer.id) break
				else sum += point.points
			}

			const pointWord = 'point' + (Math.abs(sum) == 1 ? '' : 's')
			const absPoints = Math.abs(sum)

			message = (sum >= 0 
				? `Added ${absPoints} ${pointWord} to `
				: `Removed ${absPoints} ${pointWord} from `) + lastPlayer.name + '.'
		}
	}

	///////////////////////////////////////////////////////

	let timer : {stop: () => void, start: () => void}

	const timer_stop = () => timer.stop()

	///////////////////////////////////////////////////////

	let players = game.players

	const players_update = (e : KeyboardEvent, player : Player) => {
		const target = e.target as HTMLInputElement

		if(e.code == 'Enter') {
			if(!player.name)
				players.delete(player.id)
			else
				players_add()
		} else {
			players.update(player.id, target.value)
		}
	}

	const players_add = () => {
		players.add()
		game_focusOnLastInput()
	}

	///////////////////////////////////////////////////////

	// Focus on the last input field, to enter player name.
	const game_focusOnLastInput = async () => {
		await tick()
		const el : HTMLInputElement = document.querySelector('main .player:last-child input')
		el?.focus()
	}
	
	let resetOption = ''
	const game_reset = () => {
		if(resetOption == '' || !window.confirm('Are you sure?')) return

		switch (resetOption) {
			case 'scores':
				game.reset.scores()
				break

			case 'all':
				game.reset.all()
				game_focusOnLastInput()
				break
		}

		resetOption = ''
	}

	///////////////////////////////////////////////////////

	$: playerScores = new Map($game.players.map(player => [
		player.id, 
		$game.points
			.filter(point => point.playerId == player.id)
			.reduce((score, point) => score + point.points, 0)
	]))

	///// Lifecycle ///////////////////////////////////////

	onDestroy(() => {
		timer = null
	})
</script>

<header>
	<Timer bind:this={timer} />
</header>
<main>
	<div>
	{#each $game.players as player}
		<div class="player">
			<div class="name">
				<input type="text" value="{player.name}" on:keyup={e => players_update(e, player)}>
				{#if !player.name}
					<div on:click={() => game.players.delete(player.id)} class="delete">&#10006;</div>
				{/if}
			</div>
			<div class="score" class:selected={scores_lastPlayer(player)}>
				{playerScores.get(player.id)}
			</div>
			<div class="scorebuttons">
				<Scorebuttons player={player} update={scores_update} />
			</div>
		</div>
	{/each}
	</div>	
</main>
<footer>
	<button on:click={players_add}>Add player</button>
	<select bind:value={resetOption} on:change={game_reset}>
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
					cursor: pointer;
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