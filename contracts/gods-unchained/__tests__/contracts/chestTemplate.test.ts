import 'jest';

describe('SeasonChest', () => {
  describe('#purchaseChest', () => {
    it('should not be able to purchase 0 chests');
    it('should not be able to purchase with an invalid pack type');
    it('should not be able to purchase more than the limit');
    it('should not be able to purchase with insufficient funds');
    it('should be able to purchase with the correct events emitted and tokens minted');
    it('should be able to purchase with the correct referral amount sent and recorded');
  });

  describe('#purchaseViaReceipt', () => {
    it('should not be able to purchase with no user set');
    it('should not be able to purchase with no lockup set');
    it('should not be able to purchase with an invalid signature');
    it('should not be able to purchase with the same receipt');
    it('should be able to purchase with the correct events emitted');
  });

  describe('#openChest', () => {
    it('should no be able to open as an invalid chest');
    it('should not be able to open someone elses chest');
    it('should be able to open a chest with the packs released');
  });

  describe('#unlockTrading', () => {
    it('should not be called by an unauthorised user');
    it('should not be called if trading is already unlocked');
    it('should be able to be called called by the owner');
  });
});
