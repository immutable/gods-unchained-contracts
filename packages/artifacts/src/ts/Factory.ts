export const Factory = {
  "contractName": "Factory",
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "delegates",
      "outputs": [
        {
          "internalType": "contract Delegates",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "bytecode",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "modules",
      "outputs": [
        {
          "internalType": "contract LimitedModules",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "multiLimiter",
      "outputs": [
        {
          "internalType": "contract MultiLimiter",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract LimitedModules",
          "name": "_modules",
          "type": "address"
        },
        {
          "internalType": "contract Delegates",
          "name": "_delegates",
          "type": "address"
        },
        {
          "internalType": "contract MultiLimiter",
          "name": "_multiLimiter",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_bytecode",
          "type": "bytes"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "WalletCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "_modules",
          "type": "address[]"
        },
        {
          "internalType": "contract Limiter[]",
          "name": "_limiters",
          "type": "address[]"
        }
      ],
      "name": "createProxyWallet",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "proxy",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "metadata": "{\"compiler\":{\"version\":\"0.5.11+commit.c082d0b4\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"constant\":true,\"inputs\":[],\"name\":\"delegates\",\"outputs\":[{\"internalType\":\"contract Delegates\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"isOwner\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"address\",\"name\":\"_owner\",\"type\":\"address\"},{\"internalType\":\"address[]\",\"name\":\"_modules\",\"type\":\"address[]\"},{\"internalType\":\"contract Limiter[]\",\"name\":\"_limiters\",\"type\":\"address[]\"}],\"name\":\"createProxyWallet\",\"outputs\":[{\"internalType\":\"address payable\",\"name\":\"proxy\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"bytecode\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"modules\",\"outputs\":[{\"internalType\":\"contract LimitedModules\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"multiLimiter\",\"outputs\":[{\"internalType\":\"contract MultiLimiter\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract LimitedModules\",\"name\":\"_modules\",\"type\":\"address\"},{\"internalType\":\"contract Delegates\",\"name\":\"_delegates\",\"type\":\"address\"},{\"internalType\":\"contract MultiLimiter\",\"name\":\"_multiLimiter\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"_bytecode\",\"type\":\"bytes\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"wallet\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"WalletCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"}],\"devdoc\":{\"methods\":{\"isOwner()\":{\"details\":\"Returns true if the caller is the current owner.\"},\"owner()\":{\"details\":\"Returns the address of the current owner.\"},\"renounceOwnership()\":{\"details\":\"Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.\"},\"transferOwnership(address)\":{\"details\":\"Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.\"}}},\"userdoc\":{\"methods\":{}}},\"settings\":{\"compilationTarget\":{\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Factory.sol\":\"Factory\"},\"evmVersion\":\"petersburg\",\"libraries\":{},\"optimizer\":{\"enabled\":true,\"runs\":200},\"remappings\":[]},\"sources\":{\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Factory.sol\":{\"keccak256\":\"0x11ef3524ed2667a7934363cc3345ebebd366f5ad3a7ec693a66677a8f11f16b7\",\"urls\":[\"bzz-raw://7308e9406f145c1829b30335d4c24037f35c1a32f933ce69b8d3c6883fcfe631\",\"dweb:/ipfs/QmfKxDR1VGtbSbtN71DxhnBqz8q1gPJqTiHPaodQmT5gYL\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Proxy.sol\":{\"keccak256\":\"0xa00f8de5f8e7b6e3976abd0a04a5894bc89eda0d7c4bfdf0ebaed778029579bf\",\"urls\":[\"bzz-raw://1b99b9476f87ad4c244b6b446ea1aba7a7e912d4a7e9a48870e1ac83bb069f36\",\"dweb:/ipfs/QmcWKoKQRJAyUkgGfj1Cf8tMpjHd7aVmkGh4fX5XT6goJ3\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/ProxyData.sol\":{\"keccak256\":\"0x8b57646f6fad9431d2d6dd24359e5bbe8f198360c967f47c3082d977a4283e90\",\"urls\":[\"bzz-raw://63fe6dd765615945bca7cd8b71b30df9e5798b5306dafab83f0b631e66b5b190\",\"dweb:/ipfs/QmSPVkS6AFZ5Dnn5bQdom7vNR9knhdvxxvVTxcZqvAnEf1\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Wallet.sol\":{\"keccak256\":\"0x8b747be9a3103e4e1863ce31c53e707325d132f4b7568e318235b8d9ab06afbb\",\"urls\":[\"bzz-raw://1ba1765dfc8b658420b155f8e1f6fb480ca4e80ec240f47bbde076be4bb7c3cb\",\"dweb:/ipfs/QmPra13QaZJwUEH9ENRZnimvd792Xy5CxMCpuzEz8bVhpy\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/control/Registry.sol\":{\"keccak256\":\"0x3d8c558d4f9fc039a394125caad0ceaf9a3333431b116ea540d21c908bcc5091\",\"urls\":[\"bzz-raw://2a0bc4677b5109296d491f112ffb63a8eae22b234e62693ed8266dcc2746b9d5\",\"dweb:/ipfs/QmTPKVmVQic5xabyr8pEt5cR72oqDtfPfdXbQhXDqD5tC5\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/delegates/Delegates.sol\":{\"keccak256\":\"0xc26d545bafc869f085f9153fc70594e5e8c34dea45288eff0403bb589cbc67e0\",\"urls\":[\"bzz-raw://08ff7568b730c1f8b9d3b530e67767180b02717612d85ed2e55c6439056e4961\",\"dweb:/ipfs/Qmd5QriPSDxPvvX2hJfGjeaDPcxykRuUpiHnJTtJxQbz3D\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/interfaces/ERCProxy.sol\":{\"keccak256\":\"0x0cdb0f511fe2ec57d46c79ab23632d3087554800e00a96c0c679b8d62825dda0\",\"urls\":[\"bzz-raw://f4c7b4befe25636f5b03ee3068f11753381d7fd1983edc4c080bc4134f3f41b9\",\"dweb:/ipfs/QmTWkndVjA8NdrxeWnheHWfKgMhJYWXnEmCzv9FDVXgH2S\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/limiters/BaseLimiter.sol\":{\"keccak256\":\"0x27a1d475925ccb50f265eae5adc353e9b2e031e2e4f414f3bf2e972039bd2df7\",\"urls\":[\"bzz-raw://e330647e80643dbda5d53a1ef3338f1a8b920f5066c8d0b46028217afa1ed536\",\"dweb:/ipfs/QmepCdu4C3JzwLBczp32GRTfY2PyqhcbwyCjEvxdH5MHgp\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/limiters/Limiter.sol\":{\"keccak256\":\"0xc0c16ee6db0951e68985de4480ab0d98597c8469372a30e482e4873ec1c47fba\",\"urls\":[\"bzz-raw://3bd5003a0d1caa2377088bfa7018cc9fff11732bad6675aed0e7684f45b4d4f0\",\"dweb:/ipfs/QmQGfjXpjAVMAVySqLqyNkMk8cMQ37SuqgbRLPuU6Waq8h\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/limiters/MultiLimiter.sol\":{\"keccak256\":\"0xe99d8c1a5241115a967b704ea0f7710b2707fdda513943fbc79a7bc92f6d54a0\",\"urls\":[\"bzz-raw://4a2f42d183d20c5f68b84f1efa7e46eae7d7f408fb09554986bf554fc8342288\",\"dweb:/ipfs/Qmaz8aZYCUozaCXmn9ioZoRmwChne7oKrfwq7HPYnrNXn8\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/modules/LimitedModules.sol\":{\"keccak256\":\"0x3c0de5265164f76fa680669c7178a98ab16f8f64e4c7c9ce281a089ff4b9307b\",\"urls\":[\"bzz-raw://5c329a2f916d58be524893ebfe8760a3a573e232707f21e2f36d4bb0228e50c5\",\"dweb:/ipfs/QmP1P3Yj2jGLQ9m5cBdHNaD7NXh5TrGjaq3g2rLZHatEmS\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/modules/Module.sol\":{\"keccak256\":\"0x4bf61400859a03bbaf969d3c61a572af4ee67c75968027e13bc4d6dadaf126ac\",\"urls\":[\"bzz-raw://74c560c90e3f25428535e83c52c2e4efa17c98ced3d3dd24fb2de8b6fef9dbd1\",\"dweb:/ipfs/QmXMrPymSzuHpMiopZe6Mk8LH1jCwtuCKdHEvLwe4UdsaW\"]},\"/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/modules/Modules.sol\":{\"keccak256\":\"0x04632041e79c0070e10f27f24ea7974514e4eb0603469b49a96006f9573d5dce\",\"urls\":[\"bzz-raw://c09abae08f52e86f536598d7b4fd2361d21d86f3c8070a4772c733332cfff7ac\",\"dweb:/ipfs/QmQUPhjY3B7morytHDy4Z5vu5gbgKF2Rmwp839QRHfyeUT\"]},\"@openzeppelin/contracts/GSN/Context.sol\":{\"keccak256\":\"0x90a3995645af7562d84b9d69363ffa5ae7217714ab61e951bf7bc450f40e4061\",\"urls\":[\"bzz-raw://216ef9d6b614db4eb46970b4e84903f2534a45572dd30a79f0041f1a5830f436\",\"dweb:/ipfs/QmNPrJ4MWKUAWzKXpUqeyKRUfosaoANZAqXgvepdrCwZAG\"]},\"@openzeppelin/contracts/ownership/Ownable.sol\":{\"keccak256\":\"0xecd8ab29d9a5771c3964d0cd1788c4a5098a0081b20fb275da850a22b1c59806\",\"urls\":[\"bzz-raw://696a75bc2c55407ce8251ccc7d19ecb1b7b2be1796a160a6524312babcc7e3d4\",\"dweb:/ipfs/QmQViKEp3y99h9uhRssE29TmjBKRnFMaoz3eJZ4eggggg2\"]}},\"version\":1}",
  "bytecode": "0x608060405234801561001057600080fd5b50604051610c4c380380610c4c8339818101604052608081101561003357600080fd5b81516020830151604080850151606086018051925194969395919493918201928464010000000082111561006657600080fd5b90830190602082018581111561007b57600080fd5b825164010000000081118282018810171561009557600080fd5b82525081516020918201929091019080838360005b838110156100c25781810151838201526020016100aa565b50505050905090810190601f1680156100ef5780820380516001836020036101000a031916815260200191505b50604052506101089150506001600160e01b036101aa16565b600080546001600160a01b0319166001600160a01b03928316178082556040519216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3600180546001600160a01b038087166001600160a01b03199283161790925560028054868416908316179055600380549285169290911691909117905580516101a09060049060208401906101af565b5050505050610247565b335b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101f057805160ff191683800117855561021d565b8280016001018555821561021d579182015b8281111561021d578251825591602001919060010190610202565b5061022992915061022d565b5090565b6101ac91905b808211156102295760008155600101610233565b6109f6806102566000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063996b0c7611610066578063996b0c76146100ea578063f094000214610221578063f2fde38b1461029e578063f7e80e98146102c4578063fe34b579146102cc57610093565b80636138b19e14610098578063715018a6146100bc5780638da5cb5b146100c65780638f32d59b146100ce575b600080fd5b6100a06102d4565b604080516001600160a01b039092168252519081900360200190f35b6100c46102e3565b005b6100a0610386565b6100d6610395565b604080519115158252519081900360200190f35b6100a06004803603606081101561010057600080fd5b6001600160a01b03823516919081019060408101602082013564010000000081111561012b57600080fd5b82018360208201111561013d57600080fd5b8035906020019184602083028401116401000000008311171561015f57600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092959493602081019350359150506401000000008111156101af57600080fd5b8201836020820111156101c157600080fd5b803590602001918460208302840111640100000000831117156101e357600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295506103b9945050505050565b6102296107e6565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561026357818101518382015260200161024b565b50505050905090810190601f1680156102905780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100c4600480360360208110156102b457600080fd5b50356001600160a01b0316610874565b6100a06108d9565b6100a06108e8565b6002546001600160a01b031681565b6102eb610395565b61033c576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b6000546001600160a01b031690565b600080546001600160a01b03166103aa6108f7565b6001600160a01b031614905090565b60006001600160a01b03841661040f576040805162461bcd60e51b81526020600482015260166024820152751bdddb995c881b5d5cdd081b9bdd081899481b9d5b1b60521b604482015290519081900360640190fd5b6040805133606090811b60208084019190915287821b6bffffffffffffffffffffffff1916603484015230821b60488401528351808403603c018152605c84018086528151918301919091206004805460026001821615610100026000190190911604601f81018590049094028601607c90810190975283835290959394919390929101828280156104e25780601f106104b7576101008083540402835291602001916104e2565b820191906000526020600020905b8154815290600101906020018083116104c557829003601f168201915b50505050509050818151602083016000f59250823b61050057600080fd5b6002546001546040805163184b955960e01b81526001600160a01b038a811660048301529384166024820152918316604483015251859283169163184b955991606480830192600092919082900301818387803b15801561056057600080fd5b505af1158015610574573d6000803e3d6000fd5b5050600154600354604051636082bc9b60e01b81526001600160a01b0386811660048301908152928116604483018190526060602484019081528d5160648501528d51929095169650636082bc9b955087948d94919391929091608401906020808701910280838360005b838110156105f75781810151838201526020016105df565b50505050905001945050505050600060405180830381600087803b15801561061e57600080fd5b505af1158015610632573d6000803e3d6000fd5b505060035460408051631e2d1e7560e11b81526001600160a01b0386811660048301908152602483019384528b5160448401528b51919094169550633c5a3cea945086938b93909290916064909101906020808601910280838360005b838110156106a757818101518382015260200161068f565b505050509050019350505050600060405180830381600087803b1580156106cd57600080fd5b505af11580156106e1573d6000803e3d6000fd5b50506040516001600160a01b03808b169350871691507f5b03bfed1c14a02bdeceb5fa582eb1a5765fc0bc64ca0e6af4c20afc9487f08190600090a3866001600160a01b0316816001600160a01b0316638da5cb5b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561076057600080fd5b505afa158015610774573d6000803e3d6000fd5b505050506040513d602081101561078a57600080fd5b50516001600160a01b0316146107dc576040805162461bcd60e51b81526020600482015260126024820152713bb937b733903bb0b63632ba1037bbb732b960711b604482015290519081900360640190fd5b5050509392505050565b6004805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561086c5780601f106108415761010080835404028352916020019161086c565b820191906000526020600020905b81548152906001019060200180831161084f57829003601f168201915b505050505081565b61087c610395565b6108cd576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6108d6816108fb565b50565b6001546001600160a01b031681565b6003546001600160a01b031681565b3390565b6001600160a01b0381166109405760405162461bcd60e51b815260040180806020018281038252602681526020018061099c6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b039290921691909117905556fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373a265627a7a723158202acf1f58f2459f7a4272256d334e62527d74843b6077a594be7e564a1824ad5a64736f6c634300050b0032",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100935760003560e01c8063996b0c7611610066578063996b0c76146100ea578063f094000214610221578063f2fde38b1461029e578063f7e80e98146102c4578063fe34b579146102cc57610093565b80636138b19e14610098578063715018a6146100bc5780638da5cb5b146100c65780638f32d59b146100ce575b600080fd5b6100a06102d4565b604080516001600160a01b039092168252519081900360200190f35b6100c46102e3565b005b6100a0610386565b6100d6610395565b604080519115158252519081900360200190f35b6100a06004803603606081101561010057600080fd5b6001600160a01b03823516919081019060408101602082013564010000000081111561012b57600080fd5b82018360208201111561013d57600080fd5b8035906020019184602083028401116401000000008311171561015f57600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092959493602081019350359150506401000000008111156101af57600080fd5b8201836020820111156101c157600080fd5b803590602001918460208302840111640100000000831117156101e357600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295506103b9945050505050565b6102296107e6565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561026357818101518382015260200161024b565b50505050905090810190601f1680156102905780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100c4600480360360208110156102b457600080fd5b50356001600160a01b0316610874565b6100a06108d9565b6100a06108e8565b6002546001600160a01b031681565b6102eb610395565b61033c576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b6000546001600160a01b031690565b600080546001600160a01b03166103aa6108f7565b6001600160a01b031614905090565b60006001600160a01b03841661040f576040805162461bcd60e51b81526020600482015260166024820152751bdddb995c881b5d5cdd081b9bdd081899481b9d5b1b60521b604482015290519081900360640190fd5b6040805133606090811b60208084019190915287821b6bffffffffffffffffffffffff1916603484015230821b60488401528351808403603c018152605c84018086528151918301919091206004805460026001821615610100026000190190911604601f81018590049094028601607c90810190975283835290959394919390929101828280156104e25780601f106104b7576101008083540402835291602001916104e2565b820191906000526020600020905b8154815290600101906020018083116104c557829003601f168201915b50505050509050818151602083016000f59250823b61050057600080fd5b6002546001546040805163184b955960e01b81526001600160a01b038a811660048301529384166024820152918316604483015251859283169163184b955991606480830192600092919082900301818387803b15801561056057600080fd5b505af1158015610574573d6000803e3d6000fd5b5050600154600354604051636082bc9b60e01b81526001600160a01b0386811660048301908152928116604483018190526060602484019081528d5160648501528d51929095169650636082bc9b955087948d94919391929091608401906020808701910280838360005b838110156105f75781810151838201526020016105df565b50505050905001945050505050600060405180830381600087803b15801561061e57600080fd5b505af1158015610632573d6000803e3d6000fd5b505060035460408051631e2d1e7560e11b81526001600160a01b0386811660048301908152602483019384528b5160448401528b51919094169550633c5a3cea945086938b93909290916064909101906020808601910280838360005b838110156106a757818101518382015260200161068f565b505050509050019350505050600060405180830381600087803b1580156106cd57600080fd5b505af11580156106e1573d6000803e3d6000fd5b50506040516001600160a01b03808b169350871691507f5b03bfed1c14a02bdeceb5fa582eb1a5765fc0bc64ca0e6af4c20afc9487f08190600090a3866001600160a01b0316816001600160a01b0316638da5cb5b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561076057600080fd5b505afa158015610774573d6000803e3d6000fd5b505050506040513d602081101561078a57600080fd5b50516001600160a01b0316146107dc576040805162461bcd60e51b81526020600482015260126024820152713bb937b733903bb0b63632ba1037bbb732b960711b604482015290519081900360640190fd5b5050509392505050565b6004805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561086c5780601f106108415761010080835404028352916020019161086c565b820191906000526020600020905b81548152906001019060200180831161084f57829003601f168201915b505050505081565b61087c610395565b6108cd576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6108d6816108fb565b50565b6001546001600160a01b031681565b6003546001600160a01b031681565b3390565b6001600160a01b0381166109405760405162461bcd60e51b815260040180806020018281038252602681526020018061099c6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b039290921691909117905556fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373a265627a7a723158202acf1f58f2459f7a4272256d334e62527d74843b6077a594be7e564a1824ad5a64736f6c634300050b0032",
  "sourceMap": "205:1556:49:-;;;468:303;8:9:-1;5:2;;;30:1;27;20:12;5:2;468:303:49;;;;;;;;;;;;;;;13:3:-1;8;5:12;2:2;;;30:1;27;20:12;2:2;468:303:49;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;19:11:-1;11:20;;8:2;;;44:1;41;34:12;8:2;62:21;;;;123:4;114:14;;138:31;;;135:2;;;182:1;179;172:12;135:2;213:10;;261:11;244:29;;285:43;;;282:58;-1:-1;233:115;230:2;;;361:1;358;351:12;230:2;372:25;;-1:-1;468:303:49;;420:4:-1;411:14;;;;468:303:49;;;;;411:14:-1;468:303:49;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;90:11;;;84:18;71:11;;;64:39;52:2;45:10;8:100;;;12:14;468:303:49;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;468:303:49;;-1:-1:-1;707:12:91;;-1:-1:-1;;;;;;;707:10:91;:12;:::i;:::-;698:6;:21;;-1:-1:-1;;;;;;698:21:91;-1:-1:-1;;;;;698:21:91;;;;;;;734:40;;767:6;;;734:40;;698:6;;734:40;646:7:49;:18;;-1:-1:-1;;;;;646:18:49;;;-1:-1:-1;;;;;;646:18:49;;;;;;;674:9;:22;;;;;;;;;;;706:12;:28;;;;;;;;;;;;;;;744:20;;;;:8;;:20;;;;;:::i;:::-;;468:303;;;;205:1556;;788:96:84;867:10;788:96;;:::o;205:1556:49:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;205:1556:49;;;-1:-1:-1;205:1556:49;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;",
  "deployedSourceMap": "205:1556:49:-;;;;8:9:-1;5:2;;;30:1;27;20:12;5:2;205:1556:49;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;275:26;;;:::i;:::-;;;;-1:-1:-1;;;;;275:26:49;;;;;;;;;;;;;;1642:137:91;;;:::i;:::-;;857:77;;;:::i;1208:92::-;;;:::i;:::-;;;;;;;;;;;;;;;;;;823:936:49;;;;;;13:2:-1;8:3;5:11;2:2;;;29:1;26;19:12;2:2;-1:-1;;;;;823:936:49;;;;;;;;;;;;;;;21:11:-1;5:28;;2:2;;;46:1;43;36:12;2:2;823:936:49;;35:9:-1;28:4;12:14;8:25;5:40;2:2;;;58:1;55;48:12;2:2;823:936:49;;;;;;101:9:-1;95:2;81:12;77:21;67:8;63:36;60:51;39:11;25:12;22:29;11:108;8:2;;;132:1;129;122:12;8:2;823:936:49;;;;;;;;;;;;;;;;;;;;;;;;;;;;;30:3:-1;22:6;14;1:33;99:1;81:16;;74:27;;;;-1:-1;823:936:49;;;;;;;;-1:-1:-1;823:936:49;;-1:-1:-1;;21:11;5:28;;2:2;;;46:1;43;36:12;2:2;823:936:49;;35:9:-1;28:4;12:14;8:25;5:40;2:2;;;58:1;55;48:12;2:2;823:936:49;;;;;;101:9:-1;95:2;81:12;77:21;67:8;63:36;60:51;39:11;25:12;22:29;11:108;8:2;;;132:1;129;122:12;8:2;823:936:49;;;;;;;;;;;;;;;;;;;;;;;;;;;;;30:3:-1;22:6;14;1:33;99:1;81:16;;74:27;;;;-1:-1;823:936:49;;-1:-1:-1;823:936:49;;-1:-1:-1;;;;;823:936:49:i;345:21::-;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;8:100:-1;33:3;30:1;27:10;8:100;;;90:11;;;84:18;71:11;;;64:39;52:2;45:10;8:100;;;12:14;345:21:49;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1928:107:91;;;;;;13:2:-1;8:3;5:11;2:2;;;29:1;26;19:12;2:2;-1:-1;1928:107:91;-1:-1:-1;;;;;1928:107:91;;:::i;240:29:49:-;;;:::i;307:32::-;;;:::i;275:26::-;;;-1:-1:-1;;;;;275:26:49;;:::o;1642:137:91:-;1061:9;:7;:9::i;:::-;1053:54;;;;;-1:-1:-1;;;1053:54:91;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1740:1;1724:6;;1703:40;;-1:-1:-1;;;;;1724:6:91;;;;1703:40;;1740:1;;1703:40;1770:1;1753:19;;-1:-1:-1;;;;;;1753:19:91;;;1642:137::o;857:77::-;895:7;921:6;-1:-1:-1;;;;;921:6:91;857:77;:::o;1208:92::-;1248:4;1287:6;;-1:-1:-1;;;;;1287:6:91;1271:12;:10;:12::i;:::-;-1:-1:-1;;;;;1271:22:91;;1264:29;;1208:92;:::o;823:936:49:-;983:21;-1:-1:-1;;;;;1028:20:49;;1020:55;;;;;-1:-1:-1;;;1020:55:49;;;;;;;;;;;;-1:-1:-1;;;1020:55:49;;;;;;;;;;;;;;;1110:51;;;1127:10;1110:51;;;;;;;;;;;;;;;-1:-1:-1;;1110:51:49;;;;;1155:4;1110:51;;;;;;;;26:21:-1;;;22:32;;6:49;;1110:51:49;;;;;;1100:62;;;;;;;;;1193:8;1172:29;;;;;;;;;-1:-1:-1;;1172:29:49;;;;;;;;;;;;;;;;;;;;;;;;;;1100:62;;1110:51;;;;1193:8;;1172:29;;1193:8;1172:29;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1351:4;1343:5;1337:12;1330:4;1323:5;1319:16;1316:1;1308:48;1299:57;;1391:5;1379:18;1369:2;;1427:1;1424;1417:12;1369:2;1523:9;;;1534:7;1503:39;;;-1:-1:-1;;;1503:39:49;;-1:-1:-1;;;;;1503:39:49;;;;;;;1523:9;;;1503:39;;;;1534:7;;;1503:39;;;;;1486:5;;1503:11;;;;;:39;;;;;1463:13;;1503:39;;;;;;;1463:13;1503:11;:39;;;5:2:-1;;;;30:1;27;20:12;5:2;1503:39:49;;;;8:9:-1;5:2;;;45:16;42:1;39;24:38;77:16;74:1;67:27;5:2;-1:-1;;1552:7:49;;1583:12;;1552:44;;-1:-1:-1;;;1552:44:49;;-1:-1:-1;;;;;1552:44:49;;;;;;;;;1583:12;;;1552:44;;;;;;;;;;;;;;;;;;;;;:7;;;;;-1:-1:-1;1552:12:49;;-1:-1:-1;1565:6:49;;1573:8;;1583:12;;1552:44;;;;;;;;;;;;;;;;:7;8:100:-1;33:3;30:1;27:10;8:100;;;90:11;;;84:18;71:11;;;64:39;52:2;45:10;8:100;;;12:14;1552:44:49;;;;;;;;;;;;;;;;;;;;;;;;8:9:-1;5:2;;;30:1;27;20:12;5:2;1552:44:49;;;;8:9:-1;5:2;;;45:16;42:1;39;24:38;77:16;74:1;67:27;5:2;-1:-1;;1606:12:49;;:36;;;-1:-1:-1;;;1606:36:49;;-1:-1:-1;;;;;1606:36:49;;;;;;;;;;;;;;;;;;;;;;;:12;;;;;-1:-1:-1;1606:17:49;;-1:-1:-1;1624:6:49;;1632:9;;1606:36;;;;;;;;;;;;;;;;;;:12;8:100:-1;33:3;30:1;27:10;8:100;;;90:11;;;84:18;71:11;;;64:39;52:2;45:10;8:100;;;12:14;1606:36:49;;;;;;;;;;;;;;;;;;;;;;;8:9:-1;5:2;;;30:1;27;20:12;5:2;1606:36:49;;;;8:9:-1;5:2;;;45:16;42:1;39;24:38;77:16;74:1;67:27;5:2;-1:-1;;1658:28:49;;-1:-1:-1;;;;;1658:28:49;;;;-1:-1:-1;1658:28:49;;;-1:-1:-1;1658:28:49;;;;;1722:6;-1:-1:-1;;;;;1704:24:49;:6;-1:-1:-1;;;;;1704:12:49;;:14;;;;;;;;;;;;;;;;;;;;;;8:9:-1;5:2;;;30:1;27;20:12;5:2;1704:14:49;;;;8:9:-1;5:2;;;45:16;42:1;39;24:38;77:16;74:1;67:27;5:2;1704:14:49;;;;;;;13:2:-1;8:3;5:11;2:2;;;29:1;26;19:12;2:2;-1:-1;1704:14:49;-1:-1:-1;;;;;1704:24:49;;1696:55;;;;;-1:-1:-1;;;1696:55:49;;;;;;;;;;;;-1:-1:-1;;;1696:55:49;;;;;;;;;;;;;;;823:936;;;;;;;;:::o;345:21::-;;;;;;;;;;;;;;;-1:-1:-1;;345:21:49;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;1928:107:91:-;1061:9;:7;:9::i;:::-;1053:54;;;;;-1:-1:-1;;;1053:54:91;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2000:28;2019:8;2000:18;:28::i;:::-;1928:107;:::o;240:29:49:-;;;-1:-1:-1;;;;;240:29:49;;:::o;307:32::-;;;-1:-1:-1;;;;;307:32:49;;:::o;788:96:84:-;867:10;788:96;:::o;2136:225:91:-;-1:-1:-1;;;;;2209:22:91;;2201:73;;;;-1:-1:-1;;;2201:73:91;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2310:6;;;2289:38;;-1:-1:-1;;;;;2289:38:91;;;;2310:6;;;2289:38;;;2337:6;:17;;-1:-1:-1;;;;;;2337:17:91;-1:-1:-1;;;;;2337:17:91;;;;;;;;;;2136:225::o",
  "source": "pragma solidity ^0.5.8;\n\nimport \"@openzeppelin/contracts/ownership/Ownable.sol\";\n\nimport \"./Proxy.sol\";\nimport \"./Wallet.sol\";\nimport \"./modules/LimitedModules.sol\";\nimport \"./limiters/MultiLimiter.sol\";\n\ncontract Factory is Ownable {\n\n    LimitedModules public modules;\n    Delegates public delegates;\n    MultiLimiter public multiLimiter;\n    bytes public bytecode;\n\n    event WalletCreated(\n        address indexed wallet,\n        address indexed owner\n    );\n\n    constructor(\n        LimitedModules _modules,\n        Delegates _delegates,\n        MultiLimiter _multiLimiter,\n        bytes memory _bytecode\n    )\n        public\n    {\n        modules = _modules;\n        delegates = _delegates;\n        multiLimiter = _multiLimiter;\n        bytecode = _bytecode;\n    }\n\n    // TODO: limit who can call this function\n    function createProxyWallet(\n        address _owner,\n        address[] memory _modules,\n        Limiter[] memory _limiters\n    )\n        public\n        returns (address payable proxy)\n    {\n        require(_owner != address(0), \"owner must not be null\");\n        bytes32 salt = keccak256(abi.encodePacked(msg.sender, _owner, address(this)));\n        bytes memory _code = bytecode;\n\n        // solium-disable-next-line security/no-inline-assembly\n        assembly {\n            proxy := create2(0, add(_code, 0x20), mload(_code), salt)\n            if iszero(extcodesize(proxy)) {\n                revert(0, 0)\n            }\n        }\n\n        Wallet wallet = Wallet(proxy);\n\n        wallet.init(_owner, delegates, modules);\n        modules.init(wallet, _modules, multiLimiter);\n        multiLimiter.init(wallet, _limiters);\n\n        emit WalletCreated(proxy, _owner);\n        require(wallet.owner() == _owner, \"wrong wallet owner\");\n\n    }\n}\n",
  "sourcePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Factory.sol",
  "ast": {
    "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Factory.sol",
    "exportedSymbols": {
      "Factory": [
        11120
      ]
    },
    "id": 11121,
    "nodeType": "SourceUnit",
    "nodes": [
      {
        "id": 10985,
        "literals": [
          "solidity",
          "^",
          "0.5",
          ".8"
        ],
        "nodeType": "PragmaDirective",
        "src": "0:23:49"
      },
      {
        "absolutePath": "@openzeppelin/contracts/ownership/Ownable.sol",
        "file": "@openzeppelin/contracts/ownership/Ownable.sol",
        "id": 10986,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 17378,
        "src": "25:55:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Proxy.sol",
        "file": "./Proxy.sol",
        "id": 10987,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 11181,
        "src": "82:21:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Wallet.sol",
        "file": "./Wallet.sol",
        "id": 10988,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 11515,
        "src": "104:22:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/modules/LimitedModules.sol",
        "file": "./modules/LimitedModules.sol",
        "id": 10989,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 14567,
        "src": "127:38:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/limiters/MultiLimiter.sol",
        "file": "./limiters/MultiLimiter.sol",
        "id": 10990,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 13158,
        "src": "166:37:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "baseContracts": [
          {
            "arguments": null,
            "baseName": {
              "contractScope": null,
              "id": 10991,
              "name": "Ownable",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 17377,
              "src": "225:7:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_Ownable_$17377",
                "typeString": "contract Ownable"
              }
            },
            "id": 10992,
            "nodeType": "InheritanceSpecifier",
            "src": "225:7:49"
          }
        ],
        "contractDependencies": [
          16777,
          17377
        ],
        "contractKind": "contract",
        "documentation": null,
        "fullyImplemented": true,
        "id": 11120,
        "linearizedBaseContracts": [
          11120,
          17377,
          16777
        ],
        "name": "Factory",
        "nodeType": "ContractDefinition",
        "nodes": [
          {
            "constant": false,
            "id": 10994,
            "name": "modules",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "240:29:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_contract$_LimitedModules_$14566",
              "typeString": "contract LimitedModules"
            },
            "typeName": {
              "contractScope": null,
              "id": 10993,
              "name": "LimitedModules",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 14566,
              "src": "240:14:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_LimitedModules_$14566",
                "typeString": "contract LimitedModules"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 10996,
            "name": "delegates",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "275:26:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_contract$_Delegates_$12109",
              "typeString": "contract Delegates"
            },
            "typeName": {
              "contractScope": null,
              "id": 10995,
              "name": "Delegates",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 12109,
              "src": "275:9:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_Delegates_$12109",
                "typeString": "contract Delegates"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 10998,
            "name": "multiLimiter",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "307:32:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_contract$_MultiLimiter_$13157",
              "typeString": "contract MultiLimiter"
            },
            "typeName": {
              "contractScope": null,
              "id": 10997,
              "name": "MultiLimiter",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 13157,
              "src": "307:12:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                "typeString": "contract MultiLimiter"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 11000,
            "name": "bytecode",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "345:21:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_bytes_storage",
              "typeString": "bytes"
            },
            "typeName": {
              "id": 10999,
              "name": "bytes",
              "nodeType": "ElementaryTypeName",
              "src": "345:5:49",
              "typeDescriptions": {
                "typeIdentifier": "t_bytes_storage_ptr",
                "typeString": "bytes"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "anonymous": false,
            "documentation": null,
            "id": 11006,
            "name": "WalletCreated",
            "nodeType": "EventDefinition",
            "parameters": {
              "id": 11005,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11002,
                  "indexed": true,
                  "name": "wallet",
                  "nodeType": "VariableDeclaration",
                  "scope": 11006,
                  "src": "402:22:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 11001,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "402:7:49",
                    "stateMutability": "nonpayable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11004,
                  "indexed": true,
                  "name": "owner",
                  "nodeType": "VariableDeclaration",
                  "scope": 11006,
                  "src": "434:21:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 11003,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "434:7:49",
                    "stateMutability": "nonpayable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "392:69:49"
            },
            "src": "373:89:49"
          },
          {
            "body": {
              "id": 11033,
              "nodeType": "Block",
              "src": "636:135:49",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11019,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11017,
                      "name": "modules",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 10994,
                      "src": "646:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_LimitedModules_$14566",
                        "typeString": "contract LimitedModules"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11018,
                      "name": "_modules",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11008,
                      "src": "656:8:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_LimitedModules_$14566",
                        "typeString": "contract LimitedModules"
                      }
                    },
                    "src": "646:18:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_LimitedModules_$14566",
                      "typeString": "contract LimitedModules"
                    }
                  },
                  "id": 11020,
                  "nodeType": "ExpressionStatement",
                  "src": "646:18:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11023,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11021,
                      "name": "delegates",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 10996,
                      "src": "674:9:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Delegates_$12109",
                        "typeString": "contract Delegates"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11022,
                      "name": "_delegates",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11010,
                      "src": "686:10:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Delegates_$12109",
                        "typeString": "contract Delegates"
                      }
                    },
                    "src": "674:22:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_Delegates_$12109",
                      "typeString": "contract Delegates"
                    }
                  },
                  "id": 11024,
                  "nodeType": "ExpressionStatement",
                  "src": "674:22:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11027,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11025,
                      "name": "multiLimiter",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 10998,
                      "src": "706:12:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                        "typeString": "contract MultiLimiter"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11026,
                      "name": "_multiLimiter",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11012,
                      "src": "721:13:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                        "typeString": "contract MultiLimiter"
                      }
                    },
                    "src": "706:28:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                      "typeString": "contract MultiLimiter"
                    }
                  },
                  "id": 11028,
                  "nodeType": "ExpressionStatement",
                  "src": "706:28:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11031,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11029,
                      "name": "bytecode",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11000,
                      "src": "744:8:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes_storage",
                        "typeString": "bytes storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11030,
                      "name": "_bytecode",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11014,
                      "src": "755:9:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes_memory_ptr",
                        "typeString": "bytes memory"
                      }
                    },
                    "src": "744:20:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes_storage",
                      "typeString": "bytes storage ref"
                    }
                  },
                  "id": 11032,
                  "nodeType": "ExpressionStatement",
                  "src": "744:20:49"
                }
              ]
            },
            "documentation": null,
            "id": 11034,
            "implemented": true,
            "kind": "constructor",
            "modifiers": [],
            "name": "",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 11015,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11008,
                  "name": "_modules",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "489:23:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_contract$_LimitedModules_$14566",
                    "typeString": "contract LimitedModules"
                  },
                  "typeName": {
                    "contractScope": null,
                    "id": 11007,
                    "name": "LimitedModules",
                    "nodeType": "UserDefinedTypeName",
                    "referencedDeclaration": 14566,
                    "src": "489:14:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_LimitedModules_$14566",
                      "typeString": "contract LimitedModules"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11010,
                  "name": "_delegates",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "522:20:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_contract$_Delegates_$12109",
                    "typeString": "contract Delegates"
                  },
                  "typeName": {
                    "contractScope": null,
                    "id": 11009,
                    "name": "Delegates",
                    "nodeType": "UserDefinedTypeName",
                    "referencedDeclaration": 12109,
                    "src": "522:9:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_Delegates_$12109",
                      "typeString": "contract Delegates"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11012,
                  "name": "_multiLimiter",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "552:26:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                    "typeString": "contract MultiLimiter"
                  },
                  "typeName": {
                    "contractScope": null,
                    "id": 11011,
                    "name": "MultiLimiter",
                    "nodeType": "UserDefinedTypeName",
                    "referencedDeclaration": 13157,
                    "src": "552:12:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                      "typeString": "contract MultiLimiter"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11014,
                  "name": "_bytecode",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "588:22:49",
                  "stateVariable": false,
                  "storageLocation": "memory",
                  "typeDescriptions": {
                    "typeIdentifier": "t_bytes_memory_ptr",
                    "typeString": "bytes"
                  },
                  "typeName": {
                    "id": 11013,
                    "name": "bytes",
                    "nodeType": "ElementaryTypeName",
                    "src": "588:5:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes_storage_ptr",
                      "typeString": "bytes"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "479:137:49"
            },
            "returnParameters": {
              "id": 11016,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "636:0:49"
            },
            "scope": 11120,
            "src": "468:303:49",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 11118,
              "nodeType": "Block",
              "src": "1010:749:49",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        "id": 11052,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "id": 11048,
                          "name": "_owner",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 11036,
                          "src": "1028:6:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "!=",
                        "rightExpression": {
                          "argumentTypes": null,
                          "arguments": [
                            {
                              "argumentTypes": null,
                              "hexValue": "30",
                              "id": 11050,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "kind": "number",
                              "lValueRequested": false,
                              "nodeType": "Literal",
                              "src": "1046:1:49",
                              "subdenomination": null,
                              "typeDescriptions": {
                                "typeIdentifier": "t_rational_0_by_1",
                                "typeString": "int_const 0"
                              },
                              "value": "0"
                            }
                          ],
                          "expression": {
                            "argumentTypes": [
                              {
                                "typeIdentifier": "t_rational_0_by_1",
                                "typeString": "int_const 0"
                              }
                            ],
                            "id": 11049,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "lValueRequested": false,
                            "nodeType": "ElementaryTypeNameExpression",
                            "src": "1038:7:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_type$_t_address_$",
                              "typeString": "type(address)"
                            },
                            "typeName": "address"
                          },
                          "id": 11051,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "typeConversion",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1038:10:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address_payable",
                            "typeString": "address payable"
                          }
                        },
                        "src": "1028:20:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "hexValue": "6f776e6572206d757374206e6f74206265206e756c6c",
                        "id": 11053,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": true,
                        "kind": "string",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "1050:24:49",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_stringliteral_08eaf6b13dd9f2925da9315cd6e983754cd4722a35885a9f3619d9568e99c15b",
                          "typeString": "literal_string \"owner must not be null\""
                        },
                        "value": "owner must not be null"
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        },
                        {
                          "typeIdentifier": "t_stringliteral_08eaf6b13dd9f2925da9315cd6e983754cd4722a35885a9f3619d9568e99c15b",
                          "typeString": "literal_string \"owner must not be null\""
                        }
                      ],
                      "id": 11047,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [
                        19407,
                        19408
                      ],
                      "referencedDeclaration": 19408,
                      "src": "1020:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$_t_string_memory_ptr_$returns$__$",
                        "typeString": "function (bool,string memory) pure"
                      }
                    },
                    "id": 11054,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1020:55:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11055,
                  "nodeType": "ExpressionStatement",
                  "src": "1020:55:49"
                },
                {
                  "assignments": [
                    11057
                  ],
                  "declarations": [
                    {
                      "constant": false,
                      "id": 11057,
                      "name": "salt",
                      "nodeType": "VariableDeclaration",
                      "scope": 11118,
                      "src": "1085:12:49",
                      "stateVariable": false,
                      "storageLocation": "default",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes32",
                        "typeString": "bytes32"
                      },
                      "typeName": {
                        "id": 11056,
                        "name": "bytes32",
                        "nodeType": "ElementaryTypeName",
                        "src": "1085:7:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bytes32",
                          "typeString": "bytes32"
                        }
                      },
                      "value": null,
                      "visibility": "internal"
                    }
                  ],
                  "id": 11069,
                  "initialValue": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "expression": {
                              "argumentTypes": null,
                              "id": 11061,
                              "name": "msg",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 19404,
                              "src": "1127:3:49",
                              "typeDescriptions": {
                                "typeIdentifier": "t_magic_message",
                                "typeString": "msg"
                              }
                            },
                            "id": 11062,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "sender",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": null,
                            "src": "1127:10:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_address_payable",
                              "typeString": "address payable"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 11063,
                            "name": "_owner",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 11036,
                            "src": "1139:6:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "id": 11065,
                                "name": "this",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 19584,
                                "src": "1155:4:49",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_contract$_Factory_$11120",
                                  "typeString": "contract Factory"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_contract$_Factory_$11120",
                                  "typeString": "contract Factory"
                                }
                              ],
                              "id": 11064,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "lValueRequested": false,
                              "nodeType": "ElementaryTypeNameExpression",
                              "src": "1147:7:49",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_address_$",
                                "typeString": "type(address)"
                              },
                              "typeName": "address"
                            },
                            "id": 11066,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "typeConversion",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1147:13:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_address_payable",
                              "typeString": "address payable"
                            },
                            {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            },
                            {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            }
                          ],
                          "expression": {
                            "argumentTypes": null,
                            "id": 11059,
                            "name": "abi",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 19391,
                            "src": "1110:3:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_magic_abi",
                              "typeString": "abi"
                            }
                          },
                          "id": 11060,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "memberName": "encodePacked",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "1110:16:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_abiencodepacked_pure$__$returns$_t_bytes_memory_ptr_$",
                            "typeString": "function () pure returns (bytes memory)"
                          }
                        },
                        "id": 11067,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "1110:51:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bytes_memory_ptr",
                          "typeString": "bytes memory"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bytes_memory_ptr",
                          "typeString": "bytes memory"
                        }
                      ],
                      "id": 11058,
                      "name": "keccak256",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 19398,
                      "src": "1100:9:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_keccak256_pure$_t_bytes_memory_ptr_$returns$_t_bytes32_$",
                        "typeString": "function (bytes memory) pure returns (bytes32)"
                      }
                    },
                    "id": 11068,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1100:62:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes32",
                      "typeString": "bytes32"
                    }
                  },
                  "nodeType": "VariableDeclarationStatement",
                  "src": "1085:77:49"
                },
                {
                  "assignments": [
                    11071
                  ],
                  "declarations": [
                    {
                      "constant": false,
                      "id": 11071,
                      "name": "_code",
                      "nodeType": "VariableDeclaration",
                      "scope": 11118,
                      "src": "1172:18:49",
                      "stateVariable": false,
                      "storageLocation": "memory",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes_memory_ptr",
                        "typeString": "bytes"
                      },
                      "typeName": {
                        "id": 11070,
                        "name": "bytes",
                        "nodeType": "ElementaryTypeName",
                        "src": "1172:5:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bytes_storage_ptr",
                          "typeString": "bytes"
                        }
                      },
                      "value": null,
                      "visibility": "internal"
                    }
                  ],
                  "id": 11073,
                  "initialValue": {
                    "argumentTypes": null,
                    "id": 11072,
                    "name": "bytecode",
                    "nodeType": "Identifier",
                    "overloadedDeclarations": [],
                    "referencedDeclaration": 11000,
                    "src": "1193:8:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes_storage",
                      "typeString": "bytes storage ref"
                    }
                  },
                  "nodeType": "VariableDeclarationStatement",
                  "src": "1172:29:49"
                },
                {
                  "externalReferences": [
                    {
                      "proxy": {
                        "declaration": 11045,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1299:5:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "_code": {
                        "declaration": 11071,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1343:5:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "_code": {
                        "declaration": 11071,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1323:5:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "salt": {
                        "declaration": 11057,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1351:4:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "proxy": {
                        "declaration": 11045,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1391:5:49",
                        "valueSize": 1
                      }
                    }
                  ],
                  "id": 11074,
                  "nodeType": "InlineAssembly",
                  "operations": "{\n    proxy := create2(0, add(_code, 0x20), mload(_code), salt)\n    if iszero(extcodesize(proxy)) { revert(0, 0) }\n}",
                  "src": "1276:177:49"
                },
                {
                  "assignments": [
                    11076
                  ],
                  "declarations": [
                    {
                      "constant": false,
                      "id": 11076,
                      "name": "wallet",
                      "nodeType": "VariableDeclaration",
                      "scope": 11118,
                      "src": "1463:13:49",
                      "stateVariable": false,
                      "storageLocation": "default",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Wallet_$11514",
                        "typeString": "contract Wallet"
                      },
                      "typeName": {
                        "contractScope": null,
                        "id": 11075,
                        "name": "Wallet",
                        "nodeType": "UserDefinedTypeName",
                        "referencedDeclaration": 11514,
                        "src": "1463:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      "value": null,
                      "visibility": "internal"
                    }
                  ],
                  "id": 11080,
                  "initialValue": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11078,
                        "name": "proxy",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11045,
                        "src": "1486:5:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        }
                      ],
                      "id": 11077,
                      "name": "Wallet",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11514,
                      "src": "1479:6:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_type$_t_contract$_Wallet_$11514_$",
                        "typeString": "type(contract Wallet)"
                      }
                    },
                    "id": 11079,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "typeConversion",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1479:13:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_Wallet_$11514",
                      "typeString": "contract Wallet"
                    }
                  },
                  "nodeType": "VariableDeclarationStatement",
                  "src": "1463:29:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11084,
                        "name": "_owner",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11036,
                        "src": "1515:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11085,
                        "name": "delegates",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10996,
                        "src": "1523:9:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Delegates_$12109",
                          "typeString": "contract Delegates"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11086,
                        "name": "modules",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10994,
                        "src": "1534:7:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_LimitedModules_$14566",
                          "typeString": "contract LimitedModules"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        {
                          "typeIdentifier": "t_contract$_Delegates_$12109",
                          "typeString": "contract Delegates"
                        },
                        {
                          "typeIdentifier": "t_contract$_LimitedModules_$14566",
                          "typeString": "contract LimitedModules"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 11081,
                        "name": "wallet",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11076,
                        "src": "1503:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      "id": 11083,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "init",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 11408,
                      "src": "1503:11:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_external_nonpayable$_t_address_$_t_contract$_Delegates_$12109_$_t_contract$_Modules_$15054_$returns$__$",
                        "typeString": "function (address,contract Delegates,contract Modules) external"
                      }
                    },
                    "id": 11087,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1503:39:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11088,
                  "nodeType": "ExpressionStatement",
                  "src": "1503:39:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11092,
                        "name": "wallet",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11076,
                        "src": "1565:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11093,
                        "name": "_modules",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11039,
                        "src": "1573:8:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_array$_t_address_$dyn_memory_ptr",
                          "typeString": "address[] memory"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11094,
                        "name": "multiLimiter",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10998,
                        "src": "1583:12:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                          "typeString": "contract MultiLimiter"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        },
                        {
                          "typeIdentifier": "t_array$_t_address_$dyn_memory_ptr",
                          "typeString": "address[] memory"
                        },
                        {
                          "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                          "typeString": "contract MultiLimiter"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 11089,
                        "name": "modules",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10994,
                        "src": "1552:7:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_LimitedModules_$14566",
                          "typeString": "contract LimitedModules"
                        }
                      },
                      "id": 11091,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "init",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 14383,
                      "src": "1552:12:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_external_nonpayable$_t_contract$_Wallet_$11514_$_t_array$_t_address_$dyn_memory_ptr_$_t_contract$_Limiter_$12298_$returns$__$",
                        "typeString": "function (contract Wallet,address[] memory,contract Limiter) external"
                      }
                    },
                    "id": 11095,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1552:44:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11096,
                  "nodeType": "ExpressionStatement",
                  "src": "1552:44:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11100,
                        "name": "wallet",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11076,
                        "src": "1624:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11101,
                        "name": "_limiters",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11042,
                        "src": "1632:9:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr",
                          "typeString": "contract Limiter[] memory"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        },
                        {
                          "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr",
                          "typeString": "contract Limiter[] memory"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 11097,
                        "name": "multiLimiter",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10998,
                        "src": "1606:12:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                          "typeString": "contract MultiLimiter"
                        }
                      },
                      "id": 11099,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "init",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 12880,
                      "src": "1606:17:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_external_nonpayable$_t_contract$_Wallet_$11514_$_t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr_$returns$__$",
                        "typeString": "function (contract Wallet,contract Limiter[] memory) external"
                      }
                    },
                    "id": 11102,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1606:36:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11103,
                  "nodeType": "ExpressionStatement",
                  "src": "1606:36:49"
                },
                {
                  "eventCall": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11105,
                        "name": "proxy",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11045,
                        "src": "1672:5:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11106,
                        "name": "_owner",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11036,
                        "src": "1679:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        },
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      ],
                      "id": 11104,
                      "name": "WalletCreated",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11006,
                      "src": "1658:13:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_event_nonpayable$_t_address_$_t_address_$returns$__$",
                        "typeString": "function (address,address)"
                      }
                    },
                    "id": 11107,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1658:28:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11108,
                  "nodeType": "EmitStatement",
                  "src": "1653:33:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        "id": 11114,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 11110,
                              "name": "wallet",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 11076,
                              "src": "1704:6:49",
                              "typeDescriptions": {
                                "typeIdentifier": "t_contract$_Wallet_$11514",
                                "typeString": "contract Wallet"
                              }
                            },
                            "id": 11111,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "owner",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 11200,
                            "src": "1704:12:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_external_view$__$returns$_t_address_$",
                              "typeString": "function () view external returns (address)"
                            }
                          },
                          "id": 11112,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1704:14:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "==",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 11113,
                          "name": "_owner",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 11036,
                          "src": "1722:6:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "src": "1704:24:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "hexValue": "77726f6e672077616c6c6574206f776e6572",
                        "id": 11115,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": true,
                        "kind": "string",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "1730:20:49",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_stringliteral_8ee0e224cd3f10f488f1ba0dca395bb443d3c4fd924ec6adfc319b7f8111fe7d",
                          "typeString": "literal_string \"wrong wallet owner\""
                        },
                        "value": "wrong wallet owner"
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        },
                        {
                          "typeIdentifier": "t_stringliteral_8ee0e224cd3f10f488f1ba0dca395bb443d3c4fd924ec6adfc319b7f8111fe7d",
                          "typeString": "literal_string \"wrong wallet owner\""
                        }
                      ],
                      "id": 11109,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [
                        19407,
                        19408
                      ],
                      "referencedDeclaration": 19408,
                      "src": "1696:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$_t_string_memory_ptr_$returns$__$",
                        "typeString": "function (bool,string memory) pure"
                      }
                    },
                    "id": 11116,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1696:55:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11117,
                  "nodeType": "ExpressionStatement",
                  "src": "1696:55:49"
                }
              ]
            },
            "documentation": null,
            "id": 11119,
            "implemented": true,
            "kind": "function",
            "modifiers": [],
            "name": "createProxyWallet",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 11043,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11036,
                  "name": "_owner",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "859:14:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 11035,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "859:7:49",
                    "stateMutability": "nonpayable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11039,
                  "name": "_modules",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "883:25:49",
                  "stateVariable": false,
                  "storageLocation": "memory",
                  "typeDescriptions": {
                    "typeIdentifier": "t_array$_t_address_$dyn_memory_ptr",
                    "typeString": "address[]"
                  },
                  "typeName": {
                    "baseType": {
                      "id": 11037,
                      "name": "address",
                      "nodeType": "ElementaryTypeName",
                      "src": "883:7:49",
                      "stateMutability": "nonpayable",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "id": 11038,
                    "length": null,
                    "nodeType": "ArrayTypeName",
                    "src": "883:9:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_address_$dyn_storage_ptr",
                      "typeString": "address[]"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11042,
                  "name": "_limiters",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "918:26:49",
                  "stateVariable": false,
                  "storageLocation": "memory",
                  "typeDescriptions": {
                    "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr",
                    "typeString": "contract Limiter[]"
                  },
                  "typeName": {
                    "baseType": {
                      "contractScope": null,
                      "id": 11040,
                      "name": "Limiter",
                      "nodeType": "UserDefinedTypeName",
                      "referencedDeclaration": 12298,
                      "src": "918:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Limiter_$12298",
                        "typeString": "contract Limiter"
                      }
                    },
                    "id": 11041,
                    "length": null,
                    "nodeType": "ArrayTypeName",
                    "src": "918:9:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_storage_ptr",
                      "typeString": "contract Limiter[]"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "849:101:49"
            },
            "returnParameters": {
              "id": 11046,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11045,
                  "name": "proxy",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "983:21:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address_payable",
                    "typeString": "address payable"
                  },
                  "typeName": {
                    "id": 11044,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "983:15:49",
                    "stateMutability": "payable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address_payable",
                      "typeString": "address payable"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "982:23:49"
            },
            "scope": 11120,
            "src": "823:936:49",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          }
        ],
        "scope": 11121,
        "src": "205:1556:49"
      }
    ],
    "src": "0:1762:49"
  },
  "legacyAST": {
    "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Factory.sol",
    "exportedSymbols": {
      "Factory": [
        11120
      ]
    },
    "id": 11121,
    "nodeType": "SourceUnit",
    "nodes": [
      {
        "id": 10985,
        "literals": [
          "solidity",
          "^",
          "0.5",
          ".8"
        ],
        "nodeType": "PragmaDirective",
        "src": "0:23:49"
      },
      {
        "absolutePath": "@openzeppelin/contracts/ownership/Ownable.sol",
        "file": "@openzeppelin/contracts/ownership/Ownable.sol",
        "id": 10986,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 17378,
        "src": "25:55:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Proxy.sol",
        "file": "./Proxy.sol",
        "id": 10987,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 11181,
        "src": "82:21:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/Wallet.sol",
        "file": "./Wallet.sol",
        "id": 10988,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 11515,
        "src": "104:22:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/modules/LimitedModules.sol",
        "file": "./modules/LimitedModules.sol",
        "id": 10989,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 14567,
        "src": "127:38:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "absolutePath": "/Users/kerman/immutable/gods-unchained-contracts/packages/contracts/contracts/wallet/limiters/MultiLimiter.sol",
        "file": "./limiters/MultiLimiter.sol",
        "id": 10990,
        "nodeType": "ImportDirective",
        "scope": 11121,
        "sourceUnit": 13158,
        "src": "166:37:49",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "baseContracts": [
          {
            "arguments": null,
            "baseName": {
              "contractScope": null,
              "id": 10991,
              "name": "Ownable",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 17377,
              "src": "225:7:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_Ownable_$17377",
                "typeString": "contract Ownable"
              }
            },
            "id": 10992,
            "nodeType": "InheritanceSpecifier",
            "src": "225:7:49"
          }
        ],
        "contractDependencies": [
          16777,
          17377
        ],
        "contractKind": "contract",
        "documentation": null,
        "fullyImplemented": true,
        "id": 11120,
        "linearizedBaseContracts": [
          11120,
          17377,
          16777
        ],
        "name": "Factory",
        "nodeType": "ContractDefinition",
        "nodes": [
          {
            "constant": false,
            "id": 10994,
            "name": "modules",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "240:29:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_contract$_LimitedModules_$14566",
              "typeString": "contract LimitedModules"
            },
            "typeName": {
              "contractScope": null,
              "id": 10993,
              "name": "LimitedModules",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 14566,
              "src": "240:14:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_LimitedModules_$14566",
                "typeString": "contract LimitedModules"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 10996,
            "name": "delegates",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "275:26:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_contract$_Delegates_$12109",
              "typeString": "contract Delegates"
            },
            "typeName": {
              "contractScope": null,
              "id": 10995,
              "name": "Delegates",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 12109,
              "src": "275:9:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_Delegates_$12109",
                "typeString": "contract Delegates"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 10998,
            "name": "multiLimiter",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "307:32:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_contract$_MultiLimiter_$13157",
              "typeString": "contract MultiLimiter"
            },
            "typeName": {
              "contractScope": null,
              "id": 10997,
              "name": "MultiLimiter",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 13157,
              "src": "307:12:49",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                "typeString": "contract MultiLimiter"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 11000,
            "name": "bytecode",
            "nodeType": "VariableDeclaration",
            "scope": 11120,
            "src": "345:21:49",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_bytes_storage",
              "typeString": "bytes"
            },
            "typeName": {
              "id": 10999,
              "name": "bytes",
              "nodeType": "ElementaryTypeName",
              "src": "345:5:49",
              "typeDescriptions": {
                "typeIdentifier": "t_bytes_storage_ptr",
                "typeString": "bytes"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "anonymous": false,
            "documentation": null,
            "id": 11006,
            "name": "WalletCreated",
            "nodeType": "EventDefinition",
            "parameters": {
              "id": 11005,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11002,
                  "indexed": true,
                  "name": "wallet",
                  "nodeType": "VariableDeclaration",
                  "scope": 11006,
                  "src": "402:22:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 11001,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "402:7:49",
                    "stateMutability": "nonpayable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11004,
                  "indexed": true,
                  "name": "owner",
                  "nodeType": "VariableDeclaration",
                  "scope": 11006,
                  "src": "434:21:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 11003,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "434:7:49",
                    "stateMutability": "nonpayable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "392:69:49"
            },
            "src": "373:89:49"
          },
          {
            "body": {
              "id": 11033,
              "nodeType": "Block",
              "src": "636:135:49",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11019,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11017,
                      "name": "modules",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 10994,
                      "src": "646:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_LimitedModules_$14566",
                        "typeString": "contract LimitedModules"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11018,
                      "name": "_modules",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11008,
                      "src": "656:8:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_LimitedModules_$14566",
                        "typeString": "contract LimitedModules"
                      }
                    },
                    "src": "646:18:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_LimitedModules_$14566",
                      "typeString": "contract LimitedModules"
                    }
                  },
                  "id": 11020,
                  "nodeType": "ExpressionStatement",
                  "src": "646:18:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11023,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11021,
                      "name": "delegates",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 10996,
                      "src": "674:9:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Delegates_$12109",
                        "typeString": "contract Delegates"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11022,
                      "name": "_delegates",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11010,
                      "src": "686:10:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Delegates_$12109",
                        "typeString": "contract Delegates"
                      }
                    },
                    "src": "674:22:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_Delegates_$12109",
                      "typeString": "contract Delegates"
                    }
                  },
                  "id": 11024,
                  "nodeType": "ExpressionStatement",
                  "src": "674:22:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11027,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11025,
                      "name": "multiLimiter",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 10998,
                      "src": "706:12:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                        "typeString": "contract MultiLimiter"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11026,
                      "name": "_multiLimiter",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11012,
                      "src": "721:13:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                        "typeString": "contract MultiLimiter"
                      }
                    },
                    "src": "706:28:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                      "typeString": "contract MultiLimiter"
                    }
                  },
                  "id": 11028,
                  "nodeType": "ExpressionStatement",
                  "src": "706:28:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 11031,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 11029,
                      "name": "bytecode",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11000,
                      "src": "744:8:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes_storage",
                        "typeString": "bytes storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 11030,
                      "name": "_bytecode",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11014,
                      "src": "755:9:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes_memory_ptr",
                        "typeString": "bytes memory"
                      }
                    },
                    "src": "744:20:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes_storage",
                      "typeString": "bytes storage ref"
                    }
                  },
                  "id": 11032,
                  "nodeType": "ExpressionStatement",
                  "src": "744:20:49"
                }
              ]
            },
            "documentation": null,
            "id": 11034,
            "implemented": true,
            "kind": "constructor",
            "modifiers": [],
            "name": "",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 11015,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11008,
                  "name": "_modules",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "489:23:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_contract$_LimitedModules_$14566",
                    "typeString": "contract LimitedModules"
                  },
                  "typeName": {
                    "contractScope": null,
                    "id": 11007,
                    "name": "LimitedModules",
                    "nodeType": "UserDefinedTypeName",
                    "referencedDeclaration": 14566,
                    "src": "489:14:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_LimitedModules_$14566",
                      "typeString": "contract LimitedModules"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11010,
                  "name": "_delegates",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "522:20:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_contract$_Delegates_$12109",
                    "typeString": "contract Delegates"
                  },
                  "typeName": {
                    "contractScope": null,
                    "id": 11009,
                    "name": "Delegates",
                    "nodeType": "UserDefinedTypeName",
                    "referencedDeclaration": 12109,
                    "src": "522:9:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_Delegates_$12109",
                      "typeString": "contract Delegates"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11012,
                  "name": "_multiLimiter",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "552:26:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                    "typeString": "contract MultiLimiter"
                  },
                  "typeName": {
                    "contractScope": null,
                    "id": 11011,
                    "name": "MultiLimiter",
                    "nodeType": "UserDefinedTypeName",
                    "referencedDeclaration": 13157,
                    "src": "552:12:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                      "typeString": "contract MultiLimiter"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11014,
                  "name": "_bytecode",
                  "nodeType": "VariableDeclaration",
                  "scope": 11034,
                  "src": "588:22:49",
                  "stateVariable": false,
                  "storageLocation": "memory",
                  "typeDescriptions": {
                    "typeIdentifier": "t_bytes_memory_ptr",
                    "typeString": "bytes"
                  },
                  "typeName": {
                    "id": 11013,
                    "name": "bytes",
                    "nodeType": "ElementaryTypeName",
                    "src": "588:5:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes_storage_ptr",
                      "typeString": "bytes"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "479:137:49"
            },
            "returnParameters": {
              "id": 11016,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "636:0:49"
            },
            "scope": 11120,
            "src": "468:303:49",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 11118,
              "nodeType": "Block",
              "src": "1010:749:49",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        "id": 11052,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "id": 11048,
                          "name": "_owner",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 11036,
                          "src": "1028:6:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "!=",
                        "rightExpression": {
                          "argumentTypes": null,
                          "arguments": [
                            {
                              "argumentTypes": null,
                              "hexValue": "30",
                              "id": 11050,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "kind": "number",
                              "lValueRequested": false,
                              "nodeType": "Literal",
                              "src": "1046:1:49",
                              "subdenomination": null,
                              "typeDescriptions": {
                                "typeIdentifier": "t_rational_0_by_1",
                                "typeString": "int_const 0"
                              },
                              "value": "0"
                            }
                          ],
                          "expression": {
                            "argumentTypes": [
                              {
                                "typeIdentifier": "t_rational_0_by_1",
                                "typeString": "int_const 0"
                              }
                            ],
                            "id": 11049,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "lValueRequested": false,
                            "nodeType": "ElementaryTypeNameExpression",
                            "src": "1038:7:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_type$_t_address_$",
                              "typeString": "type(address)"
                            },
                            "typeName": "address"
                          },
                          "id": 11051,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "typeConversion",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1038:10:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address_payable",
                            "typeString": "address payable"
                          }
                        },
                        "src": "1028:20:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "hexValue": "6f776e6572206d757374206e6f74206265206e756c6c",
                        "id": 11053,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": true,
                        "kind": "string",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "1050:24:49",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_stringliteral_08eaf6b13dd9f2925da9315cd6e983754cd4722a35885a9f3619d9568e99c15b",
                          "typeString": "literal_string \"owner must not be null\""
                        },
                        "value": "owner must not be null"
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        },
                        {
                          "typeIdentifier": "t_stringliteral_08eaf6b13dd9f2925da9315cd6e983754cd4722a35885a9f3619d9568e99c15b",
                          "typeString": "literal_string \"owner must not be null\""
                        }
                      ],
                      "id": 11047,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [
                        19407,
                        19408
                      ],
                      "referencedDeclaration": 19408,
                      "src": "1020:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$_t_string_memory_ptr_$returns$__$",
                        "typeString": "function (bool,string memory) pure"
                      }
                    },
                    "id": 11054,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1020:55:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11055,
                  "nodeType": "ExpressionStatement",
                  "src": "1020:55:49"
                },
                {
                  "assignments": [
                    11057
                  ],
                  "declarations": [
                    {
                      "constant": false,
                      "id": 11057,
                      "name": "salt",
                      "nodeType": "VariableDeclaration",
                      "scope": 11118,
                      "src": "1085:12:49",
                      "stateVariable": false,
                      "storageLocation": "default",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes32",
                        "typeString": "bytes32"
                      },
                      "typeName": {
                        "id": 11056,
                        "name": "bytes32",
                        "nodeType": "ElementaryTypeName",
                        "src": "1085:7:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bytes32",
                          "typeString": "bytes32"
                        }
                      },
                      "value": null,
                      "visibility": "internal"
                    }
                  ],
                  "id": 11069,
                  "initialValue": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "arguments": [
                          {
                            "argumentTypes": null,
                            "expression": {
                              "argumentTypes": null,
                              "id": 11061,
                              "name": "msg",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 19404,
                              "src": "1127:3:49",
                              "typeDescriptions": {
                                "typeIdentifier": "t_magic_message",
                                "typeString": "msg"
                              }
                            },
                            "id": 11062,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "sender",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": null,
                            "src": "1127:10:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_address_payable",
                              "typeString": "address payable"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "id": 11063,
                            "name": "_owner",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 11036,
                            "src": "1139:6:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            }
                          },
                          {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "id": 11065,
                                "name": "this",
                                "nodeType": "Identifier",
                                "overloadedDeclarations": [],
                                "referencedDeclaration": 19584,
                                "src": "1155:4:49",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_contract$_Factory_$11120",
                                  "typeString": "contract Factory"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_contract$_Factory_$11120",
                                  "typeString": "contract Factory"
                                }
                              ],
                              "id": 11064,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "lValueRequested": false,
                              "nodeType": "ElementaryTypeNameExpression",
                              "src": "1147:7:49",
                              "typeDescriptions": {
                                "typeIdentifier": "t_type$_t_address_$",
                                "typeString": "type(address)"
                              },
                              "typeName": "address"
                            },
                            "id": 11066,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "typeConversion",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1147:13:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_address_payable",
                              "typeString": "address payable"
                            },
                            {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            },
                            {
                              "typeIdentifier": "t_address",
                              "typeString": "address"
                            }
                          ],
                          "expression": {
                            "argumentTypes": null,
                            "id": 11059,
                            "name": "abi",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 19391,
                            "src": "1110:3:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_magic_abi",
                              "typeString": "abi"
                            }
                          },
                          "id": 11060,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "memberName": "encodePacked",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "1110:16:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_function_abiencodepacked_pure$__$returns$_t_bytes_memory_ptr_$",
                            "typeString": "function () pure returns (bytes memory)"
                          }
                        },
                        "id": 11067,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "functionCall",
                        "lValueRequested": false,
                        "names": [],
                        "nodeType": "FunctionCall",
                        "src": "1110:51:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bytes_memory_ptr",
                          "typeString": "bytes memory"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bytes_memory_ptr",
                          "typeString": "bytes memory"
                        }
                      ],
                      "id": 11058,
                      "name": "keccak256",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 19398,
                      "src": "1100:9:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_keccak256_pure$_t_bytes_memory_ptr_$returns$_t_bytes32_$",
                        "typeString": "function (bytes memory) pure returns (bytes32)"
                      }
                    },
                    "id": 11068,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1100:62:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes32",
                      "typeString": "bytes32"
                    }
                  },
                  "nodeType": "VariableDeclarationStatement",
                  "src": "1085:77:49"
                },
                {
                  "assignments": [
                    11071
                  ],
                  "declarations": [
                    {
                      "constant": false,
                      "id": 11071,
                      "name": "_code",
                      "nodeType": "VariableDeclaration",
                      "scope": 11118,
                      "src": "1172:18:49",
                      "stateVariable": false,
                      "storageLocation": "memory",
                      "typeDescriptions": {
                        "typeIdentifier": "t_bytes_memory_ptr",
                        "typeString": "bytes"
                      },
                      "typeName": {
                        "id": 11070,
                        "name": "bytes",
                        "nodeType": "ElementaryTypeName",
                        "src": "1172:5:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bytes_storage_ptr",
                          "typeString": "bytes"
                        }
                      },
                      "value": null,
                      "visibility": "internal"
                    }
                  ],
                  "id": 11073,
                  "initialValue": {
                    "argumentTypes": null,
                    "id": 11072,
                    "name": "bytecode",
                    "nodeType": "Identifier",
                    "overloadedDeclarations": [],
                    "referencedDeclaration": 11000,
                    "src": "1193:8:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bytes_storage",
                      "typeString": "bytes storage ref"
                    }
                  },
                  "nodeType": "VariableDeclarationStatement",
                  "src": "1172:29:49"
                },
                {
                  "externalReferences": [
                    {
                      "proxy": {
                        "declaration": 11045,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1299:5:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "_code": {
                        "declaration": 11071,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1343:5:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "_code": {
                        "declaration": 11071,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1323:5:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "salt": {
                        "declaration": 11057,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1351:4:49",
                        "valueSize": 1
                      }
                    },
                    {
                      "proxy": {
                        "declaration": 11045,
                        "isOffset": false,
                        "isSlot": false,
                        "src": "1391:5:49",
                        "valueSize": 1
                      }
                    }
                  ],
                  "id": 11074,
                  "nodeType": "InlineAssembly",
                  "operations": "{\n    proxy := create2(0, add(_code, 0x20), mload(_code), salt)\n    if iszero(extcodesize(proxy)) { revert(0, 0) }\n}",
                  "src": "1276:177:49"
                },
                {
                  "assignments": [
                    11076
                  ],
                  "declarations": [
                    {
                      "constant": false,
                      "id": 11076,
                      "name": "wallet",
                      "nodeType": "VariableDeclaration",
                      "scope": 11118,
                      "src": "1463:13:49",
                      "stateVariable": false,
                      "storageLocation": "default",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Wallet_$11514",
                        "typeString": "contract Wallet"
                      },
                      "typeName": {
                        "contractScope": null,
                        "id": 11075,
                        "name": "Wallet",
                        "nodeType": "UserDefinedTypeName",
                        "referencedDeclaration": 11514,
                        "src": "1463:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      "value": null,
                      "visibility": "internal"
                    }
                  ],
                  "id": 11080,
                  "initialValue": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11078,
                        "name": "proxy",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11045,
                        "src": "1486:5:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        }
                      ],
                      "id": 11077,
                      "name": "Wallet",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11514,
                      "src": "1479:6:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_type$_t_contract$_Wallet_$11514_$",
                        "typeString": "type(contract Wallet)"
                      }
                    },
                    "id": 11079,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "typeConversion",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1479:13:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_contract$_Wallet_$11514",
                      "typeString": "contract Wallet"
                    }
                  },
                  "nodeType": "VariableDeclarationStatement",
                  "src": "1463:29:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11084,
                        "name": "_owner",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11036,
                        "src": "1515:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11085,
                        "name": "delegates",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10996,
                        "src": "1523:9:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Delegates_$12109",
                          "typeString": "contract Delegates"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11086,
                        "name": "modules",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10994,
                        "src": "1534:7:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_LimitedModules_$14566",
                          "typeString": "contract LimitedModules"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        {
                          "typeIdentifier": "t_contract$_Delegates_$12109",
                          "typeString": "contract Delegates"
                        },
                        {
                          "typeIdentifier": "t_contract$_LimitedModules_$14566",
                          "typeString": "contract LimitedModules"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 11081,
                        "name": "wallet",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11076,
                        "src": "1503:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      "id": 11083,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "init",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 11408,
                      "src": "1503:11:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_external_nonpayable$_t_address_$_t_contract$_Delegates_$12109_$_t_contract$_Modules_$15054_$returns$__$",
                        "typeString": "function (address,contract Delegates,contract Modules) external"
                      }
                    },
                    "id": 11087,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1503:39:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11088,
                  "nodeType": "ExpressionStatement",
                  "src": "1503:39:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11092,
                        "name": "wallet",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11076,
                        "src": "1565:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11093,
                        "name": "_modules",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11039,
                        "src": "1573:8:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_array$_t_address_$dyn_memory_ptr",
                          "typeString": "address[] memory"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11094,
                        "name": "multiLimiter",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10998,
                        "src": "1583:12:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                          "typeString": "contract MultiLimiter"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        },
                        {
                          "typeIdentifier": "t_array$_t_address_$dyn_memory_ptr",
                          "typeString": "address[] memory"
                        },
                        {
                          "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                          "typeString": "contract MultiLimiter"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 11089,
                        "name": "modules",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10994,
                        "src": "1552:7:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_LimitedModules_$14566",
                          "typeString": "contract LimitedModules"
                        }
                      },
                      "id": 11091,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "init",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 14383,
                      "src": "1552:12:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_external_nonpayable$_t_contract$_Wallet_$11514_$_t_array$_t_address_$dyn_memory_ptr_$_t_contract$_Limiter_$12298_$returns$__$",
                        "typeString": "function (contract Wallet,address[] memory,contract Limiter) external"
                      }
                    },
                    "id": 11095,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1552:44:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11096,
                  "nodeType": "ExpressionStatement",
                  "src": "1552:44:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11100,
                        "name": "wallet",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11076,
                        "src": "1624:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11101,
                        "name": "_limiters",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11042,
                        "src": "1632:9:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr",
                          "typeString": "contract Limiter[] memory"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_contract$_Wallet_$11514",
                          "typeString": "contract Wallet"
                        },
                        {
                          "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr",
                          "typeString": "contract Limiter[] memory"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 11097,
                        "name": "multiLimiter",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 10998,
                        "src": "1606:12:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_contract$_MultiLimiter_$13157",
                          "typeString": "contract MultiLimiter"
                        }
                      },
                      "id": 11099,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "init",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 12880,
                      "src": "1606:17:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_external_nonpayable$_t_contract$_Wallet_$11514_$_t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr_$returns$__$",
                        "typeString": "function (contract Wallet,contract Limiter[] memory) external"
                      }
                    },
                    "id": 11102,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1606:36:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11103,
                  "nodeType": "ExpressionStatement",
                  "src": "1606:36:49"
                },
                {
                  "eventCall": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 11105,
                        "name": "proxy",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11045,
                        "src": "1672:5:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "id": 11106,
                        "name": "_owner",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 11036,
                        "src": "1679:6:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address_payable",
                          "typeString": "address payable"
                        },
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      ],
                      "id": 11104,
                      "name": "WalletCreated",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 11006,
                      "src": "1658:13:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_event_nonpayable$_t_address_$_t_address_$returns$__$",
                        "typeString": "function (address,address)"
                      }
                    },
                    "id": 11107,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1658:28:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11108,
                  "nodeType": "EmitStatement",
                  "src": "1653:33:49"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        "id": 11114,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "arguments": [],
                          "expression": {
                            "argumentTypes": [],
                            "expression": {
                              "argumentTypes": null,
                              "id": 11110,
                              "name": "wallet",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 11076,
                              "src": "1704:6:49",
                              "typeDescriptions": {
                                "typeIdentifier": "t_contract$_Wallet_$11514",
                                "typeString": "contract Wallet"
                              }
                            },
                            "id": 11111,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "owner",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": 11200,
                            "src": "1704:12:49",
                            "typeDescriptions": {
                              "typeIdentifier": "t_function_external_view$__$returns$_t_address_$",
                              "typeString": "function () view external returns (address)"
                            }
                          },
                          "id": 11112,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "kind": "functionCall",
                          "lValueRequested": false,
                          "names": [],
                          "nodeType": "FunctionCall",
                          "src": "1704:14:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "==",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 11113,
                          "name": "_owner",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 11036,
                          "src": "1722:6:49",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "src": "1704:24:49",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "hexValue": "77726f6e672077616c6c6574206f776e6572",
                        "id": 11115,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": true,
                        "kind": "string",
                        "lValueRequested": false,
                        "nodeType": "Literal",
                        "src": "1730:20:49",
                        "subdenomination": null,
                        "typeDescriptions": {
                          "typeIdentifier": "t_stringliteral_8ee0e224cd3f10f488f1ba0dca395bb443d3c4fd924ec6adfc319b7f8111fe7d",
                          "typeString": "literal_string \"wrong wallet owner\""
                        },
                        "value": "wrong wallet owner"
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        },
                        {
                          "typeIdentifier": "t_stringliteral_8ee0e224cd3f10f488f1ba0dca395bb443d3c4fd924ec6adfc319b7f8111fe7d",
                          "typeString": "literal_string \"wrong wallet owner\""
                        }
                      ],
                      "id": 11109,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [
                        19407,
                        19408
                      ],
                      "referencedDeclaration": 19408,
                      "src": "1696:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$_t_string_memory_ptr_$returns$__$",
                        "typeString": "function (bool,string memory) pure"
                      }
                    },
                    "id": 11116,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "1696:55:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 11117,
                  "nodeType": "ExpressionStatement",
                  "src": "1696:55:49"
                }
              ]
            },
            "documentation": null,
            "id": 11119,
            "implemented": true,
            "kind": "function",
            "modifiers": [],
            "name": "createProxyWallet",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 11043,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11036,
                  "name": "_owner",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "859:14:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 11035,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "859:7:49",
                    "stateMutability": "nonpayable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11039,
                  "name": "_modules",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "883:25:49",
                  "stateVariable": false,
                  "storageLocation": "memory",
                  "typeDescriptions": {
                    "typeIdentifier": "t_array$_t_address_$dyn_memory_ptr",
                    "typeString": "address[]"
                  },
                  "typeName": {
                    "baseType": {
                      "id": 11037,
                      "name": "address",
                      "nodeType": "ElementaryTypeName",
                      "src": "883:7:49",
                      "stateMutability": "nonpayable",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "id": 11038,
                    "length": null,
                    "nodeType": "ArrayTypeName",
                    "src": "883:9:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_address_$dyn_storage_ptr",
                      "typeString": "address[]"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 11042,
                  "name": "_limiters",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "918:26:49",
                  "stateVariable": false,
                  "storageLocation": "memory",
                  "typeDescriptions": {
                    "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_memory_ptr",
                    "typeString": "contract Limiter[]"
                  },
                  "typeName": {
                    "baseType": {
                      "contractScope": null,
                      "id": 11040,
                      "name": "Limiter",
                      "nodeType": "UserDefinedTypeName",
                      "referencedDeclaration": 12298,
                      "src": "918:7:49",
                      "typeDescriptions": {
                        "typeIdentifier": "t_contract$_Limiter_$12298",
                        "typeString": "contract Limiter"
                      }
                    },
                    "id": 11041,
                    "length": null,
                    "nodeType": "ArrayTypeName",
                    "src": "918:9:49",
                    "typeDescriptions": {
                      "typeIdentifier": "t_array$_t_contract$_Limiter_$12298_$dyn_storage_ptr",
                      "typeString": "contract Limiter[]"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "849:101:49"
            },
            "returnParameters": {
              "id": 11046,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 11045,
                  "name": "proxy",
                  "nodeType": "VariableDeclaration",
                  "scope": 11119,
                  "src": "983:21:49",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address_payable",
                    "typeString": "address payable"
                  },
                  "typeName": {
                    "id": 11044,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "983:15:49",
                    "stateMutability": "payable",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address_payable",
                      "typeString": "address payable"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "982:23:49"
            },
            "scope": 11120,
            "src": "823:936:49",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          }
        ],
        "scope": 11121,
        "src": "205:1556:49"
      }
    ],
    "src": "0:1762:49"
  },
  "compiler": {
    "name": "solc",
    "version": "0.5.11+commit.c082d0b4.Emscripten.clang"
  },
  "networks": {},
  "schemaVersion": "3.0.16",
  "updatedAt": "2019-11-11T00:47:34.694Z",
  "devdoc": {
    "methods": {
      "isOwner()": {
        "details": "Returns true if the caller is the current owner."
      },
      "owner()": {
        "details": "Returns the address of the current owner."
      },
      "renounceOwnership()": {
        "details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner."
      },
      "transferOwnership(address)": {
        "details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
      }
    }
  },
  "userdoc": {
    "methods": {}
  }
}