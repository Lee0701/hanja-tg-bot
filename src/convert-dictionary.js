const fs = require('fs')
const buildDict = (file) => fs.readFileSync(file)
        .toString()
        .split('\n')
        .filter((line) => !line.startsWith('#') && line.trim() != '')
        .map((line) => line.split(':').map((item) => item.trim()))
        .reduce((acc, [key, value]) => (acc[key] = [...(acc[key] || []), value], acc), {})
const buildFreq = (file) => fs.readFileSync(file)
        .toString()
        .split('\n')
        .filter((line) => !line.startsWith('#') && line.trim() != '')
        .map((line) => line.split(':').map((item) => item.trim()))
        .reduce((acc, [key, value]) => (acc[key] = parseInt(value), acc), {})
module.exports = {buildDict, buildFreq}