export type PlayerId = number;

export type Player = {
    readonly id: PlayerId
    readonly name: string,
}

export type ScoreUpdate = {
    readonly playerId: PlayerId,
    readonly points: number
}

export type Game = {
    timer: number,
    readonly players: Player[],
    readonly points: ScoreUpdate[]
}
