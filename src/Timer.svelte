<script lang="ts">
	import { timer as timerInterval } from './store'
	import { readable } from 'svelte/store'
	import { Howl } from 'howler'
	
	const timer = readable(new Date(), set => {
		setInterval(() => {
			set(new Date())
		}, 100)
	})

	const alternate = readable(false, set => {
		setInterval(() => {
			set(!$alternate)
		}, 650)
	})

	///////////////////////////////////////////////////////

	let display = $timerInterval
	let _countdown : Date | null;
	let _sound : Howl

	const started = () => !!_countdown
	const elapsed = () => started() && _countdown < new Date()

	timer.subscribe(now => {
		display = started()
			? Math.max(0, Math.min($timerInterval, Math.round((_countdown.getTime() - now.getTime()) / 1000)))
			: $timerInterval

		if(elapsed() && _sound) {
			_sound.play()
			_sound = null
		}
	})

	export const start = () => {
		_countdown = new Date()
		_countdown.setSeconds(_countdown.getSeconds() + $timerInterval)
		_sound = new Howl({ src: ['elapsed.mp3'] })
	}
	export const stop = () => {
		_countdown = null
	}

	const userChangedInterval = e => {
		stop()
		timerInterval.set(parseInt((e.target as HTMLInputElement).value))
	}
</script>


<div class="timer">
	<div>Timer <input type="number" value={display} on:input={userChangedInterval} min=1> s</div>
	<div>
		<button class="start" class:alt={started() && !elapsed() && $alternate} on:click={start}>Start</button> 
		<button class="stop" class:alt={elapsed() && $alternate} on:click={stop}>Stop</button>
	</div>
</div>


<style lang="scss">
	.timer {
		display: flex;
		justify-content: center;
		align-items: baseline;
		gap: 20px;

		input {
			font-weight: bold;
			width: 50px;
		}

		.start {
			background-color: #dfd;
			&.alt {
				background-color: #6f6;
			}
		}
		.stop {
			background-color: #fdd;
			&.alt {
				background-color: #f66;
			}
		}
	}
</style>