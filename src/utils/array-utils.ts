import {Primitive} from '../types'
import {cloneDeep} from 'lodash'

type InitializeArrayParams<T> = {
    length: number
    defaultValue?: T
}

interface InitializeArray {
    (params: InitializeArrayParams<undefined>): number[],
    <T>(params: InitializeArrayParams<T>): T[],
}

export const initializeArray: InitializeArray = (params) => {
    const {
        defaultValue,
        length,
    } = params
    const arrayOfProperLength = Array.from(new Array(length))
    return defaultValue === undefined ?
        arrayOfProperLength.map((_value, index) => index) :
        arrayOfProperLength.map(_value => defaultValue)
}

export const sumArray = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)

export const removeItemFromArray = <T extends Primitive>(
    arr: T[],
    item: T,
): T[] => removeFirstItemFromArrayByPredicate(arr, (value => value === item))

export const removeFirstItemFromArrayByPredicate = <T>(
    arr: T[],
    predicate: (arrayItem: T) => boolean
): T[] => {
    const copy = cloneDeep(arr)
    copy.splice(arr.findIndex(predicate), 1)
    return copy
}

export const transpose2dMatrix = <T>(matrix: T[][]): T[][] => matrix[0].map((col, i) => matrix.map(row => row[i]))