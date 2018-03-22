#!/usr/bin/env python
import ccxt
from ccxt.base.errors import AuthenticationError
import binascii
import logging
import json
import sys
import os

logging.basicConfig(format="%(asctime)s [%(levelname)s] - %(message)s")
logger = logging.getLogger('exchanges')
logger.setLevel(logging.INFO)

class User:
    """Views user's cryptocurrency data.

    Args:
        id (int): The user's ID number.
        name (str): The user's username.
        accounts (dict): Dictionary of websites attached to the user's accounts, along with their API keys.
    """
    def __init__(self, id, name, accounts):
        self.id = id
        self.name = name
        self.accounts = accounts

    def get_trades(self):
        """Uses the user's accounts information to retrieve their trades. Outputs the results into files."""
        for exchange, keys in self.accounts.items():
            exc_name = exchange.lower()
            logger.info('Attempting to fetch trades for site "{}".'.format(exc_name))
            try:
                exchange = getattr(ccxt, exc_name)(keys)
                logger.info('Found site "{}".'.format(exc_name))
                if exchange.has['fetchMyTrades']:
                    with open("output/" + exc_name + "_trade_data.json", 'w') as f:
                        json.dump(exchange.fetchMyTrades(), f, indent=4)
                        logger.info('Retrieved trades.\n')
                else:
                    logger.error('Site does not support fetching trade data.\n')
            except AuthenticationError:
                logger.error('API keys are invalid.\n')
            except binascii.Error: logger.error('Encoded incorrectly.\n')

    def get_balances(self):
        """Uses the user's accounts information to retrieve their balances. Outputs the results into files."""
        for exchange, keys in self.accounts.items():
            exc_name = exchange.lower()
            logger.info('Attempting to fetch balances for site "{}".'.format(exc_name))
            try:
                exchange = getattr(ccxt, exc_name)(keys)
                logger.info('Found site "{}".'.format(exc_name))
                if exchange.has['fetchBalance']:
                    with open("output/" + exc_name + "_balance_data.json", 'w') as f:
                        data = exchange.fetchBalance()
                        for site in list(data.keys()):
                            for key, balance in list(data[site].items()):
                                if type(balance) == dict:
                                    for k2, b2 in list(data[site][key].items()):
                                        if float(b2) == 0:
                                            del data[site][key][k2]
                                    if not data[site][key]:
                                        del data[site][key]
                                    continue
                                if float(balance) == 0:
                                    del data[site][key]
                            if not data[site]:
                                del data[site]
                        json.dump(data, f, indent=4)
                        logger.info('Retrieved balances.\n')
                else:
                    logger.error('Site does not support fetching balance data.\n')
            except AuthenticationError:
                logger.error('API keys are invalid.\n')
            except binascii.Error: logger.error('Encoded incorrectly.\n')


def load_data():
    """Opens user data, creates user object(s), and returns them."""
    with open('../userAuth.json', 'r') as f:
        data = json.load(f)
        user = User(data['_id'], data['name'], data['accounts'])
        return user

def main():
    logger.info('Starting program.')
    # ensure output directory exists before doing any operations
    if not os.path.exists('output/'): os.makedirs('output')

    user = load_data()
    user.get_balances()

if __name__ == '__main__':
    main()
