'use strict'
// for the pretty colors
const chalk = require('chalk')
// the main dependency
const ccxt = require('ccxt')
// native node fileserver
const fs = require('fs')
// to prettify the output
const jPretty = require('json-pretty')

const user = require('../userAuth.json')
const config = require('../config.json')
// the Accounts logic, should be able to plug in fetchMyTrades module in same manner
const Accounts = require('./Accounts')

// global count of number of accounts for use in loops
const EOF = Object.keys(user.accounts).length
// global result object
const res = {}
// target for results files
const logTarg = config.logDir.concat('/\\.log.txt')

// set global error handler
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log(chalk.red('Unhandled Rejection: '), error.message);
})

// start app
init(buildData)

function init(callback) {
  // clear and init user authed clients
  user.clients = {}
  // clear and init response accounts object
  res.accounts = {}

  console.log(chalk.green('Getting info for ' + user.name + '...'))

  // loop thru exchange account keys
  for (const exchangeID in user.accounts) {
    console.log('Found keys for ' + JSON.stringify(exchangeID))
    const keys = user.accounts[exchangeID]
    // create new ccxt object
    /* eslint-disable new-cap */
    user.clients[exchangeID] = new ccxt[exchangeID](keys)
    // fetch available Accounts and related data
    Accounts.parse(user.id, user.clients[exchangeID], exchangeID)
      .then((data) => { callback(data) })
  }
  return user
}

function buildData(data) {
  if (data.err) console.error(chalk.red(data.err))
  res.accounts[data.exKey] = data.data ? data.data : data.err
  if (Object.keys(res.accounts).length === EOF) writeData('accounts')
}

function writeData(target) {
  const data = jPretty(res[target])
  target = logTarg.replace('\\', target)
  let writeStream = fs.createWriteStream(target)
  writeStream.write(data, 'utf8')
  writeStream.end()
  writeStream.on('finish', function() {  
    console.log(chalk.blue('Data written to -> ') + target)
    gracefulExit()
  })
}

function gracefulExit() {
  console.log(chalk.green('Process success'))
  process.exit(0)
}
