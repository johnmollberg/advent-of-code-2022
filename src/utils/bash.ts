import {getAllInputLines} from "./io-utils";
import {sumArray} from "./array-utils";
import {cloneDeep} from "lodash";

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

type ComputerState = {
    rootDirectory: Directory
    currentDirectory: Directory
    registers: Record<'X', number>
    currentCycle: number
}

export type Command = {
    command: 'cd' | 'ls' | 'noop' | 'addx'
    params: string[]
    output: string[]
}

export const processBashInput = (fileLocation: string, requireDollarSignForParams: boolean = true): Command[] => {
    const inputLines = getAllInputLines({
        fileLocation,
    })

    let commands: Command[] = []

    for (const inputLine of inputLines) {
        if (!requireDollarSignForParams) {
            const [command, ...params] = inputLine.split(' ')
            commands.push({
                command: command as Command['command'],
                params,
                output: [],
            })
        } else if (inputLine.startsWith('$')) {
            const [_, command, ...params] = inputLine.split(' ')
            commands.push({
                command: command as Command['command'],
                params,
                output: [],
            })
        } else if (inputLine.length) {
            commands[commands.length - 1].output.push(inputLine)
        }
    }

    return commands
}


const addDirIfNotExists = (name: string, currentDir: Directory) => {
    if (!currentDir.subdirectories.some(subdirectory => subdirectory.name === name)) {
        currentDir.subdirectories.push({
            name,
            subdirectories: [],
            files: [],
            parentDir: currentDir,
        })
    }
}

export const processLs = (command: Command, computerState: ComputerState) => {
    command.output.forEach(command => {
        const [dirOrMem, name] = command.split(' ')
        if (dirOrMem === 'dir') {
            addDirIfNotExists(name, computerState.currentDirectory)
        } else { // file
            if (!computerState.currentDirectory.files.some(file => file.name === name)) {
                computerState.currentDirectory.files.push({
                    name,
                    memory: parseInt(dirOrMem),
                })
            }
        }
    })
}

export const processCd = (command: Command, computerState: ComputerState) => {
    const target = command.params[0]
    if (target === '..') {
        computerState.currentDirectory = computerState.currentDirectory.parentDir
    } else if (target === '/') {
        computerState.currentDirectory = computerState.rootDirectory
    } else {
        addDirIfNotExists(target, computerState.currentDirectory)
        computerState.currentDirectory = computerState.currentDirectory.subdirectories.find(subdirectory => subdirectory.name === target)
    }
}

export const getInitialComputerState = (): ComputerState => {
    const rootDirectory: Directory = {
        name: '/',
        files: [],
        subdirectories: [],
    }
    return {
        rootDirectory,
        currentDirectory: rootDirectory,
        registers: {
            X: 1,
        },
        currentCycle: 0,
    }
}

const processNoop = (computerState: ComputerState) => {
    computerState.currentCycle += 1
}

const processAddX = (command: Command, computerState: ComputerState) => {
    computerState.registers.X += parseInt(command.params[0])
    computerState.currentCycle += 2
}

type RunCommandsOptions = Partial<{
    initialState: ComputerState
    onCompleteCommand: (state: ComputerState) => void
}>

export const runCommands = (commands: Command[], options?: RunCommandsOptions): ComputerState => {
    const {
        onCompleteCommand = () => {},
        initialState = getInitialComputerState(),
    } = options || {}
    let computerState = cloneDeep(initialState)
    commands.forEach(command => {
        switch (command.command) {
            case 'ls': {
                processLs(command, computerState)
                break
            }
            case 'cd': {
                processCd(command, computerState)
                break
            }
            case 'noop': {
                processNoop(computerState)
                break
            }
            case 'addx': {
                processAddX(command, computerState)
                break
            }
            default: {
                throw new Error(`Command ${command.command} not implemented`)
            }
        }
        onCompleteCommand(computerState)
    })

    return computerState
}

export const getAllDirSizes = (rootDir: Directory): number[] => {
    return [
        getDirSize(rootDir),
        ...rootDir.subdirectories.flatMap(getAllDirSizes)
    ]
}

export const printDirs = (rootDir: Directory, prefix: string = '') => {
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