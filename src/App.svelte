<script lang="ts">
	import Scorebuttons from './Scorebuttons.svelte'
	import Message from './Message.svelte'
	import Timer from './Timer.svelte';

	import { game } from './store'
	import { onDestroy, tick } from 'svelte'
	
	import type { Player } from './types'

	///////////////////////////////////////////////////////

	let SCORES = game.points

	const SCORES_update = async (player : Player, points : number) => {
		TIMER_stop()
		SCORES.update(player, points)
		MESSAGE_displayAddedScore()
	}

	const SCORE_isLastScorer = (player : Player) => 
		player.id == $game.points[$game.points.length-1]?.playerId

	///////////////////////////////////////////////////////

	let MESSAGE = ''

	const MESSAGE_displayAddedScore = () => {
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

			MESSAGE = (sum >= 0 
				? `Added ${absPoints} ${pointWord} to `
				: `Removed ${absPoints} ${pointWord} from `) + lastPlayer.name + '.'
		}
	}

	///////////////////////////////////////////////////////

	let TIMER : {stop: () => void, start: () => void}

	const TIMER_stop = () => TIMER.stop()

	///////////////////////////////////////////////////////

	let PLAYERS = game.players

	const PLAYERS_update = (e : KeyboardEvent, player : Player) => {
		const target = e.target as HTMLInputElement

		if(e.code == 'Enter') {
			if(!player.name)
				PLAYERS.delete(player.id)
			else
				PLAYERS_add()
		} else {
			PLAYERS.update(player.id, target.value)
		}
	}

	const PLAYERS_add = () => {
		PLAYERS.add()
		GAME_focusOnLastInput()
	}

	const PLAYERS_delete = (player : Player) => {
		PLAYERS.delete(player.id)
	}

	///////////////////////////////////////////////////////

	// Focus on the last input field, to enter player name.
	const GAME_focusOnLastInput = async () => {
		await tick()
		const el : HTMLInputElement = document.querySelector('main .player:last-child input')
		el?.focus()
	}
	
	const GAME_reset = (e) => {
		const menu = e.target as HTMLSelectElement

		if(menu.value == '' || !window.confirm('Are you sure?')) return

		switch (menu.value) {
			case 'scores':
				game.reset.scores()
				break

			case 'all':
				game.reset.all()
				GAME_focusOnLastInput()
				break
		}

		menu.value = ''
	}

	///// State ///////////////////////////////////////////

	$: playerScores = new Map($game.players.map(player => [
		player.id, 
		$game.points
			.filter(point => point.playerId == player.id)
			.reduce((score, point) => score + point.points, 0)
	]))

	///// Lifecycle ///////////////////////////////////////

	onDestroy(() => {
		TIMER = null
	})
</script>

<header>
	<Timer bind:this={TIMER} />
</header>
<main>
	<div>
	{#each $game.players as player}
		<div class="player">
			<div class="name">
				<input type="text" value="{player.name}" on:keyup={e => PLAYERS_update(e, player)}>
				{#if !player.name}
					<div on:click={() => PLAYERS_delete(player)} class="delete">&#10006;</div>
				{/if}
			</div>
			<div class="score" class:selected={SCORE_isLastScorer(player)}>
				{playerScores.get(player.id)}
			</div>
			<div class="scorebuttons">
				<Scorebuttons player={player} update={SCORES_update} />
			</div>
		</div>
	{/each}
	</div>	
</main>
<footer>
	<button on:click={PLAYERS_add}>Add player</button>
	<select on:change={GAME_reset}>
		<option value="">Reset</option>
		<option value="scores">Scores</option>
		<option value="all">All</option>
	</select>
</footer>

<Message message={MESSAGE} />


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