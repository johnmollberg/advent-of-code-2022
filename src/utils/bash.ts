import {getAllInputLines} from "./io-utils";
import {sumArray} from "./array-utils";

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

export type Command = {
    command: 'cd' | 'ls'
    params?: string
    output: string[]
}

export const processBashInput = (fileLocation: string): Command[] => {
    const inputLines = getAllInputLines({
        fileLocation,
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

export const processLs = (command: Command, currentDir: Directory) => {
    command.output.forEach(command => {
        const [dirOrMem, name] = command.split(' ')
        if (dirOrMem === 'dir') {
            addDirIfNotExists(name, currentDir)
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

export const getDirAfterCd = (command: Command, currentDir: Directory): Directory => {
    const target = command.params
    if (target === '..') {
        return currentDir.parentDir
    } else {
        addDirIfNotExists(target, currentDir)
        return currentDir.subdirectories.find(subdirectory => subdirectory.name === target)
    }
}

export const runCommands = (commands: Command[], initialState: Directory): Directory => {
    let currentDir = initialState
    commands.forEach(command => {
        switch (command.command) {
            case 'ls': {
                processLs(command, currentDir)
                break
            }
            case 'cd': {
                currentDir = getDirAfterCd(command, currentDir)
                break
            }
            default: {
                throw new Error(`Command ${command.command} not implemented`)
            }
        }
    })

    return initialState
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