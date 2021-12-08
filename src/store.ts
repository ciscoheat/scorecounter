import { writable, derived } from 'svelte/store'

type Id = number;

type Player = {
    name: string,
    id: Id
}

type PointUpdate = {
    readonly player: Id,
    readonly points: number
}

const players = writable([] as Player[])
const points = writable([] as PointUpdate[])

const { subscribe } = derived([players, points], ([$players, $points]) => ({
    players: $players,
    points: $points
}))

// Player id tracker
let id = 0

export default {
    subscribe,
    updateScore: (player : Player, pointsChange : number) => {
        points.update(p => [...p, {player: player.id, points: pointsChange}])
    },
    addPlayer: () => {
        players.update(p => [...p, {name: '', id: ++id}])
    },
    updatePlayer: (id : Id, e) => {
        players.update(p => {
            const player = p.find(player => player.id == id)
            if(player) player.name = e.target.value
            return p
        })
    }
}
