const path = require("path");

module.exports = {
// See <http://truffleframework.com/docs/advanced/configuration>
// to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
      development: {
      network_id: "*",
      host: 'localhost',
      port: 7545,
      gas: 4712388,
      gasPrice: 100000000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.17",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};