import {processInput} from '../utils/io-utils'
import {transpose2dArray} from '../utils/array-utils'

const moveRegex = /move (\d+) from (\d+) to (\d+)/

export const runDay5 = async () => {
    let initialStateStrings: string[] = []
    let processedBoardState: string[][] = []

    const resetState = () => {
        initialStateStrings = []
        processedBoardState = []
    }

    const handleLine = (line: string, reverseMovedItems: boolean) => {
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
        const itemsToMove = fromContainer
            .splice(fromContainer.length - quantity, quantity)
        if (reverseMovedItems) {
            itemsToMove.reverse()
        }
        toContainer.push(
            ...itemsToMove
        )
    }

    const getAnswer = () => processedBoardState.map(container => container[container.length - 1]).join('')

    await processInput({
        fileLocation: 'input.txt',
        handleLine: line => handleLine(line, true),
    })

    const part1 = getAnswer()
    resetState()

    await processInput({
        fileLocation: 'input.txt',
        handleLine: line => handleLine(line, false),
    })

    const part2 = getAnswer()

    console.log({
        part1,
        part2,
    })
}
