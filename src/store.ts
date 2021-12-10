import { get, writable, derived } from 'svelte/store'
import type { Game, PlayerId, Player, ScoreUpdate } from './types'

///////////////////////////////////////////////////////////

const initialState = () => ({
    players: [{name: '', id: 1}],
    points: []
} as Game)

// Load saved game
const saved : Game = JSON.parse(localStorage.getItem('game')) ?? initialState()

const players = writable(saved.players as Player[])
const points = writable(saved.points as ScoreUpdate[])

const { subscribe } = derived([players, points], ([$players, $points]) => ({
    players: $players,
    points: $points
}))

subscribe(data => {
    localStorage.setItem('game', JSON.stringify(data))
})

export default {
    subscribe,
    scores: {
        update: (player : Player, pointsChange : number) => {
            points.update(p => [...p, {playerId: player.id, points: pointsChange}])
        }
    },
    players: {
        add: () => {
            const nextId = get(players).reduce((id, p) => Math.max(id, p.id), 0) + 1
            players.update(p => [...p, {name: '', id: nextId}])
        },
        update: (id : PlayerId, name : string) => {
            players.update(p => p.map(p2 => p2.id != id ? p2 : {id, name}))
        },
        delete: (id : PlayerId) => {
            players.update(p => p.filter(pl => pl.id != id))
            points.update(p => p.filter(p1 => p1.playerId != id))
        }    
    },
    reset: () => {
        const state = initialState()
        players.set(state.players)
        points.set(state.points)
    }
}
