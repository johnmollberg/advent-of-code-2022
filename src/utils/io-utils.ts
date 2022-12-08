import * as readline from 'readline'
import * as fs from 'fs'
import * as events from 'events'

type ProcessInputParams = {
    fileLocation: string
    handleLine: (line: string, lineIndex: number) => void
}

export const processInput = async (params: ProcessInputParams): Promise<void> => {
    const {
        fileLocation,
        handleLine,
    } = params
    let lineIndex = 0
    const readlineInterface = readline.createInterface({
        input: fs.createReadStream(fileLocation),
        crlfDelay: Infinity,
    }).on('line', (line) => {
        handleLine(line, lineIndex)
        lineIndex++
    })
    await events.once(readlineInterface, 'close')
}

type GetAllInputLinesParams = {
    fileLocation: string
}

export const getAllInputLines = (params: GetAllInputLinesParams): string[] => {
    const {
        fileLocation,
    } = params
    return fs.readFileSync(fileLocation).toString().split('\n').filter(Boolean)
}