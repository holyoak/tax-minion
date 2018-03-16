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
    client.fetchBalance()
      .then((data) => {
        resolve(parseData(userID, data, exKey))
      })
  })
}

/**
 * Switchboard for passing data to specific exchange components
 * @param  {Object}   data        raw ccxt loadMarkets() data
 * @param  {AppID}    exKey       App exchange key
 * @return {Object}               app state fragment
 */
function parseData (userID, data, exKey) {
  const res = {}
  // remove redundant data
  if (data.info) delete data.info
  if (data.free) delete data.free
  if (data.total) delete data.total
  if (data.used) delete data.used
  // remove zero balances
  for (const asset in data) {
    if (!(Number(data[asset].total) > 0.00000001)) delete data[asset]
  }
  res.data = data
  res.exKey = exKey
  res.userID = userID
  return res
}
