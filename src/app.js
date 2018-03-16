'use strict';
const chalk = require('chalk')
const ccxt = require('ccxt')
const fs = require('fs')

const user = require('../userAuth.json')
const config = require('../config.json')
const History = require('./History')


// initialize stream to write results

// start app
init(returnData)

function init(callback) {
  user.clients = {}
  console.log(chalk.green('Opening new session...'))

  // loop thru exchange accounts
  for (const exchangeID in user.accounts) {
    console.log('Found keys for ' + JSON.stringify(exchangeID))
    const keys = user.accounts[exchangeID]
    // create new ccxt object
    /* eslint-disable new-cap */
    user.clients[exchangeID] = new ccxt[exchangeID](keys)
    // fetch available History and related data
    History.parse(user.id, user.clients[exchangeID], exchangeID)
      .then((data) => { callback(null, data, exchangeID) })
  }
  return user
}

function returnData(err, data, exchangeID) {
  if (err) console.err(chalk.red(err))
  else {
  	const logfile = config.log + '.' + exchangeID + '.log.txt'
  	let writeStream = fs.createWriteStream(logfile)
    writeStream.write(JSON.stringify(data), 'utf8')
    writeStream.on('finish', () => {  
      console.log(chalk.blue('Data written to ' + config.log))
      writeStream.end()
    })
  }
}

function gracefulExit() {
  // 
  console.log(chalk.green('Process success'))
  process.exit(0)
}
