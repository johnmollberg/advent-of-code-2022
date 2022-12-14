import {getAllInputLines} from '../utils/io-utils'
import {getStringArrayInChunks} from '../utils/array-utils'

type Item = number | Item[]

const parseItem = (item: string): Item => {
    const itemAsInt = parseInt(item)
    if (!isNaN(itemAsInt)) {
        return itemAsInt
    }

    let bracketCount = 0
    const subItemsByChars: string[][] = [[]]

    item
        .substring(1, item.length - 1)
        .split('')
        .forEach(char => {
            if (char === '[') {
                bracketCount++
            } else if (char === ']') {
                bracketCount--
            }
            if (bracketCount === 0 && char === ',') {
                return subItemsByChars.push([])
            }
            subItemsByChars[subItemsByChars.length - 1].push(char)
        })

    return subItemsByChars
        .filter(subChars => subChars.length)
        .map(subChar => subChar.join(''))
        .map(parseItem)
}

enum ComparisonResult {
    equal = 'equal',
    inOrder = 'inOrder',
    outOfOrder = 'outOfOrder',
}

const getComparisonResult = (left: Item | undefined, right: Item | undefined): ComparisonResult => {
    if (typeof left === 'undefined') {
        if (typeof right === 'undefined') {
            throw new Error('THE IMPOSSIBLE HAS HAPPENED')
        }
        return ComparisonResult.inOrder
    }
    if (typeof right === 'undefined') {
        return ComparisonResult.outOfOrder
    }

    if (typeof left === 'number' && typeof right === 'number') {
        if (left < right) {
            return ComparisonResult.inOrder
        } else if (left > right) {
            return ComparisonResult.outOfOrder
        }
        return ComparisonResult.equal
    }

    if (typeof left !== 'number' && typeof right !== 'number') {
        const maxIndex = Math.max(left.length, right.length)
        for (let i = 0; i < maxIndex; i++) {
            const childResult = getComparisonResult(left[i], right[i])
            if (childResult !== ComparisonResult.equal) {
                return childResult
            }
        }
        return ComparisonResult.equal
    }

    if (typeof left === 'number') {
        return getComparisonResult([left], right)
    }
    return getComparisonResult(left, [right])
}

const getPart2Target = (sortedItems: Item[], target: number) =>
    sortedItems.findIndex(item =>
        typeof item === 'object' &&
        item.length === 1 &&
        typeof item[0] === 'object' &&
        item[0].length === 1 &&
        item[0][0] === target
    ) + 1

export const runDay13 = async () => {
    const pairs = getStringArrayInChunks(getAllInputLines({
        fileLocation: 'input.txt',
        disableFilter: true,
    })).map(pair => pair.map(leftOrRightItem => parseItem(leftOrRightItem)))

    const part1 = pairs
        .reduce((sum, pair, index) => {
            if (getComparisonResult(pair[0], pair[1]) === ComparisonResult.inOrder) {
                return sum + index + 1
            }
            return sum
        }, 0)

    const allSorted = [
        ...pairs.flat(),
        [[2]],
        [[6]],
    ].sort((a, b) => {
        const result = getComparisonResult(a, b)
        switch (result) {
            case ComparisonResult.inOrder: {
                return -1
            }
            case ComparisonResult.outOfOrder: {
                return 1
            }
            case ComparisonResult.equal: {
                return 0
            }
        }
    })

    const firstTarget = getPart2Target(allSorted, 2)
    const secondTarget = getPart2Target(allSorted, 6)

    const part2 = firstTarget * secondTarget

    console.log({
        part1,
        part2,
    })
}
