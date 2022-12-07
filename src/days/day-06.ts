import {getAllInputLines, processInput} from '../utils/io-utils'
import {doesArrayContainDuplicates, initializeArray, sumArray} from '../utils/array-utils'

export const runDay6 = async () => {
    const [inputString] = getAllInputLines({
        fileLocation: 'input.txt',
    })

    const computeAnswer = (numberOfUniqueCharactersNecessary: number): number => {
        const input = inputString.split('')
        const originalLength = input.length
        const currentCharactersOfInterest = input.splice(0, numberOfUniqueCharactersNecessary)
        while (input.length && doesArrayContainDuplicates(currentCharactersOfInterest)) {
            currentCharactersOfInterest.splice(0, 1)
            currentCharactersOfInterest.push(...input.splice(0, 1))
        }
        return originalLength - input.length
    }

    console.log({
        part1: computeAnswer(4),
        part2: computeAnswer(14),
    })
}
