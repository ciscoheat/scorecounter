import { writable, derived } from 'svelte/store'
import type { Game, PlayerId, Player, ScoreUpdate } from './types'

///////////////////////////////////////////////////////////

// Load from localStorage
const saved : Game = JSON.parse(localStorage.getItem('game')) ?? {
    players: [],
    points: []
}

const players = writable(saved.players as Player[])
const points = writable(saved.points as ScoreUpdate[])

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
        update: (id : PlayerId, name : string) => {
            players.update(p => p.map(p2 => p2.id != id ? p2 : {id, name}))
        },
        delete: (id : PlayerId) => {
            players.update(p => p.filter(pl => pl.id != id))
            points.update(p => p.filter(p1 => p1.player != id))
        }    
    },
    reset: () => {
        players.set([])
        points.set([])
    }
}
