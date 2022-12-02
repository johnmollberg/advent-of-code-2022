import {runDay1} from './days/day-01'
import {runDay2} from './days/day-02'
import {runDay3} from './days/day-03'
import {runDay4} from './days/day-04'
import {runDay5} from './days/day-05'
import {runDay6} from './days/day-06'
import {runDay7} from './days/day-07'
import {runDay8} from './days/day-08'
import {runDay9} from './days/day-09'
import {runDay10} from './days/day-10'
import {runDay11} from './days/day-11'
import {runDay12} from './days/day-12'
import {runDay13} from './days/day-13'
import {runDay14} from './days/day-14'
import {runDay15} from './days/day-15'
import {runDay16} from './days/day-16'
import {runDay17} from './days/day-17'
import {runDay18} from './days/day-18'
import {runDay19} from './days/day-19'
import {runDay20} from './days/day-20'
import {runDay21} from './days/day-21'
import {runDay22} from './days/day-22'
import {runDay23} from './days/day-23'
import {runDay24} from './days/day-24'
import {runDay25} from './days/day-25'

const allDays: (() => Promise<void>)[] = [
    runDay1,
    runDay2,
    runDay3,
    runDay4,
    runDay5,
    runDay6,
    runDay7,
    runDay8,
    runDay9,
    runDay10,
    runDay11,
    runDay12,
    runDay13,
    runDay14,
    runDay15,
    runDay16,
    runDay17,
    runDay18,
    runDay19,
    runDay20,
    runDay21,
    runDay22,
    runDay23,
    runDay24,
    runDay25,
]

const run = async () => {
    const dayToRun = parseInt(process.argv[2])
    if (isNaN(dayToRun) || dayToRun > allDays.length || dayToRun < 0) {
        console.error(`invalid day: ${process.argv[2]}`)
    } else {
        await allDays[dayToRun - 1]()
    }
}

run()
