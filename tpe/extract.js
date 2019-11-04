const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({
    input: fs.createReadStream('./export.xml'),
});

const exerciseData = []
const standCount = new Map();

readInterface.on('line', line => {
    if (line.includes('HKCategoryValueAppleStandHourStood')) {
        const matched = /startDate="([0-9: -]*)"/.exec(line)
        exerciseData.push(new Date(matched[1]))
    }
});

readInterface.on('close', () => {
    for (const data of exerciseData) {
        const day = new Date(new Date(data).setHours(0, 0, 0, 0))
        console.log(day)
        const key = `${day.getUTCFullYear()}-${day.getUTCMonth() + 1}-${day.getUTCDay() + 1}`
        const count = standCount.get(key) || 0
        standCount.set(key, count + 1)
    }

    console.log(standCount)
})
