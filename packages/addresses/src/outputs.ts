/* tslint:disable */

export const outputs = 
{
  "3-staging": {
    "human_friendly_name": "ropsten-staging",
    "addresses": {
      "Cards": "0xADC559D1afbCBBf427728577F40E7358D96F1209",
      "OpenMinter": "0x36F26280B80e609e347c843E2AE5351Ee4b5f7eD",
      "Forwarder": "0x78798915cb0fE78354454aFe9C0d224af495B505"
    },
    "dependencies": {
      "WETH": "0xc778417e063141139fce010982780140aa0cd5ab",
      "ZERO_EX_EXCHANGE": "0xbff9493f92a3df4b0429b6d00743b3cfb4c85831",
      "ZERO_EX_ERC20_PROXY": "0xb1408f4c245a23c31b98d2c626777d4c0d766caa",
      "ZERO_EX_ERC721_PROXY": "0xe654aac058bfbf9f83fcaee7793311dd82f6ddb4"
    }
  },
  "1-production": {
    "human_friendly_name": "main-net-production",
    "addresses": {
      "Cards": "0x0e3a2a1f2146d86a604adc220b4967a898d7fe07",
      "Forwarder": "0xb04239b53806ab31141e6cd47c63fb3480cac908"
    },
    "dependencies": {
      "WETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "ZERO_EX_EXCHANGE": "0x080bf510fcbf18b91105470639e9561022937712",
      "ZERO_EX_ERC20_PROXY": "0x95e6f48254609a6ee006f7d493c8e5fb97094cef",
      "ZERO_EX_ERC721_PROXY": "0xefc70a1b18c432bdc64b596838b4d138f6bc6cad"
    },
    "state": {
      "network_id": 1
    }
  },
  "50-development": {
    "human_friendly_name": "test-rpc-development",
    "addresses": {
      "Cards": "0x7245C578E9a948253c6201Dc3D1a67D8F70d6aa8",
      "OpenMinter": "0xcd95207B2F4D22b126B97d87D8625Ea425665e50",
      "Forwarder": "0xDff33AFFd86B4203F8B533D2fD3FE04f933DED09",
      "Registry": "0xC71A764d32aC16D38c67ABA9ba66d24A82361A96",
      "LockLimiter": "0xD6E934AE3CEa5CE60c5c220947FE790d12C15fFB",
      "BackupModule": "0x57f285C8E8ecBAFcC176020d8d595886b9e6B9C5",
      "PurchaseModule": "0x453f5D403406e3DD50ac6442873f89cD2Ec8500b",
      "RecoveryModule": "0xF32A67Fd7FD228EeE416c2f0c82dfAD76BC7c8C3",
      "TransferModule": "0xB2F85527940EEd610a4bC9edf7C6064E7aDB08C8",
      "LimitedModule": "0xcAb22Eda4dA9ba72a1E12eC4Cd7fa5820a78F932",
      "SimpleDelegate": "0x3Ed02E77B4Dcc2E9e82D630608fba67E35d7F2eF",
      "MultiLimiter": "0x96A6340689e6a67B875940B5EA6CaF196Bb932C8",
      "WalletFactory": "0xAD275FbFD25bF1BA12fCF8fb8D4179c1231bfB67",
      "ZERO_EX_EXCHANGE": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
      "ZERO_EX_ERC20_PROXY": "0x1dc4c1cefef38a777b15aa20260a54e584b16c48",
      "ZERO_EX_ERC721_PROXY": "0x1d7022f5b17d2f8b695918fb48fa1089c9f85401",
      "WETH": "0x0b1ba0af832d7c05fd64161e0db78e85978e8082"
    },
    "dependencies": {
      "ZERO_EX_EXCHANGE": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
      "ZERO_EX_ERC20_PROXY": "0x1dc4c1cefef38a777b15aa20260a54e584b16c48",
      "ZERO_EX_ERC721_PROXY": "0x1d7022f5b17d2f8b695918fb48fa1089c9f85401",
      "WETH": "0x0b1ba0af832d7c05fd64161e0db78e85978e8082"
    },
    "state": {
      "network_id": 50
    }
  }
}