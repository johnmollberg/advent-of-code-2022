import {processInput} from '../utils/io-utils'
import {transpose2dMatrix} from '../utils/array-utils'

const moveRegex = /move (\d+) from (\d+) to (\d+)/

export const runDay5 = async () => {
    let initialStateStrings: string[] = []
    let boardState: string[][] = []

    const resetState = () => {
        initialStateStrings = []
        boardState = []
    }

    const loadInitialState = () => {
        boardState = transpose2dMatrix(initialStateStrings
            .reverse()
            .map(line =>
                line.match(/.{1,4}/g)
                    .map(crate => crate.charAt(1).trim() || undefined)
            )).map(stack => stack.filter(Boolean))
    }

    const processMove = (line: string, reverseMovedItems: boolean) => {
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
        const fromStack = boardState[from - 1]
        const toStack = boardState[to - 1]
        const itemsToMove = fromStack.splice(fromStack.length - quantity, quantity)
        if (reverseMovedItems) {
            itemsToMove.reverse()
        }
        toStack.push(...itemsToMove)
    }

    const handleLine = (line: string, reverseMovedItems: boolean) => {
        if (!line) {
            return
        }
        if (line.startsWith(' 1')) {
            loadInitialState()
            return
        }
        if (!boardState.length) {
            initialStateStrings.push(line)
            return
        }
        processMove(line, reverseMovedItems)
    }

    const getAnswer = () => boardState.map(container => container[container.length - 1]).join('')

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
