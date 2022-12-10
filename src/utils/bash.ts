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
    registers: Record<'x', number>
    currentCycle: number
}

export type Command = {
    command: 'cd' | 'ls' | 'noop' | 'addx'
    params: string[]
    output: string[]
}

export const processBashInput = (fileLocation: string, considerAllLinesCommands: boolean = false): Command[] => {
    const inputLines = getAllInputLines({
        fileLocation,
    })

    let commands: Command[] = []

    for (const inputLine of inputLines) {
        if (!inputLine.length) {
            continue
        }
        if (
            inputLine.startsWith('$') ||
            considerAllLinesCommands
        ) {
            const [command, ...params] = inputLine.replace('$', '').split(' ').filter(Boolean)
            commands.push({
                command: command as Command['command'],
                params,
                output: [],
            })
        } else {
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
            x: 1,
        },
        currentCycle: 0,
    }
}

const processNoop = (computerState: ComputerState) => {

}

const processAddX = (command: Command, computerState: ComputerState) => {
    computerState.registers.x += parseInt(command.params[0])
}

type HandleCyclesOptions = Partial<{
    onCycle: (state: ComputerState) => void
}>

const cycleCountMap: Record<Command['command'], number> = {
    addx: 2,
    noop: 1,
    cd: 1,
    ls: 1,
}

const handlePreCalculationCycles = (command: Command, computerState: ComputerState, options: HandleCyclesOptions = {}) => {
    const {
        onCycle = () => {},
    } = options
    const numberOfCycles = cycleCountMap[command.command]
    for (let i = 0; i < numberOfCycles - 1; i++) {
        computerState.currentCycle++
        onCycle(computerState)
    }
}

type RunCommandsOptions = Partial<{
    initialState: ComputerState
    onCompleteCommand: (state: ComputerState) => void
    onCycle: HandleCyclesOptions['onCycle']
}>

export const runCommands = (commands: Command[], options: RunCommandsOptions = {}): ComputerState => {
    const {
        onCompleteCommand = () => {},
        initialState = getInitialComputerState(),
        onCycle = () => {}
    } = options
    let computerState = cloneDeep(initialState)
    onCycle(computerState)
    commands.forEach(command => {
        handlePreCalculationCycles(command, computerState, options)
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
        computerState.currentCycle++
        onCycle(computerState)
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