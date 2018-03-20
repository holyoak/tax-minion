'use strict'

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
    const res = {userID: userID, exKey: exKey}
    client.fetchBalance()
      .then((data) => {
        res.data = data
        resolve(parseData(res))
      })
      .catch((err) => {
        res.err = err
        resolve(res)
      })
  })
}

/**
 * Switchboard for passing data to specific exchange components
 * @param  {Object}   data        raw ccxt loadMarkets() data
 * @param  {AppID}    exKey       App exchange key
 * @return {Object}               app state fragment
 */
function parseData (res) {
  // remove redundant data
  if (res.data.info) delete res.data.info
  if (res.data.free) delete res.data.free
  if (res.data.total) delete res.data.total
  if (res.data.used) delete res.data.used
  // remove zero balances
  for (const asset in res.data) {
    if (!(Number(res.data[asset].total) > 0.00000001)) delete res.data[asset]
  }
  return res
}
