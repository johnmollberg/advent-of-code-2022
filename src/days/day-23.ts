import {processInput} from '../utils/io-utils'
import {initializeArray, sumArray} from '../utils/array-utils'

export const runDay23 = async () => {
    let someArray = initializeArray({
        length: 3,
        defaultValue: 0,
    })

    await processInput({
        fileLocation: 'input.txt',
        handleLine: (line) => {
            console.log(`line: ${line}`)
        }
    })

    console.log({
        part1: Math.max(...someArray),
        part2: sumArray(someArray),
    })
}
