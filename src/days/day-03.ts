import {processInput} from '../utils/io-utils'
import {initializeArray, sumArray} from '../utils/array-utils'

const computePriority = (item: string): number => {
    const charCode = item.charCodeAt(0)
    const isUppercase = item < 'a'
    if (isUppercase) {
        return charCode - 38
    }
    return charCode - 96
}

const getCommonItemBetweenCompartments = (compartments: string[]): string => {
    return compartments[0].split('').find(item => compartments.slice(1).every(compartment => compartment.includes(item)))
}

export const runDay3 = async () => {
    let part1Sum = 0
    let part2Sum = 0

    let elfGroup = []
    const handleLine = (line: string) => {
        const firstCompartment = line.slice(0, line.length / 2)
        const secondCompartment = line.slice(line.length / 2)
        part1Sum += computePriority(getCommonItemBetweenCompartments([
            firstCompartment,
            secondCompartment,
        ]))

        elfGroup.push(line)
        if (elfGroup.length === 3) {
            part2Sum += computePriority(getCommonItemBetweenCompartments(elfGroup))
            elfGroup = []
        }

    }

    await processInput({
        fileLocation: 'input.txt',
        handleLine,
    })

    console.log({
        part1: part1Sum,
        part2: part2Sum,
    })
}
