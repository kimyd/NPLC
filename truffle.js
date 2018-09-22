var HDWalletProvider = require('truffle-hdwallet-provider');
var infura_apikey = '884db4568d45403cb5f013db4d44a1c0';
var mnemonic = 'minus taps socks alone color memory fruit dinosaur joyful thin sword mile';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id,
      gas: 3000000
    },

    ganache: {
      host: "localhost",
      port: 7545,
      from: "0x81b7e5064fb7D9EBE21a051559EAdda2B82ad5c6",
      network_id: 5777 // Match any network id,
    },

    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/"+infura_apikey),
      network_id: 4
    },

    // rinkeby: {
    //   host: "localhost", // Connect to geth on the specified
    //   port: 8545,
    //   from: "0xdB75d13CE958320145f3C8ede33Db917bB59A463", //qwer12341!// default address to use for any transaction Truffle makes during migrations
    //   network_id: 4,
    //   gas: 4612388 // Gas limit used for deploys
    // },
    // rinkeby: {
    //   provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/"+infura_apikey),
    //   network_id: 4
    //   // gas: 3000000
    // },
    live: {
      host: "localhost",
      port: 8546,
      network_id: 1        // Ethereum public network
    }
  }
};
