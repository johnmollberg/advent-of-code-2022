import {processInput} from '../utils/io-utils'
import {initializeArray, sumArray} from '../utils/array-utils'

const computeRange = (assignment: string): [number, number] => {
    const [startStr, endStr] = assignment.split('-')
    return [
        parseInt(startStr),
        parseInt(endStr),
    ]
}

const getDoesFirstElfContainSecondElf = (firstElfAssignment: [number, number], secondElfAssignment: [number, number]) => {
    const [firstElfStart, firstElfEnd] = firstElfAssignment
    const [secondElfStart, secondElfEnd] = secondElfAssignment
    return firstElfStart <= secondElfStart &&
        firstElfEnd >= secondElfEnd;
}

export const runDay4 = async () => {
    let someArray = initializeArray({
        length: 3,
        defaultValue: 0,
    })

    let numberOfCoveredAssignments = 0
    await processInput({
        fileLocation: 'input.txt',
        handleLine: (line) => {
            const [firstElf, secondElf] = line.split(',')
            const firstElfAssignment = computeRange(firstElf)
            const secondElfAssignment = computeRange(secondElf)

            const doesFirstElfContainSecondElf = getDoesFirstElfContainSecondElf(firstElfAssignment, secondElfAssignment)
            const doesSecondElfContainFirstElf = getDoesFirstElfContainSecondElf(secondElfAssignment, firstElfAssignment)
            if (doesFirstElfContainSecondElf || doesSecondElfContainFirstElf) {
                numberOfCoveredAssignments += 1
            }
        }
    })

    console.log({
        part1: numberOfCoveredAssignments,
        part2: sumArray(someArray),
    })
}
