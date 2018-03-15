'use strict';
const chalk = require('chalk')
const ccxt = require('ccxt')

const user = require('../userAuth.json')
const Markets = require('./Markets')

// console.log(user.accounts)
openSession(success)

function openSession (callback) {
  user.clients = {}
  console.log('Opening new session...')

  // loop thru exchange accounts
  for (const exchangeID in user.accounts) {
    console.log('Found keys for ' + JSON.stringify(exchangeID))
    const keys = user.accounts[exchangeID]
    // create new ccxt object
    /* eslint-disable new-cap */
    user.clients[exchangeID] = new ccxt[exchangeID](keys)
    // fetch available markets and related data
    Markets.parse(user.id, user.clients[exchangeID], exchangeID)
      .then((data) => { callback(null, data) })
  }
  return user
}

function success() {
  console.log(chalk.green('Process success'))
  process.exit(0)
}
