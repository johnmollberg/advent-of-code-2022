import {processInput} from '../utils/io-utils'
import {initializeArray, sumArray, transpose2dArray} from '../utils/array-utils'

const moveRegex = /move (\d+) from (\d+) to (\d+)/

export const runDay5 = async () => {
    let someArray = initializeArray({
        length: 3,
        defaultValue: 0,
    })

    let initialStateStrings: string[] = []
    let processedBoardState: string[][] = []

    await processInput({
        fileLocation: 'input.txt',
        handleLine: (line) => {
            if (!line) {
                return
            }
            if (line.startsWith(' 1')) {
                processedBoardState = transpose2dArray(initialStateStrings
                    .reverse()
                    .map(line =>
                        line.match(/.{1,4}/g)
                            .map(crate => crate.charAt(1).trim() || undefined)
                    )).map(container => container.filter(Boolean))
                return
            }
            if (!processedBoardState.length) {
                initialStateStrings.push(line)
                return
            }
            const regexResult = line.match(moveRegex)
            if (!regexResult) {
                return
            }
            const [
                _match,
                quantityStr,
                fromStr,
                toStr,
            ] = regexResult
            const quantity = parseInt(quantityStr)
            const from = parseInt(fromStr)
            const to = parseInt(toStr)
            const fromContainer = processedBoardState[from - 1]
            const toContainer = processedBoardState[to - 1]
            toContainer.push(
                ...fromContainer
                    .splice(fromContainer.length - quantity, quantity)
                    .reverse()
            )

        }
    })

    console.log({
        part1: processedBoardState.map(container => container[container.length - 1]).join(''),
        part2: sumArray(someArray),
    })
}
