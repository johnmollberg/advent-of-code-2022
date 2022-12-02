import {processInput} from '../utils/io-utils'

type Move = 'rock' | 'paper' | 'scissors'
type EnemyKey = 'A' | 'B' | 'C'
type HeroKey = 'X' | 'Y' | 'Z'
type Outcome = 'win' | 'draw' | 'loss'

type MoveDetails = {
    points: number
    enemyKey: EnemyKey
    heroKey: HeroKey
    outcomes: Record<Move, Outcome>
}

const MOVE_DETAILS: Record<Move, MoveDetails> = {
    rock: {
        points: 1,
        enemyKey: 'A',
        heroKey: 'X',
        outcomes: {
            paper: 'loss',
            scissors: 'win',
            rock: 'draw',
        },
    },
    paper: {
        points: 2,
        enemyKey: 'B',
        heroKey: 'Y',
        outcomes: {
            paper: 'draw',
            scissors: 'loss',
            rock: 'win',
        },
    },
    scissors: {
        points: 3,
        enemyKey: 'C',
        heroKey: 'Z',
        outcomes: {
            paper: 'win',
            scissors: 'draw',
            rock: 'loss',
        },
    },
} as const

const BONUS_POINTS = {
    loss: 0,
    draw: 3,
    win: 6,
}

const computeScore = (heroKey: HeroKey, enemyKey: EnemyKey): number => {
    const moveDetails = Object.values(MOVE_DETAILS).find(details => details.heroKey === heroKey)
    const enemyMove = Object.entries(MOVE_DETAILS).find(([_key, details]) => details.enemyKey === enemyKey)[0] as Move
    return moveDetails.points + BONUS_POINTS[moveDetails.outcomes[enemyMove]]
}

export const runDay2 = async () => {
    let totalScore = 0
    const handleLine = line => {
        const [enemyKey, heroKey]: [EnemyKey, HeroKey] = line.split(' ')
        totalScore += computeScore(heroKey, enemyKey)
    }

    await processInput({
        fileLocation: 'input.txt',
        handleLine,
    })

    console.log({
        part1: totalScore,
        // part2: sumArray(someArray),
    })
}
