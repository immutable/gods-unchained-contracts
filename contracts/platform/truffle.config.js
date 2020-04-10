module.exports = {
  networks: {
    'development': {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    'main': {
      network_id: 1
    },
    'ropsten': {
      network_id: 3
    },
    'kovan': {
      network_id: 42
    }
  },
  compilers: {
    solc: {
      version: "0.6.6",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};