import { writable, derived } from 'svelte/store'

type Player = string

type PointUpdate = {
    readonly player: Player,
    readonly change: number
}

const players = writable(['Test'] as Player[])
const points = writable([] as PointUpdate[])

const { subscribe } = derived([players, points], ([$players, $points]) => ({
    players: $players,
    points: $points
}))

export default {
    subscribe,
    updateScore: (player : Player, change : number) => {
        points.update(p => [...p, {player, change}])
    }
}
