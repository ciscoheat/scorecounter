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
	let countdown : Date | null;
	let sound : Howl

	let started : boolean
	let elapsed : boolean

	timer.subscribe(now => {
		started = !!countdown
		elapsed = started && countdown < now

		display = started
			? Math.max(0, Math.min($timerInterval, Math.round((countdown.getTime() - now.getTime()) / 1000)))
			: $timerInterval

		if(elapsed && sound) {
			sound.play()
			sound = null
		}
	})

	export const start = () => {
		countdown = new Date()
		countdown.setSeconds(countdown.getSeconds() + $timerInterval)
		sound = new Howl({ src: ['elapsed.mp3'] })
	}
	export const stop = () => {
		countdown = null
	}

	const intervalChanged = e => {
		stop()
		timerInterval.set(parseInt((e.target as HTMLInputElement).value))
	}

</script>

<div class="timer">
	<div>Timer <input type="number" class="length" value={display} on:input={intervalChanged} min=1> s</div>
	<div>
		<button class="start" class:alt={started && !elapsed && $alternate} on:click={start}>Start</button> 
		<button class="stop" class:alt={elapsed && $alternate} on:click={() => stop()}>Stop</button>
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
		}

		.length {
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