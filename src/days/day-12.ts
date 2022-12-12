import {getAllInputLines} from '../utils/io-utils'

type Tile = {
    elevation: number
    stepsToTarget: number
    isStartingPoint: boolean
    rowIndex: number
    colIndex: number
    reachableNeighbors: Tile[]
}

const getStepsToTarget = (startRowIndex: number, startColIndex: number, map: Tile[][]) => {
    const startTile = map.flat().find(tile => startRowIndex === tile.rowIndex && startColIndex === tile.colIndex)

    let hash = map.flat().map(tile => tile.stepsToTarget).join()
    let prevHash = ''
    while (hash !== prevHash) {
        map.flat().forEach(tile => {
            const neighborSteps = tile.reachableNeighbors
                .map(neighbor => neighbor.stepsToTarget)
                .filter(distance => distance < Number.MAX_SAFE_INTEGER)
            if (neighborSteps.length) {
                tile.stepsToTarget = Math.min(Math.min(...neighborSteps) + 1, tile.stepsToTarget)
            }
        })
        prevHash = hash
        hash = map.flat().map(tile => tile.stepsToTarget).join()
    }
    return startTile.stepsToTarget
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
    const part1 = getStepsToTarget(startTile.rowIndex, startTile.colIndex, map)

    const allZeroElevationTiles = map.flat().filter(tile => tile.elevation === 0)
    let part2 = Math.min(...allZeroElevationTiles.map(tile => tile.stepsToTarget))

    console.log({
        part1,
        part2,
    })
}
