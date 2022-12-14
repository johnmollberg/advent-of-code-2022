import {getAllInputLines} from '../utils/io-utils'
import {initializeArray} from "../utils/array-utils";

const sandHoleY = 0
const sandHoleX = 500

const getMinsAndMaxes = (rockCoordinates: number[][][]) => {
    const flattenedCoords = rockCoordinates.flat()
    let minX = Math.min(...flattenedCoords.map(coord => coord[0]), sandHoleX)
    let maxX = Math.max(...flattenedCoords.map(coord => coord[0]), sandHoleX)
    let minY = Math.min(...flattenedCoords.map(coord => coord[1]), sandHoleY)
    let maxY = Math.max(...flattenedCoords.map(coord => coord[1]), sandHoleY)
    return {
        minX,
        maxX,
        minY,
        maxY,
    }
}

const getInitializedMap = (rockCoordinates: number[][][]) => {
    const {
        minX,
        maxX,
        minY,
        maxY,
    } = getMinsAndMaxes(rockCoordinates)

    const map = initializeArray({
        length: maxY - minY + 1,
        defaultValue: initializeArray({
            length: maxX - minX + 1,
            defaultValue: '.',
        }),
    })

    map[sandHoleY - minY][sandHoleX - minX] = '+'

    rockCoordinates.forEach((line) => {
        line.forEach((coord, coordIndex) => {
            const nextCoord = line[coordIndex + 1]
            if (!nextCoord) {
                return
            }
            const [startX, startY] = coord
            const [endX, endY] = nextCoord
            if (startX === endX) {
                if (endY > startY) {
                    for (let i = 0; i < endY - startY + 1; i++) {
                        map[startY - minY + i][startX - minX] = '#'
                    }
                } else {
                    for (let i = 0; i < startY - endY + 1; i++) {
                        map[startY - minY - i][startX - minX] = '#'
                    }
                }
            } else {
                if (endX > startX) {
                    for (let i = 0; i < endX - startX + 1; i++) {
                        map[startY - minY][startX - minX + i] = '#'
                    }
                } else {
                    for (let i = 0; i < startX - endX + 1; i++) {
                        map[startY - minY][startX - minX - i] = '#'
                    }
                }
            }
        })
    })

    return map
}

const getXshift = (map: string[][], currentSandX: number, currentSandY: number): -1 | 0 | 1 | undefined => {
    if (map[currentSandY + 1][currentSandX] === '.') {
        return 0
    }
    if (['.', undefined].includes(map[currentSandY + 1][currentSandX - 1])) {
        return -1
    }
    if (['.', undefined].includes(map[currentSandY + 1][currentSandX + 1])) {
        return 1
    }
    return undefined
}

const dropSand = (map: string[][]): boolean => {
    let currentSandX = map[0].indexOf('+')
    let currentSandY = 1

    let xShift = getXshift(map, currentSandX, currentSandY)
    while (typeof xShift !== 'undefined') {
        currentSandY++
        currentSandX += xShift
        try {
            xShift = getXshift(map, currentSandX, currentSandY)
        } catch (e) {
            return true
        }
    }
    map[currentSandY][currentSandX] = 'o'
    return false
}

export const runDay14 = async () => {
    const rockCoordinates = getAllInputLines({
        fileLocation: 'input.txt',
    }).map(line => line.split('->').map(instruction => instruction.trim().split(',').map(coord => parseInt(coord))))

    const map = getInitializedMap(rockCoordinates)

    let isDone = false
    let part1 = 0
    while (!isDone) {
        isDone = dropSand(map)
        part1++
        console.log(`dropped ${part1} pieces\n`)
    }
    part1--

    for (const row of map) {
        console.log(row.join(''))
    }

    console.log({
        part1,
        // part2: sumArray(someArray),
    })
}
