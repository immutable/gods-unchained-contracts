const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider();

provider.send(
    'evm_snapshot',
    [],
).then(function (id) {
  if (id !== '0x1') {
    provider.send(
      'evm_revert',
      ['0x1']
    ).then(function () {
      provider.send(
        'evm_snapshot',
       []
      )
    })
  }
}).catch(function (error) {
  console.log(error);
});