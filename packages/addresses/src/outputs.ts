/* tslint:disable */

export const outputs = {
  "1-production": {
    "human_friendly_name": "main-net-production",
    "addresses": {
      "LegacyCards": "0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab",
      "Cards": "0x0e3a2a1f2146d86a604adc220b4967a898d7fe07",
      "Forwarder": "0xb04239b53806ab31141e6cd47c63fb3480cac908",
      "Fusing": "0x7c633611d9199Faff68bCE5c5Ad97d3514319B77",
      "S3PromoFactory": "0x28A54b2b798Bb8b8751D1Cd423A435472a009272",
      "S5PromoFactory": "0x8eB207F54846614Aebe3335DF2BD351823a04316",
      "Forge": "0x604b7a4a8ad3c4bc876c660a74b1a6e147b156c0",
      "BLACKLIST_Fusing": "0x833EA312aC6Ef27d2ca40BF247B0c5edbe991314",
      "EtherbotsMigration": "0xa777967d22043BE43f8fAd3552AD486f3765FD29",
      "ChimeraMigration": "0xc0f1eE9884Be19c4bB2e31F505f7a18FdB9c8025"
    },
    "dependencies": {
      "WETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "ZERO_EX_EXCHANGE": "0x080bf510fcbf18b91105470639e9561022937712",
      "ZERO_EX_ERC20_PROXY": "0x95e6f48254609a6ee006f7d493c8e5fb97094cef",
      "ZERO_EX_ERC721_PROXY": "0xefc70a1b18c432bdc64b596838b4d138f6bc6cad"
    },
    "state": {
      "network_id": 1,
      "last_deployment_stage": null
    }
  },
  "3-development": {
    "human_friendly_name": "ropsten-development",
    "addresses": {
      "IM_Beacon": "0x0e15f4e0859a5d47f6E4059690370c2741bE7728",
      "IM_Processor": "0x46Cc19BCEDe90817Cc482f7269a5B8C77EB80a33",
      "IM_TestVendor": "0x2C002504BdCaF91E4df5fAb2515D2389A5D42Ba5",
      "IM_Escrow": "0xc8BF76BF58873abC8C1Af2D13313C4F5C29796be",
      "IM_Escrow_CreditCard": "0xCA5c5cB4b60B7e8ef1f35Aa8D8C1608a365226D8",
      "GU_Forwarder": "0x90682687Ac6FE3D43E2fE64c1C2708b8B87B1C7f",
      "GU_Cards": "0xaB45Ed94Ae0228BB1031F0Aec7D665B840d43996",
      "GU_OpenMinter": "0xA30C6B0200B450aE03327817F2F903C491050bED",
      "GU_Fusing": "0x4Efd125aa24EBAadDFCACeCDFEb2674a40835f84",
      "GU_PromoFactory": "0x1f81e2452B7635E5C9E0D7A6eB7355D1c0d28903",
      "GU_S1_Vendor": "0x68A8764Ba24Bc2b1a8894b31aFF08DcEdaAd2Ff0",
      "GU_S1_Raffle": "0x2db05DAd1c16389D93c082480575b7DaBFDCe503",
      "GU_S1_Sale": "0x052E0A4C0c0c9fFd1715309e90caec0f4C51d91D",
      "GU_S1_Referral": "0x3e38bE3F515A2D0C5E4D40E6252c0b75D06ceab7",
      "GU_S1_Epic_Pack": "0x5792080a97FfFBca3791b28A0432E249e23aCd10",
      "GU_S1_Rare_Pack": "0x2836B23D02247f897b55e776F55B0C14cA8b8c79",
      "GU_S1_Shiny_Pack": "0x1Aad2AE223BD1953bac2f8d5db7A9871fF2fF167",
      "GU_S1_Legendary_Pack": "0x8c16facA495089be925F11bD3c8B8E31EF0cDbB1"
    },
    "dependencies": {
      "ZERO_EX_EXCHANGE": "0xbff9493f92a3df4b0429b6d00743b3cfb4c85831",
      "ZERO_EX_ERC20_PROXY": "0xb1408f4c245a23c31b98d2c626777d4c0d766caa",
      "ZERO_EX_ERC721_PROXY": "0xe654aac058bfbf9f83fcaee7793311dd82f6ddb4",
      "WETH": "0xc778417e063141139fce010982780140aa0cd5ab"
    },
    "state": {
      "network_id": 3,
      "last_deployment_stage": null
    }
  },
  "3-staging": {
    "human_friendly_name": "ropsten-staging",
    "addresses": {
      "Cards": "0xADC559D1afbCBBf427728577F40E7358D96F1209",
      "OpenMinter": "0x36F26280B80e609e347c843E2AE5351Ee4b5f7eD",
      "Forwarder": "0xc79C9c624ea8A3dEdfae0dbf9295Bfb159eE5F3b",
      "Fusing": "0xFfFB48F70Dd10a468957cDD099047e046AdE8670"
    },
    "dependencies": {
      "WETH": "0xc778417e063141139fce010982780140aa0cd5ab",
      "ZERO_EX_EXCHANGE": "0xbff9493f92a3df4b0429b6d00743b3cfb4c85831",
      "ZERO_EX_ERC20_PROXY": "0xb1408f4c245a23c31b98d2c626777d4c0d766caa",
      "ZERO_EX_ERC721_PROXY": "0xe654aac058bfbf9f83fcaee7793311dd82f6ddb4"
    }
  },
  "50-development": {
    "human_friendly_name": "test-rpc-development",
    "addresses": {
      "IM_Beacon": "0x25B8Fe1DE9dAf8BA351890744FF28cf7dFa8f5e3",
      "IM_Oracle_ETHUSDMock": "0xcdB594a32B1CC3479d8746279712c39D18a07FC0",
      "IM_Processor": "0x1E2F9E10D02a6b8F8f69fcBf515e75039D2EA30d",
      "IM_TestVendor": "0x07f96Aa816C1F244CbC6ef114bB2b023Ba54a2EB",
      "IM_Escrow": "0x6A4A62E5A7eD13c361b176A5F62C2eE620Ac0DF8",
      "IM_Escrow_CreditCard": "0x6DfFF22588BE9b3ef8cf0aD6Dc9B84796F9fB45f",
      "GU_Cards": "0xF22469F31527adc53284441bae1665A7b9214DBA",
      "GU_OpenMinter": "0xE86bB98fcF9BFf3512C74589B78Fb168200CC546",
      "GU_Fusing": "0xDc688D29394a3f1E6f1E5100862776691afAf3d2",
      "GU_PromoFactory": "0xb7C9b454221E26880Eb9C3101B3295cA7D8279EF",
      "GU_S1_Vendor": "0x32EeCaF51DFEA9618e9Bc94e9fBFDdB1bBdcbA15",
      "GU_S1_Raffle": "0x7e3f4E1deB8D3A05d9d2DA87d9521268D0Ec3239",
      "GU_S1_Sale": "0x04B5dAdd2c0D6a261bfafBc964E0cAc48585dEF3",
      "GU_S1_Referral": "0x8726C7414ac023D23348326B47AF3205185Fd035",
      "GU_S1_Epic_Pack": "0x4112f5fc3f737e813ca8cC1A48D1da3dc8719435",
      "GU_S1_Rare_Pack": "0x7Bf7bb74C43dc141293aFf12A2D7DE350E9b09E0",
      "GU_S1_Shiny_Pack": "0x6346e3A22D2EF8feE3B3c2171367490e52d81C52",
      "GU_S1_Legendary_Pack": "0xAA86dDA78E9434acA114b6676Fc742A18d15a1CC"
    },
    "dependencies": {
      "ZERO_EX_EXCHANGE": "0x48bacb9266a570d521063ef5dd96e61686dbe788",
      "ZERO_EX_ERC20_PROXY": "0x1dc4c1cefef38a777b15aa20260a54e584b16c48",
      "ZERO_EX_ERC721_PROXY": "0x1d7022f5b17d2f8b695918fb48fa1089c9f85401",
      "WETH": "0x0b1ba0af832d7c05fd64161e0db78e85978e8082"
    },
    "state": {
      "network_id": 50,
      "last_deployment_stage": null
    }
  }
}