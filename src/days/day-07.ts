import {getAllInputLines} from '../utils/io-utils'
import {sumArray} from "../utils/array-utils";

const totalSpace = 70000000
const desiredUnusedSpace = 30000000

type Command = {
    command: 'cd' | 'ls'
    params?: string
    output: string[]
}

type AocFile = {
    name: string
    memory: number
}

type Directory = {
    name: string
    files: AocFile[]
    subdirectories: Directory[]
    parentDir?: Directory
}

export const runDay7 = async () => {
    const inputLines = getAllInputLines({
        fileLocation: 'input.txt',
    })

    let commands: Command[] = []

    for (const inputLine of inputLines) {
        if (inputLine.startsWith('$')) {
            const [_, command, params] = inputLine.split(' ')
            commands.push({
                command: command as Command['command'],
                params,
                output: [],
            })
        } else if (inputLine.length) {
            commands[commands.length - 1].output.push(inputLine)
        }
    }

    // delete top level directory and initialize manually
    commands.splice(0, 1)
    const rootDir: Directory = {
        name: '/',
        files: [],
        subdirectories: [],
    }

    let currentDir: Directory = rootDir

    const addDirIfNotExists = (name: string) => {
        if (!currentDir.subdirectories.some(subdirectory => subdirectory.name === name)) {
            currentDir.subdirectories.push({
                name,
                subdirectories: [],
                files: [],
                parentDir: currentDir,
            })
        }
    }

    const processLs = (command: Command) => {
        command.output.forEach(command => {
            const [dirOrMem, name] = command.split(' ')
            if (dirOrMem === 'dir') {
                addDirIfNotExists(name)
            } else { // file
                if (!currentDir.files.some(file => file.name === name)) {
                    currentDir.files.push({
                        name,
                        memory: parseInt(dirOrMem),
                    })
                }
            }
        })
    }

    const processCd = (command: Command) => {
        const target = command.params
        if (target === '..') {
            currentDir = currentDir.parentDir
        } else {
            addDirIfNotExists(target)
            currentDir = currentDir.subdirectories.find(subdirectory => subdirectory.name === target)
        }
    }

    commands.forEach(command => {
        if (command.command === 'ls') {
            processLs(command)
        } else { // cd
            processCd(command)
        }
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

const getAllDirSizes = (rootDir: Directory): number[] => {
    return [
        getDirSize(rootDir),
        ...rootDir.subdirectories.flatMap(getAllDirSizes)
    ]
}

const printDirs = (rootDir: Directory, prefix: string = '') => {
    console.log(`${prefix}- ${rootDir.name} (dir, size=${getDirSize(rootDir)})`)
    const childPrefix = `${prefix}  `
    rootDir.subdirectories.forEach(dir => printDirs(dir, childPrefix))
    rootDir.files.forEach(file => console.log(`${childPrefix}- ${file.name} (file, size=${file.memory})`))
}

const getDirSize = (rootDir: Directory): number => {
    const filesSize = sumArray(rootDir.files.map(file => file.memory))
    const subdirectoriesSize = sumArray(rootDir.subdirectories.map(getDirSize))
    return filesSize + subdirectoriesSize
}
