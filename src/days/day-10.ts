import {getInitialComputerState, processBashInput, runCommands} from "../utils/bash";
import {sumArray} from "../utils/array-utils";

export const runDay10 = async () => {
    const commands = processBashInput('input.txt', false)

    let prevX = 1
    const cyclesOfInterest = [20, 60, 100, 140, 180, 220]
    const xValues: number[] = []
    runCommands(commands, {
        onCompleteCommand: state => {
            if (state.currentCycle >= cyclesOfInterest[0]) {
                xValues.push(prevX * cyclesOfInterest[0])
                cyclesOfInterest.splice(0, 1)
            }
            prevX = state.registers.X
        },
    })

    console.log({
        part1: sumArray(xValues),
        // part2,
    })
}

