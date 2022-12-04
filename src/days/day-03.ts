import {processInput} from '../utils/io-utils'
import {initializeArray, sumArray} from '../utils/array-utils'

const computePriority = (item: string) => {
    const charCode = item.charCodeAt(0)
    const isUppercase = item < 'a'
    if (isUppercase) {
        return charCode - 38
    }
    return charCode - 96
}

export const runDay3 = async () => {
    let someArray = initializeArray({
        length: 3,
        defaultValue: 0,
    })

    let sum = 0

    const handleLine = (line: string) => {
        const firstCompartment = line.slice(0, line.length / 2)
        const secondCompartment = line.slice(line.length / 2)
        const commonItem = firstCompartment.split('').find(item => secondCompartment.includes(item))
        sum += computePriority(commonItem)

    }

    await processInput({
        fileLocation: 'input.txt',
        handleLine,
    })

    console.log({
        part1: sum,
        part2: sumArray(someArray),
    })
}
