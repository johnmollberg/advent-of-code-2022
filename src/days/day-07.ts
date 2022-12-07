import {sumArray} from "../utils/array-utils";
import {getAllDirSizes, processBashInput, runCommands} from "../utils/bash";

const totalSpace = 70000000
const desiredUnusedSpace = 30000000

export const runDay7 = async () => {
    const commands = processBashInput('input.txt')

    // delete top level directory and initialize manually
    commands.splice(0, 1)

    const rootDir = runCommands(commands, {
        name: '/',
        files: [],
        subdirectories: [],
    })

    const allDirSizes = getAllDirSizes(rootDir)

    const part1 = sumArray(allDirSizes.filter(size => size <= 100000))

    const rootDirSize = Math.max(...allDirSizes)

    const memoryGoal = -1 * (totalSpace - desiredUnusedSpace - rootDirSize)

    const part2 = Math.min(...allDirSizes.filter(x => x > memoryGoal))

    console.log({
        part1,
        part2,
    })
}

