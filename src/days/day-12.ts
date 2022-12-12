import {getAllInputLines} from '../utils/io-utils'

type Tile = {
    elevation: number
    stepsToTarget: number
    isStartingPoint: boolean
    isTarget: boolean
}

export const runDay12 = async () => {
    const map: Tile[][] = getAllInputLines({
        fileLocation: 'input.txt',
    }).map(line => line.split('').map(char => {
        if (char === 'S') {
            return {
                elevation: 0,
                stepsToTarget: Number.MAX_SAFE_INTEGER,
                isStartingPoint: true,
                isTarget: false,
            }
        }
        if (char === 'E') {
            return {
                elevation: 25,
                stepsToTarget: 0,
                isStartingPoint: false,
                isTarget: true,
            }
        }
        return ({
            elevation: char.charCodeAt(0) - 97,
            stepsToTarget: Number.MAX_SAFE_INTEGER,
            isStartingPoint: false,
            isTarget: false,
        });
    }))

    const startingTile = map.flat().find(tile => tile.isStartingPoint)

    while (startingTile.stepsToTarget === Number.MAX_SAFE_INTEGER) {
        for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
            const row = map[rowIndex]
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const currentTile = row[colIndex]
                if (currentTile.stepsToTarget !== Number.MAX_SAFE_INTEGER) {
                    continue
                }
                const neighboringTiles = [
                    row[colIndex - 1],
                    row[colIndex + 1],
                    (map[rowIndex - 1] || [])[colIndex],
                    (map[rowIndex + 1] || [])[colIndex],
                ].filter(Boolean)
                    .filter(tile => Math.abs(tile.elevation - currentTile.elevation) <= 1)
                const min = Math.min(...neighboringTiles.map(tile => tile.stepsToTarget))
                if (min < Number.MAX_SAFE_INTEGER) {
                    currentTile.stepsToTarget = min + 1
                }
            }
        }
    }



    console.log({
        part1: startingTile.stepsToTarget,
        // part2: sumArray(someArray),
    })
}
