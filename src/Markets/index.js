'use strict'
const chalk = require('chalk')

module.exports = {
  parse: parse
}
/**
 * Normalize market utility data
 * @param  {Client}   client      ccxt exchange client
 * @param  {AppID}    exKey          App exchange key
 * @return {Object}               app state fragment
 */
function parse (userID, client, exKey) {
  return new Promise(function (resolve, reject) {
    client.loadMarkets()
      .then((data) => {
        resolve(parseData(userID, data, exKey))
      })
  })
}

/**
 * Switchboard for passing data to specific exchange components
 * @param  {Object}   data        raw ccxt loadMarkets() data
 * @param  {AppID}    exKey          App exchange key
 * @return {Object}               app state fragment
 */
function parseData (userID, data, exKey) {
  console.log('exchaneg key is ' + exKey)
  console.log(JSON.stringify(data))
  // const res = {
  //   flag: 'load markets',
  //   data: { id: exKey }
  // }
  // switch (ID) {
  //   case 'gdax':
  //     res.data.markets = Gdax.parseMarkets(data)
  //     return res
  //   default:
  //     const msg = '/ClientParser/Markets switch condition not met'
  //     console.error(chalk.red.bold(msg))
  //     return ({ err: 1, m: msg })
  // }
}
