const cheerio = require('cheerio')

// Specify stock ticker
let stockTicker = 'mrna'

// Select type of either history of key-statistics
// let type = 'history'
let type = 'key-statistics'

// Define scraper function
async function scrapeData() {
    try {
        // step 1 - fetch HTML page and instantiate cheerio
        const url = `https://finance.yahoo.com/quote/${stockTicker}/${type}?p=${stockTicker}`
        const res = await fetch(url)
        const html = await res.text()
        const $ = cheerio.load(html)
        type === 'history' && getPrices($) // fetch prices if type history
        type === 'key-statistics' && getStats($) // fetch stats if type key-statistics

    } catch (err) {
        console.log(err.message)
    }
}

scrapeData()

function getStats(cher) {
    const stats = cher('section[data-test="qsp-statistics"] tr').get().map(val => {
        const $ = cheerio.load(val)
        const keyVals = $('td').get().splice(0, 2).map(val => $(val).text())
        console.log(keyVals)
        return keyVals
    })
    return stats
}

function getPrices(cher) {
    const prices = cher('td:nth-child(6)').get().map(val => cher(val).text())
    console.log(prices)
    return { prices }
}