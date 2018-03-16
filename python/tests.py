import unittest
import sys

class TestExchanges(unittest.TestCase):
    def test_version(self):
        self.assertTrue(sys.version_info >= (3, 5))

if __name__ == '__main__':
    unittest.main()
