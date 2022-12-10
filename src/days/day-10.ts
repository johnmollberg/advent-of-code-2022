import {processBashInput, runCommands} from "../utils/bash";
import {initializeArray, sumArray} from "../utils/array-utils";

const cyclesOfInterest = [20, 60, 100, 140, 180, 220]

const crtWidth = 40
const crtHeight = 6

export const runDay10 = async () => {
    const commands = processBashInput('input.txt', false)

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
                registers: { X },
            } = state

            // part 1
            if (currentCycle === cyclesOfInterest[0] - 1) {
                xValues.push(X * cyclesOfInterest[0])
                cyclesOfInterest.splice(0, 1)
            }

            // part 2
            const row = Math.floor(currentCycle / crtWidth)
            const column = currentCycle % crtWidth
            if ([X - 1, X, X + 1].includes(column)) {
                crt[row][column] = '▓'
            }
        }
    })
    const part1 = sumArray(xValues)
    console.log({ part1 })

    console.log('part 2:')
    crt.forEach(row => console.log(`${row.join('')}`))
}

