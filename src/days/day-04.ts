import {processInput} from '../utils/io-utils'

const extractElfAssignment = (assignment: string): [number, number] => {
    const [startStr, endStr] = assignment.split('-')
    return [
        parseInt(startStr),
        parseInt(endStr),
    ]
}

const getDoesFirstElfContainSecondElf = (firstElfAssignment: [number, number], secondElfAssignment: [number, number]): boolean => {
    const [firstElfStart, firstElfEnd] = firstElfAssignment
    const [secondElfStart, secondElfEnd] = secondElfAssignment
    return firstElfStart <= secondElfStart &&
        firstElfEnd >= secondElfEnd;
}

const getDoElvesOverlapAtAll = (firstElfAssignment: [number, number], secondElfAssignment: [number, number]): boolean => {
    const [firstElfStart, firstElfEnd] = firstElfAssignment
    const [secondElfStart, secondElfEnd] = secondElfAssignment
    const maxStart = Math.max(firstElfStart, secondElfStart)
    const minEnd = Math.min(firstElfEnd, secondElfEnd)

    return minEnd >= maxStart
}

export const runDay4 = async () => {
    let numberOfCoveredAssignments = 0
    let numberOfOverlappingAssignmentPairs = 0
    await processInput({
        fileLocation: 'input.txt',
        handleLine: (line) => {
            const [firstElf, secondElf] = line.split(',')
            const firstElfAssignment = extractElfAssignment(firstElf)
            const secondElfAssignment = extractElfAssignment(secondElf)

            if (
                getDoesFirstElfContainSecondElf(firstElfAssignment, secondElfAssignment) ||
                getDoesFirstElfContainSecondElf(secondElfAssignment, firstElfAssignment)
            ) {
                numberOfCoveredAssignments += 1
            }
            if (getDoElvesOverlapAtAll(firstElfAssignment, secondElfAssignment)) {
                numberOfOverlappingAssignmentPairs += 1
            }
        }
    })

    console.log({
        part1: numberOfCoveredAssignments,
        part2: numberOfOverlappingAssignmentPairs,
    })
}
