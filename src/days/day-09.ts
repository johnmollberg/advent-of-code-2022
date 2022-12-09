import {getAllInputLines} from '../utils/io-utils'
import {initializeArray, sumArray} from '../utils/array-utils'

const getDeltaForTail = (headState: KnotState, [tailX, tailY]: [number, number]): [number, number] => {
    const {
        prevX,
        prevY,
        currentX,
        currentY,
    } = headState
    if (
        Math.abs(currentX - tailX) <= 1 &&
        Math.abs(currentY - tailY) <= 1
    ) {
        return [0, 0]
    }
    if (tailX === currentX) {
        return [0, currentY - prevY]
    }
    if (tailY === currentY) {
        return [currentX - prevX, 0]
    }
    const deltaX = currentX > tailX ? 1 : -1
    const deltaY = currentY > tailY ? 1 : -1
    return [deltaX, deltaY]
}

type Instruction = {
    direction: 'L' | 'R' | 'U' | 'D'
    distance: number
}

type KnotState = {
    prevX: number
    prevY: number
    currentX: number
    currentY: number
}

const getNewHeadPosition = (
    [currentX, currentY]: [number, number],
    direction: Instruction['direction']
): [number, number] => {
    switch (direction) {
        case 'L': {
            return [currentX - 1, currentY]
        }
        case 'R': {
            return [currentX + 1, currentY]
        }
        case 'U': {
            return [currentX, currentY - 1]
        }
        case 'D': {
            return [currentX, currentY + 1]
        }
        default: {
            throw new Error('unexpected Direction')
        }
    }
}

const processInstructions = (instructions: Instruction[], ropeLength: number) => {
    const coordinatesVisited = new Set<string>()
    const knots = initializeArray<KnotState>({
        length: ropeLength,
        defaultValue: {
            prevX: 0,
            prevY: 0,
            currentX: 0,
            currentY: 0,
        }
    })
    instructions.forEach(({
                              direction,
                              distance,
                          }) => {
        for (let i = 0; i < distance; i++) {
            const {
                currentX,
                currentY,
            } = knots[0]
            const [newX, newY] = getNewHeadPosition([currentX, currentY], direction)
            knots[0].prevX = currentX
            knots[0].prevY = currentY
            knots[0].currentX = newX
            knots[0].currentY = newY
            knots.slice(1).forEach((knot, knotIndex) => {
                const {
                    currentX,
                    currentY,
                } = knot
                const [deltaX, deltaY] = getDeltaForTail(
                    knots[knotIndex],
                    [currentX, currentY],
                )
                knot.prevX = currentX
                knot.prevY = currentY
                knot.currentX = currentX + deltaX
                knot.currentY = currentY + deltaY
            })
            const lastKnot = knots[knots.length - 1]
            coordinatesVisited.add(`${lastKnot.currentX},${lastKnot.currentY}`)
        }
    })
    return coordinatesVisited.size
}

export const runDay9 = async () => {
    let someArray = initializeArray({
        length: 3,
        defaultValue: 0,
    })

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
