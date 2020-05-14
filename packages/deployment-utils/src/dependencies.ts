/**
 *
 * The keys are numerical network ids to avoid confusion between multiple contract
 * staging environments on the same Ethereum network (main-staging, main-production)
 *
 * 1 = main net
 * 3 = ropsten
 * 42 = kovan
 * 531 = test-rpc
 *
 */

export default {
  HUMAN_FRIENDLY_NAMES: {
    1: 'main-net',
    3: 'ropsten',
    42: 'kovan',
    50: 'test-rpc',
  },
  WETH: {
    1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    3: '0xc778417e063141139fce010982780140aa0cd5ab',
    50: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
  },
  ZERO_EX_EXCHANGE: {
    1: '0x080bf510fcbf18b91105470639e9561022937712',
    3: '0xbff9493f92a3df4b0429b6d00743b3cfb4c85831',
    50: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
  },
  ZERO_EX_ERC20_PROXY: {
    1: '0x95e6f48254609a6ee006f7d493c8e5fb97094cef',
    3: '0xb1408f4c245a23c31b98d2c626777d4c0d766caa',
    50: '0x1dc4c1cefef38a777b15aa20260a54e584b16c48',
  },
  ZERO_EX_ERC721_PROXY: {
    1: '0xefc70a1b18c432bdc64b596838b4d138f6bc6cad',
    3: '0xe654aac058bfbf9f83fcaee7793311dd82f6ddb4',
    50: '0x1d7022f5b17d2f8b695918fb48fa1089c9f85401',
  },
  GU_FUSING_MINTER: {
    1: '',
    3: '0xA80E99f59cd0474F76754Ed5498F2Ef6D6f09951',
    50: '0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb',
  },
  INTENDED_OWNER: {
    1: '0xed824e513aff2545af0b6bb11ec2c503560e7672',
    3: '',
    50: '',
  },
  IM_ESCROW_DESTROYER: {
    1: '',
    3: '0x198e10b883B5A64F4ad46038B7Fb0691D20929eF',
    50: '0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb',
  },
  IM_ESCROW_DESTRUCTION_DELAY: {
    1: '',
    3: '60',
    50: '60',
  },
  IM_ESCROW_CUSTODIAN: {
    1: '',
    3: '0x198e10b883B5A64F4ad46038B7Fb0691D20929eF',
    50: '0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84',
  },
  IM_ESCROW_RELEASE_DELAY: {
    1: '',
    3: '60',
    50: '60',
  },
  IM_PROCESSOR_FIRST_SIGNER: {
    1: '',
    3: '0x198e10b883B5A64F4ad46038B7Fb0691D20929eF',
    50: '0x5409ED021D9299bf6814279A6A1411A7e866A631',
  },
  MEDIANIZER_ADDRESS: {
    1: '0x729d19f657bd0614b4985cf1d82531c67569197b',
    3: '',
    50: '',
  },
};
