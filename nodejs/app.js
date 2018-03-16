'use strict';
const chalk = require('chalk')
const ccxt = require('ccxt')
const fs = require('fs')
const jPretty = require('json-pretty')

const user = require('../userAuth.json')
const config = require('../config.json')
const Accounts = require('./Accounts')

const EOF = Object.keys(user.accounts).length
// global result object
const res = {}
// target for results files
const logTarg = config.logDir.concat('/\\.log.txt')
// start app
init(buildData)

function init(callback) {
  user.clients = {}
  console.log(chalk.green('Getting info for ' + user.name + '...'))

  // loop thru exchange accounts
  for (const exchangeID in user.accounts) {
    console.log('Found keys for ' + JSON.stringify(exchangeID))
    const keys = user.accounts[exchangeID]
    // create new ccxt object
    /* eslint-disable new-cap */
    user.clients[exchangeID] = new ccxt[exchangeID](keys)
    // fetch available Accounts and related data
    res.accounts = {}
    Accounts.parse(user.id, user.clients[exchangeID], exchangeID)
      .then((data) => { callback(data) })
  }
  return user
}

function buildData(data) {
  if (data.err) console.err(chalk.red(err))
  else {
  	res.accounts[data.exKey] = data.data
  	if (Object.keys(res.accounts).length === EOF) writeData('accounts')
  }
}

function writeData(target) {
  console.log('writing data')
  const data = jPretty(res[target])
  target = logTarg.replace('\\', target)
  let writeStream = fs.createWriteStream(target)
  writeStream.write(data, 'utf8')
  writeStream.on('finish', function() {  
    console.log(chalk.blue('Data written to ' + target))
  })
}

function gracefulExit() {
  console.log(chalk.green('Process success'))
  process.exit(0)
}
