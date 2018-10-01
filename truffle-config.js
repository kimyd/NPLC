require('dotenv').config();
require('babel-register')({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider');
const providerWithMnemonic = (mnemonic, providerUrl) => new HDWalletProvider(mnemonic, providerUrl);

const infuraProvider = network => providerWithMnemonic(
  process.env.MNEMONIC || '',
  `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
);


const ropstenProvider = process.env.SOLIDITY_COVERAGE
  ? undefined
  : infuraProvider('ropsten');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' 
    },
    ropsten: {
      provider: ropstenProvider,
      network_id: 3 
    },
    kovan: {
      provider: ropstenProvider,
      network_id: 42 
    },
    coverage: {
      host: 'localhost',
      network_id: '*', 
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*' 
    },
    main: {
      provider: ropstenProvider,
      network_id: 1 
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'KRW',
      gasPrice: 5
    }
  }
};
