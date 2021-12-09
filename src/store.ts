import { writable, derived } from 'svelte/store'

type Id = number;

type Player = {
    name: string,
    readonly id: Id
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
let id = saved.players.reduce((id, p) => Math.max(id, p.id), 0)

export default {
    subscribe,
    scores: {
        update: (player : Player, pointsChange : number) => {
            points.update(p => [...p, {player: player.id, points: pointsChange}])
        }
    },
    players: {
        add: () => {
            players.update(p => [...p, {name: '', id: ++id}])
        },
        update: (id : Id, name : string) => {
            players.update(p => {
                const player = p.find(player => player.id == id)
                if(player) player.name = name
                return p
            })
        },
        delete: (id : Id) => {
            players.update(p => p.filter(pl => pl.id != id))
            points.update(p => p.filter(p1 => p1.player != id))
        }    
    },
    reset: () => {
        players.set([])
        points.set([])
    }
}
