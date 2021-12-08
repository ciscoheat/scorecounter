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

type Game = {
    readonly players: Player[],
    readonly points: PointUpdate[]
}

///////////////////////////////////////////////////////////

// Load from localStorage
const saved : Game = JSON.parse(localStorage.getItem('game')) ?? {
    players: [],
    points: []
}

const players = writable(saved.players as Player[])
const points = writable(saved.points as PointUpdate[])

const { subscribe } = derived([players, points], ([$players, $points]) => ({
    players: $players,
    points: $points
}))

subscribe(data => {
    localStorage.setItem('game', JSON.stringify(data))
})

// Player id tracker
let id = 0

export default {
    subscribe,
    updateScore: (player : Player, pointsChange : number) => {
        points.update(p => [...p, {player: player.id, points: pointsChange}])
    },
    addPlayer: () => {
        players.update(p => [...p, {name: '', id: ++id}])
        // TODO: Fix this hack
        setTimeout(() => {
            const el : HTMLInputElement = document.querySelector('main .player:last-child input')
            if(el) el.focus()
        }, 10)
    },
    updatePlayer: (id : Id, e) => {
        players.update(p => {
            const player = p.find(player => player.id == id)
            if(player) player.name = e.target.value
            return p
        })
    },
    reset: () => {
        players.set([])
        points.set([])
    }
}
