import {processInput} from '../utils/io-utils'
import {initializeArray, removeItemFromArray, sumArray} from '../utils/array-utils'

export const runDay1 = async () => {
    let topThreeCaloricLoads = initializeArray({
        length: 3,
        defaultValue: 0,
    })

    let currentCaloricLoad = 0

    const resetCurrentElf = () => {
        currentCaloricLoad = 0
    }

    const evaluateCurrentElf = () => {
        const currentCaloricLoads = [
            ...topThreeCaloricLoads,
            currentCaloricLoad,
        ]
        const lowestSignificantCaloricLoad = Math.min(...currentCaloricLoads)
        topThreeCaloricLoads = removeItemFromArray(
            currentCaloricLoads,
            lowestSignificantCaloricLoad,
        )
    }

    const handleLine = (line) => {
        if (line) {
            currentCaloricLoad += parseInt(line)
        } else {
            evaluateCurrentElf()
            resetCurrentElf()
        }
    }

    await processInput({
        fileLocation: 'input.txt',
        handleLine,
    })

    if (currentCaloricLoad) {
        evaluateCurrentElf()
        resetCurrentElf()
    }

    console.log({
        part1: Math.max(...topThreeCaloricLoads),
        part2: sumArray(topThreeCaloricLoads),
    })
}
