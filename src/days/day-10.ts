import {processBashInput, runCommands} from "../utils/bash";
import {initializeArray, sumArray} from "../utils/array-utils";

const crtWidth = 40
const crtHeight = 6

export const runDay10 = async () => {
    const commands = processBashInput('input.txt', true)

    const xValues: number[] = []

    const crt = initializeArray({
        length: crtHeight,
        defaultValue: initializeArray({
            length: crtWidth,
            defaultValue: ' ',
        }),
    })

    runCommands(commands, {
        onCycle: (state) => {
            const {
                currentCycle,
                registers: { x },
            } = state

            // part 1
            if ((currentCycle + 20) % 40 === 0) {
                xValues.push(x * currentCycle)
            }

            // part 2
            const row = Math.floor(currentCycle / crtWidth)
            const column = currentCycle % crtWidth
            if ([x - 1, x, x + 1].includes(column)) {
                crt[row][column] = '▓'
            }
        }
    })
    const part1 = sumArray(xValues)
    console.log({ part1 })

    console.log('part 2:')
    crt.forEach(row => console.log(`${row.join('')}`))
}

