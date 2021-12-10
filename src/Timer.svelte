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
	let countdown = new Date()
	let elapsed = false
	let stopTimer
	let sound : Howl

	const started = () => stopTimer
	const start = async () => {
		if(started()) return

		elapsed = false
		countdown = new Date()
		countdown.setSeconds(countdown.getSeconds() + $timerInterval)
		sound = new Howl({
			src: ['elapsed.mp3']
		});
		
		stopTimer = timer.subscribe(d => {
			if(countdown <= d)
				stop(true)
			else
				display = Math.min($timerInterval, Math.round((countdown.getTime() - d.getTime()) / 1000))
		})
	}
	const stop = (hasElapsed = false) => {
		if(stopTimer) {
			stopTimer()
			stopTimer = null
		} 
		if(hasElapsed && sound) sound.play()

		elapsed = hasElapsed
		display = $timerInterval
	}

	const newInterval = async (e) => {
		if(stopTimer) stop()
		timerInterval.set(parseInt((e.target as HTMLInputElement).value))
	}

</script>

<div class="timer">
	<div>Timer <input type="number" class="length" value={display} on:input={newInterval} min=1> s</div>
	<div>
		<button class="start" class:alt={started() && $alternate} on:click={start}>Start</button> 
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