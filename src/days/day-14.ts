import {getAllInputLines} from '../utils/io-utils'
import {initializeArray, transpose2dMatrix} from "../utils/array-utils";

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

const getInitializedMap = (rockCoordinates: number[][][], isPart2: boolean) => {
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

    if (isPart2) {
        const extraSize = 300
        return [
            ...transpose2dMatrix([
                ...initializeArray({
                    length: extraSize,
                    defaultValue: initializeArray({
                        length: map.length,
                        defaultValue: '.',
                    }),
                }),
                ...transpose2dMatrix(map),
                ...initializeArray({
                    length: extraSize,
                    defaultValue: initializeArray({
                        length: map.length,
                        defaultValue: '.',
                    }),
                }),
            ]),
            initializeArray({
                length: extraSize + map.length + extraSize,
                defaultValue: '.',
            }),
            initializeArray({
                length: extraSize + map.length + extraSize,
                defaultValue: '#',
            }),
        ]
    }

    return map
}

const getXshift = (map: string[][], currentSandX: number, currentSandY: number): -1 | 0 | 1 | undefined => {
    if (map[currentSandY + 1][currentSandX] === '.') {
        return 0
    }
    if (currentSandX - 1 < 0 || map[currentSandY + 1][currentSandX - 1] === '.') {
        return -1
    }
    if (currentSandX + 1 >= map[0].length || map[currentSandY + 1][currentSandX + 1] === '.') {
        return 1
    }
    return undefined
}

const dropSand = (map: string[][]): boolean => {
    let currentSandX = map[0].indexOf('+')
    let currentSandY = 0

    const prevMap = JSON.stringify(map)

    let xShift = getXshift(map, currentSandX, currentSandY)
    while (typeof xShift !== 'undefined') {
        currentSandY++
        currentSandX += xShift
        if (
            currentSandX < 0 ||
            currentSandX > map[0].length ||
            currentSandY + 1 > map.length - 1
        ) {
            return true
        }
        xShift = getXshift(map, currentSandX, currentSandY)
    }
    map[currentSandY][currentSandX] = 'o'
    return prevMap === JSON.stringify(map)

}

const getResult = (isPart2: boolean) => {
    const rockCoordinates = getAllInputLines({
        fileLocation: 'input.txt',
    }).map(line => line.split('->').map(instruction => instruction.trim().split(',').map(coord => parseInt(coord))))

    const map = getInitializedMap(rockCoordinates, isPart2)

    let isDone = false
    let result = 0
    while (!isDone) {
        isDone = dropSand(map)
        result++
    }
    result--

    for (const row of map) {
        console.log(row.join(''))
    }
    return result
}

export const runDay14 = async () => {
    console.log({
        part1: getResult(false),
        part2: getResult(true),
    })
}
