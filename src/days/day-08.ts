import {getAllInputLines} from '../utils/io-utils'

const isTargetTreeTallerThanAllTreesInSlice = (targetTreeHeight: number, otherTreeHeights: number[]) =>
    otherTreeHeights.every(otherTreeHeight => targetTreeHeight > otherTreeHeight)

const getIsTreeVisibleFromAnyEdge = (forest: number[][], rowIndex: number, columnIndex: number): boolean => {
    const row = forest[rowIndex]
    const column = forest.map(x => x[columnIndex])
    const treeHeight = row[columnIndex]
    return isTargetTreeTallerThanAllTreesInSlice(treeHeight, row.slice(0, columnIndex)) || // left
        isTargetTreeTallerThanAllTreesInSlice(treeHeight, row.slice(columnIndex + 1, row.length)) || // right
        isTargetTreeTallerThanAllTreesInSlice(treeHeight, column.slice(0, rowIndex)) || // top
        isTargetTreeTallerThanAllTreesInSlice(treeHeight, column.slice(rowIndex + 1, forest.length)) // bottom
}

const getNumberOfVisibleTrees = (targetTreeHeight: number, otherTreeHeights: number[]): number =>
    otherTreeHeights.findIndex(height => height >= targetTreeHeight) + 1 ||
    otherTreeHeights.length

const computeScenicScore = (forest: number[][], rowIndex: number, columnIndex: number): number => {
    const row = forest[rowIndex]
    const treeHeight = row[columnIndex]
    return getNumberOfVisibleTrees(treeHeight, row.slice(0, columnIndex).reverse()) * // left
        getNumberOfVisibleTrees(treeHeight, row.slice(columnIndex + 1, row.length)) * // right
        getNumberOfVisibleTrees(treeHeight, forest.map(x => x[columnIndex]).slice(0, rowIndex).reverse()) * // top
        getNumberOfVisibleTrees(treeHeight, forest.map(x => x[columnIndex]).slice(rowIndex + 1, forest.length)) // bottom
}

export const runDay8 = async () => {
    const forest: number[][] = getAllInputLines({
        fileLocation: 'input.txt',
    })
        .map(line =>
            line
                .split('')
                .map(val => parseInt(val))
        )

    const part1 = forest
        .flatMap((row, rowIndex) =>
            row
                .map((_treeHeight, columnIndex) => getIsTreeVisibleFromAnyEdge(forest, rowIndex, columnIndex))
        )
        .filter(Boolean)
        .length

    const part2 = Math.max(
        ...forest
            .flatMap((row, rowIndex) =>
                row
                    .map((_treeHeight, columnIndex) =>
                        computeScenicScore(forest, rowIndex, columnIndex)
                    )
            )
    )

    console.log({
        part1,
        part2,
    })
}
