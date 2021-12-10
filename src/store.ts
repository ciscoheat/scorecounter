import { get, writable, derived } from 'svelte/store'
import type { Game, PlayerId, Player, ScoreUpdate } from './types'

///////////////////////////////////////////////////////////

const initialState = () => ({
    timer: 30,
    players: [{name: '', id: 1}],
    points: []
} as Game)

// Load saved game or use default
const gameState : Game = JSON.parse(localStorage.getItem('game')) ?? initialState()

const players = writable(gameState.players as Player[])
const points = writable(gameState.points as ScoreUpdate[])

export const timer = writable(gameState.timer ?? 30)

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
    reset: (type : 'all' | 'scores') => {
        const state = initialState()

        if(type == 'all' || type =='scores')
            points.set(state.points)

        if(type == 'all') {
            players.set(state.players)
            timer.set(state.timer)
        }
    }
}
