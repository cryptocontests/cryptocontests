var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "WzQrijeM6mNgaf0TAH5z";
var mnemonic = "student tent patch puzzle away swing cake toe surprise same purchase range";

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3
    }
  }
};
