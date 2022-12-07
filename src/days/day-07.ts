import {getAllInputLines} from '../utils/io-utils'
import {sumArray} from '../utils/array-utils'

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
        } else {
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

    commands.forEach(command => {
        if (command.command === 'ls') {
            command.output.forEach(command => {
                const [dirOrMem, name] = command.split(' ')
                if (dirOrMem === 'dir') {
                    if (!currentDir.subdirectories.some(subdirectory => subdirectory.name === name)) {
                        currentDir.subdirectories.push({
                            name,
                            subdirectories: [],
                            files: [],
                            parentDir: currentDir,
                        })
                    }
                } else { // file
                    if (!currentDir.files.some(file => file.name === name)) {
                        currentDir.files.push({
                            name,
                            memory: parseInt(dirOrMem),
                        })
                    }
                }
            })
        } else { // cd
            const newDir = command.params
            if (newDir === '..') {
                currentDir = currentDir.parentDir
            } else {
                if (!currentDir.subdirectories.some(subdirectory => subdirectory.name === newDir)) {
                    currentDir.subdirectories.push({
                        name: newDir,
                        subdirectories: [],
                        files: [],
                        parentDir: currentDir,
                    })
                }
                currentDir = currentDir.subdirectories.find(subdirectory => subdirectory.name === newDir)
            }
        }
    })

    printDirs(rootDir, '')

    console.log(`all dirs: ${
        getAllDirSizes(rootDir)
            .filter(size => size <= 100000)
            .reduce((acc, curr) => acc + curr, 0)
    }`)

    // console.log({
    //     part1: Math.max(...someArray),
    //     part2: sumArray(someArray),
    // })
}

const getAllDirSizes = (rootDir: Directory): number[] => {
    return [
        getDirSize(rootDir),
        ...rootDir.subdirectories.flatMap(getAllDirSizes)
    ]
}

const printDirs = (rootDir: Directory, prefix: string) => {
    console.log(`${prefix}- ${rootDir.name} (dir, size=${getDirSize(rootDir)})`)
    rootDir.subdirectories.forEach(dir => printDirs(dir, `${prefix}  `))
    rootDir.files.forEach(file => console.log(`${prefix}  - ${file.name} (file, size=${file.memory})`))
}

const getDirSize = (rootDir: Directory): number => {
    const filesSize = rootDir.files.reduce((acc, curr) => acc + curr.memory, 0)
    const subdirectoriesSize = rootDir.subdirectories.reduce((acc, curr) => acc + getDirSize(curr), 0)
    return filesSize + subdirectoriesSize
}
