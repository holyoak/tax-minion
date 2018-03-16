import ccxt
import logging
import json
import sys
import os


logging.basicConfig(format="%(asctime)s - %(message)s")
logger = logging.getLogger('exchanges')
logger.setLevel(logging.INFO)

class User:
    def __init__(self, id, name, accounts):
        self.id = id
        self.name = name
        self.accounts = accounts

    def get_trades(self):
        for exchange, keys in self.accounts.items():
            exc_name = exchange.lower()
            logger.info('Attempting to fetch trades for site "{}".'.format(exchange))
            exchange = getattr(ccxt, exc_name)()
            exchange['apiKey'] = keys['apiKey']
            exchange['secret'] = keys['secret']
            if exchange.has['fetchMyTrades']:
                with open("output/" + exc_name + "_trade_data.json", 'w') as f:
                    json.dump(exchange.fetchMyTrades(), f, indent=4)
                    logger.info('Retrieved trades.')
            else:
                logger.error('Site does not support fetching trade data.')

    def get_markets(self):
        for exchange, keys in self.accounts.items():
            exc_name = exchange.lower()
            logger.info('Attempting to fetch markets for site "{}".'.format(exchange))
            exchange = getattr(ccxt, exc_name)()
            if exchange.has['fetchMarkets']:
                with open("output/" + exc_name + "_market_data.json", 'w') as f:
                    json.dump(exchange.fetchMarkets(), f, indent=4)
                    logger.info('Retrieved markets.')
            else:
                logger.error('Site does not support fetching market data.')


def load_data():
    with open('userAuth.json', 'r') as f:
        data = json.load(f)
        user = User(data['_id'], data['name'], data['accounts'])
        return user

def main():
    logger.info('Starting program.')
    user = load_data()
    user.get_markets()


if __name__ == '__main__':
    main()
