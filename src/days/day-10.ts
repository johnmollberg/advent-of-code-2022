import {processBashInput, runCommands} from "../utils/bash";
import {initializeArray, sumArray} from "../utils/array-utils";

export const runDay10 = async () => {
    const commands = processBashInput('input.txt', false)

    let prevX = 1
    const cyclesOfInterest = [20, 60, 100, 140, 180, 220]
    const xValues: number[] = []
    const crtWidth = 40
    const crtHeight = 6
    const crt = initializeArray({
        length: crtHeight,
        defaultValue: initializeArray({
            length: crtWidth,
            defaultValue: ' ',
        }),
    })
    runCommands(commands, {
        onCompleteCommand: state => {
            // part 1
            if (state.currentCycle >= cyclesOfInterest[0]) {
                xValues.push(prevX * cyclesOfInterest[0])
                cyclesOfInterest.splice(0, 1)
            }

            prevX = state.registers.X
        },
        onCycle: (state) => {
            // part 2
            const row = Math.floor(state.currentCycle / crtWidth)
            const column = state.currentCycle % crtWidth
            console.log({ row, column, prevX })
            if ([prevX - 1, prevX, prevX + 1].includes(column)) {
                crt[row][column] = '#'
            }
        }
    })
    const part1 = sumArray(xValues)
    /**
     * ##..##..##..##..##..##..##..##..##..##..
     * ###...###...###...###...###...###...###.
     * ####....####....####....####....####....
     * #####.....#####.....#####.....#####.....
     * ######......######......######......####
     * #######.......#######.......#######.....
     */
    crt.forEach(row => console.log(`${row.join('')}`))

    console.log({
        part1,
        // part2,
    })
}

