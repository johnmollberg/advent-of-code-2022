import {processInput} from '../utils/io-utils'

type Move = 'rock' | 'paper' | 'scissors'
type EnemyKey = 'A' | 'B' | 'C'
type HeroKey = 'X' | 'Y' | 'Z'
type DesiredOutcomeKey = HeroKey
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
}

type BonusPointsDetails = {
    points: number
    outcomeKey: DesiredOutcomeKey
}

const BONUS_POINTS: Record<Outcome, BonusPointsDetails> = {
    loss: {
        points: 0,
        outcomeKey: 'X',
    },
    draw: {
        points: 3,
        outcomeKey: 'Y',
    },
    win: {
        points: 6,
        outcomeKey: 'Z',
    },
}

const computeScorePart1 = (heroKey: HeroKey, enemyKey: EnemyKey): number => {
    const moveDetails = Object.values(MOVE_DETAILS).find(details => details.heroKey === heroKey)
    const enemyMove = Object.entries(MOVE_DETAILS).find(([_key, details]) => details.enemyKey === enemyKey)[0] as Move
    return moveDetails.points + BONUS_POINTS[moveDetails.outcomes[enemyMove]].points
}

const computeScorePart2 = (enemyKey: EnemyKey, desiredOutcomeKey: DesiredOutcomeKey): number => {
    const desiredOutcome = Object.entries(BONUS_POINTS).find(([_key, details]) => details.outcomeKey === desiredOutcomeKey)[0] as Outcome
    const enemyMove = Object.entries(MOVE_DETAILS).find(([_key, details]) => details.enemyKey === enemyKey)[0] as Move
    const pointsForCorrectMove = Object.values(MOVE_DETAILS).find(details => details.outcomes[enemyMove] === desiredOutcome).points
    return pointsForCorrectMove + BONUS_POINTS[desiredOutcome].points
}

export const runDay2 = async () => {
    let totalScorePart1 = 0
    let totalScorePart2 = 0
    const handleLine = line => {
        const [enemyKey, heroKey]: [EnemyKey, HeroKey] = line.split(' ')
        totalScorePart1 += computeScorePart1(heroKey, enemyKey)
        totalScorePart2 += computeScorePart2(enemyKey, heroKey)
    }

    await processInput({
        fileLocation: 'input.txt',
        handleLine,
    })

    console.log({
        part1: totalScorePart1,
        part2: totalScorePart2,
    })
}
