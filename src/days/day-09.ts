import {getAllInputLines} from '../utils/io-utils'
import {initializeArray} from '../utils/array-utils'

type Instruction = {
    direction: 'L' | 'R' | 'U' | 'D'
    distance: number
}

type Knot = {
    x: number
    y: number
}

const getNewTailPosition = (
    {
        x: headX,
        y: headY,
    }: Knot,
    {
        x: tailX,
        y: tailY,
    }: Knot): Knot => {
    const [
        deltaX,
        deltaY,
    ] = (
        Math.abs(headX - tailX) <= 1 &&
        Math.abs(headY - tailY) <= 1
    ) ?
        [0, 0] :
        [Math.sign(headX - tailX), Math.sign(headY - tailY)]
    return {
        x: tailX + deltaX,
        y: tailY + deltaY,
    }
}

const getNewHeadPosition = (
    {x, y}: Knot,
    direction: Instruction['direction']
): Knot => {
    switch (direction) {
        case 'L': {
            return {
                x: x - 1,
                y,
            }
        }
        case 'R': {
            return {
                x: x + 1,
                y,
            }
        }
        case 'U': {
            return {
                x,
                y: y - 1,
            }
        }
        case 'D': {
            return {
                x,
                y: y + 1,
            }
        }
        default: {
            throw new Error(`unexpected direction: ${direction}`)
        }
    }
}

const processInstructions = (instructions: Instruction[], ropeLength: number) => {
    const coordinatesVisited = new Set<string>()
    const knots = initializeArray<Knot>({
        length: ropeLength,
        defaultValue: {
            x: 0,
            y: 0,
        }
    })
    instructions.forEach(({
                              direction,
                              distance,
                          }) => {
        for (let i = 0; i < distance; i++) {
            // move head
            knots.fill(
                getNewHeadPosition(knots[0],
                    direction),
                0,
                1,
            )
            // move all tails
            knots.slice(1).forEach((knot, knotIndex) =>
                knots.fill(
                    getNewTailPosition(knots[knotIndex], knot),
                    knotIndex + 1,
                    knotIndex + 2,
                )
            )
            const lastKnot = knots[knots.length - 1]
            coordinatesVisited.add(`${lastKnot.x},${lastKnot.y}`)
        }
    })
    return coordinatesVisited.size
}

export const runDay9 = async () => {
    const instructions: Instruction[] = getAllInputLines({fileLocation: 'input.txt'})
        .map(line => {
            const [direction, distanceStr] = line.split(' ')
            return {
                direction: direction as 'R' | 'L' | 'U' | 'D',
                distance: parseInt(distanceStr),
            }
        })

    const part1 = processInstructions(instructions, 2)
    const part2 = processInstructions(instructions, 10)

    console.log({
        part1,
        part2,
    })
}
