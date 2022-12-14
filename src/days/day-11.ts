import {getAllInputLines} from '../utils/io-utils'
import {removeItemFromArray} from "../utils/array-utils";

type Monkey = {
    items: number[]
    operation: (oldItem: number) => number
    testDivisor: number
    ifTrueTargetMonkey: number
    ifFalseTargetMonkey: number
    inspectionCount: number
}

type OperatorSymbol = '+' | '*'

const operatorFunctions: Record<OperatorSymbol, (a: number, b: number) => number> = {
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
}

const initializeMonkeys = (): Monkey[] => {
    const inputLines = getAllInputLines({
        fileLocation: 'input.txt',
    })
    const monkeys: Monkey[] = []
    for (const inputLine of inputLines) {
        if (!inputLine) {
            continue
        }
        if (inputLine.startsWith('Monkey')) {
            monkeys.push({
                items: [],
                operation: () => 0,
                ifTrueTargetMonkey: -1,
                ifFalseTargetMonkey: -1,
                testDivisor: -1,
                inspectionCount: 0,
            })
            continue
        }
        const [key, value] = inputLine.split(':').map(v => v.trim())
        const monkey = monkeys[monkeys.length - 1]
        switch (key) {
            case 'Starting items': {
                monkey.items = value
                    .split(', ')
                    .map(v => parseInt(v))
                break
            }
            case 'Operation': {
                const [param1, operator, param2] = value.split(' = ')[1].split(' ')
                const param1AsInt = parseInt(param1)
                const param2AsInt = parseInt(param2)

                const operateFunc = operatorFunctions[operator as OperatorSymbol]

                monkey.operation = (oldItem) => {
                    return operateFunc(
                        isNaN(param1AsInt) ?
                            oldItem :
                            param1AsInt,
                        isNaN(param2AsInt) ?
                            oldItem :
                            param2AsInt,
                    )
                }
                break
            }
            case 'Test': {
                const [_divisibleBy, divisor] = value.split('divisible by ')
                monkey.testDivisor = parseInt(divisor)
                break
            }
            case 'If true': {
                const [_throwTo, target] = value.split('throw to monkey ')
                monkey.ifTrueTargetMonkey = parseInt(target)
                break
            }
            case 'If false': {
                const [_throwTo, target] = value.split('throw to monkey ')
                monkey.ifFalseTargetMonkey = parseInt(target)
                break
            }
            default: {
                throw new Error(`key ${key} not implemented`)
            }
        }
    }
    return monkeys
}

const playKeepAway = (monkeys: Monkey[], numberOfRounds: number, divisor: number, modulo: number) => {
    for (let i = 0; i < numberOfRounds; i++) {
        for (const monkey of monkeys) {
            while (monkey.items.length) {
                const [item] = monkey.items.splice(0, 1)
                const reducedItem = modulo ? item % modulo : item
                const newItem = Math.floor(monkey.operation(reducedItem) / divisor)
                const targetMonkey = newItem % monkey.testDivisor === 0 ?
                    monkey.ifTrueTargetMonkey :
                    monkey.ifFalseTargetMonkey
                monkeys[targetMonkey].items.push(newItem)
                monkey.inspectionCount++
            }
        }
    }
}

const getLevelOfMonkeyBusiness = (monkeys: Monkey[]) => {
    const inspectionCounts = monkeys.map(monkey => monkey.inspectionCount)
    const maxInspectionCount = Math.max(...inspectionCounts)
    const secondMaxInspectionCount = Math.max(...removeItemFromArray(inspectionCounts, maxInspectionCount))
    return maxInspectionCount * secondMaxInspectionCount
}

export const runDay11 = async () => {
    let monkeys = initializeMonkeys()
    playKeepAway(monkeys, 20, 3, 0)
    const part1 = getLevelOfMonkeyBusiness(monkeys)

    monkeys = initializeMonkeys()
    // only the lcm because all the test divisors are prime
    const lcm = monkeys.map(m => m.testDivisor).reduce((acc, curr) => acc * curr, 1)
    playKeepAway(monkeys, 10000, 1, lcm)
    const part2 = getLevelOfMonkeyBusiness(monkeys)

    console.log({
        part1,
        part2,
    })
}
