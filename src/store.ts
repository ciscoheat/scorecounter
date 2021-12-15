import { get, writable, derived } from 'svelte/store'
import type { Game, PlayerId, ScoreUpdate } from './types'

///////////////////////////////////////////////////////////

const initialState = () => ({
    timer: 60,
    players: [{name: '', id: 1}],
    points: []
} as Game)

// Load saved game or use default
const gameState : Game = JSON.parse(localStorage.getItem('game')) ?? initialState()

const players = writable(gameState.players)
const points = writable(gameState.points)

export const timer = writable(gameState.timer)

const { subscribe } = derived([players, points, timer], ([$players, $points, $timer]) => ({
    players: $players,
    points: $points,
    timer: $timer
}))

// Save automatically
subscribe(data => {
    localStorage.setItem('game', JSON.stringify(data))
})

export const game = {
    subscribe,
    points: {
        update: (id : PlayerId, pointsChange : number) => {
            points.update(p => [...p, {playerId: id, points: pointsChange}])
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
    reset: {
        all: () => {
            const state = initialState()
    
            points.set(state.points)    
            players.set(state.players)
            timer.set(state.timer)
        },
        scores: () => {
            const state = initialState()

            points.set(state.points)    
        }
    }
}
