import {getAllInputLines} from '../utils/io-utils'

type Tile = {
    elevation: number
    stepsToTarget: number
    isStartingPoint: boolean
    isTarget: boolean
    rowIndex: number
    colIndex: number
    reachableNeighbors: Tile[]
}

export const runDay12 = async () => {
    const map: Tile[][] = getAllInputLines({
        fileLocation: 'input.txt',
    }).map((line, rowIndex) => line
        .split('')
        .map((char, colIndex) => {
            if (char === 'S') {
                return {
                    elevation: 0,
                    stepsToTarget: Number.MAX_SAFE_INTEGER,
                    isStartingPoint: true,
                    isTarget: false,
                    rowIndex,
                    colIndex,
                    isVisited: false,
                    reachableNeighbors: [],
                    isMarked: false,
                }
            }
            if (char === 'E') {
                return {
                    elevation: 25,
                    stepsToTarget: 0,
                    isStartingPoint: false,
                    isTarget: true,
                    rowIndex,
                    colIndex,
                    isVisited: true,
                    reachableNeighbors: [],
                    isMarked: true,
                }
            }
            return ({
                elevation: char.charCodeAt(0) - 97,
                stepsToTarget: Number.MAX_SAFE_INTEGER,
                isStartingPoint: false,
                isTarget: false,
                rowIndex,
                colIndex,
                isVisited: false,
                reachableNeighbors: [],
                isMarked: false,
            });
        }))

    const getNeighboringTiles = (tile: Tile): Tile[] => {
        return [
            map[tile.rowIndex][tile.colIndex - 1],
            map[tile.rowIndex][tile.colIndex + 1],
            (map[tile.rowIndex - 1] || [])[tile.colIndex],
            (map[tile.rowIndex + 1] || [])[tile.colIndex],
        ].filter(Boolean)
            .filter(neighbor => [0, 1].includes(neighbor.elevation - tile.elevation) || tile.elevation > neighbor.elevation)
    }

    map
        .flat()
        .forEach(tile => tile.reachableNeighbors = getNeighboringTiles(tile))

    const startTile = map.flat().find(tile => tile.isStartingPoint)

    while (startTile.stepsToTarget === Number.MAX_SAFE_INTEGER) {
        map.flat().forEach(tile => {
            const neighborSteps = tile.reachableNeighbors
                .map(neighbor => neighbor.stepsToTarget)
                .filter(distance => distance < Number.MAX_SAFE_INTEGER)
            if (neighborSteps.length) {
                tile.stepsToTarget = Math.min(...neighborSteps) + 1
            }
        })
    }

    console.log({
        part1: startTile.stepsToTarget,
        // part2: sumArray(someArray),
    })
}
