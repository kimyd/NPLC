const { assertRevert } = require('./helpers/assertRevert');
const PlusCoin = artifacts.require('PlusCoin');
const BigNumber = web3.BigNumber;
const INITIAL_SUPPLY = new BigNumber(2000000000).mul(1000000000000000000);

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

 const ADVISOR_LOCKUP_END = new BigNumber(1551398399);
 const TEAM_LOCKUP_END = new BigNumber(1567295999);

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('PlusCoin', (accounts) => {
  beforeEach(async function () {
    this.plusCoin = await PlusCoin.new(
      // set accounts[1] to be registry
      accounts[1], INITIAL_SUPPLY
    );
  });

  describe('constructor', () => {
    it('validate token minting', async function () {
      // accounts[0] should be the owner
      (await this.plusCoin.owner()).should.be.equal(accounts[0]);

      // total supply should be initial supply
      (await this.plusCoin.totalSupply()).should.be.bignumber.equal(INITIAL_SUPPLY);

      // balance of register (accounts[1]) should be initial_supply
      (await this.plusCoin.balanceOf(accounts[0])).should.be.bignumber.equal(0);
      (await this.plusCoin.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);

      // accounts[1] should be a super admin
      (await this.plusCoin.superAdmins(accounts[0])).should.be.equal(false);
      (await this.plusCoin.superAdmins(accounts[1])).should.be.equal(true);
      (await this.plusCoin.superAdmins(accounts[2])).should.be.equal(false);
    });
  });

  describe('transfer', () => {
    it('simple transfer case should succeed and change balance', async function () {
      // transfer tokens from registry (accounts[1]) to another account
      (await this.plusCoin.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
      (await this.plusCoin.balanceOf(accounts[2])).should.be.bignumber.equal(0);

      // perform transfer
      await this.plusCoin.transfer(accounts[2], 5000, {from: accounts[1]});

      // balances should be updated
      (await this.plusCoin.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY.sub(5000));
      (await this.plusCoin.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));
    });

    it('transferFrom case should succeed and change balance', async function () {
      // transfer tokens from registry (accounts[1]) to another account
      (await this.plusCoin.balanceOf(accounts[1])).should.be.bignumber.equal(INITIAL_SUPPLY);
      (await this.plusCoin.balanceOf(accounts[2])).should.be.bignumber.equal(0);

      // perform transfer
      await this.plusCoin.transfer(accounts[2], 5000, {from: accounts[1]});
      (await this.plusCoin.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(5000));


      const spender = accounts[3];
      await this.plusCoin.approve(spender, 1000, { from: accounts[2] });
      (await this.plusCoin.allowance(accounts[2], spender)).should.be.bignumber.equal(1000);

      await this.plusCoin.transferFrom(accounts[2], accounts[3], 1000, { from: spender });

      // balances should be updated
      (await this.plusCoin.balanceOf(accounts[2])).should.be.bignumber.equal(new BigNumber(4000));
    });

    it('transfer fails when token is frozen', async function () {
      // freeze accounts[1]
      await this.plusCoin.freezeToken(true, {from: accounts[1]});
      (await this.plusCoin.frozenToken()).should.be.equal(true);

      // perform transfer
      await assertRevert(this.plusCoin.transfer(accounts[2], 5000, {from: accounts[1]}));
    });


    it('transfer fails if sender is frozen', async function () {
      // freeze accounts[1]
      await this.plusCoin.freezeAccount(accounts[1], true, {from: accounts[1]});

      // perform transfer
      await assertRevert(this.plusCoin.transfer(accounts[2], 5000, {from: accounts[1]}));
    });


    it('transfer fails if destination is frozen', async function () {
      // freeze accounts[1]
      await this.plusCoin.freezeAccount(accounts[2], true, {from: accounts[1]});

      // perform transfer
      await assertRevert(this.plusCoin.transfer(accounts[2], 5000, {from: accounts[1]}));
    });

    it('transfer fails if destination is not a valid address', async function () {
      /* TODO */
      
      await assertRevert(
        this.plusCoin.transfer(ZERO_ADDRESS, 100, {from: accounts[2]})
      );
    });

    it('when the spender is the frozen account', async function () {
        const amount = 100;
        const spender = accounts[2];
        await this.plusCoin.freezeAccount(accounts[1], true, {from: accounts[0]});
        // this should fail because accounts[1] is frozen account
        await assertRevert(this.plusCoin.approve(spender, amount, { from: accounts[1] }));
    });

    it('when the spender is the frozen token', async function () {
        const amount = 100;
        const spender = accounts[2];
        // this should fail because accounts[1] is frozen account
        await this.plusCoin.freezeToken(true, {from: accounts[0]});
        (await this.plusCoin.frozenToken()).should.be.equal(true);

        await assertRevert(this.plusCoin.approve(spender, amount, { from: accounts[1] }));
        await assertRevert(this.plusCoin.transferFrom(accounts[1], accounts[3], amount, { from: spender }));


    });

    it('when the spender is the frozen account(message sender)', async function () {
        const amount = 100;
        const spender = accounts[2];

        await this.plusCoin.freezeAccount(accounts[1], true, {from: accounts[0]});
        await assertRevert(this.plusCoin.approve(spender, amount, { from: accounts[1] }));
        await assertRevert(this.plusCoin.transferFrom(accounts[1], accounts[3], amount, { from: spender }));
    });

    it('increase allowance', async function () {
        const amount = 100;
        const spender = accounts[2];
        const increasedAmount = 200;

        await this.plusCoin.approve(spender, amount, { from: accounts[1] });
        (await this.plusCoin.allowance(accounts[1], spender)).should.be.bignumber.equal(amount);


        await this.plusCoin.increaseAllowance(spender, amount, { from: accounts[1] });
        (await this.plusCoin.allowance(accounts[1], spender)).should.be.bignumber.equal(increasedAmount);
    });

    it('decrease allowance', async function () {
        const amount = 100;
        const spender = accounts[2];
        const decreasedAmount = 50;

        await this.plusCoin.approve(spender, amount, { from: accounts[1] });
        (await this.plusCoin.allowance(accounts[1], spender)).should.be.bignumber.equal(amount);

        await this.plusCoin.decreaseAllowance(spender, decreasedAmount, { from: accounts[1] });
        (await this.plusCoin.allowance(accounts[1], spender)).should.be.bignumber.equal(decreasedAmount);
    });

    it('change owner and add super admin', async function () {
        await this.plusCoin.transferOwnership(accounts[2]);
        (await this.plusCoin.owner()).should.be.equal(accounts[2]);
        await this.plusCoin.addSuperAdmin(accounts[3], { from: accounts[2] });
        (await this.plusCoin.superAdmins(accounts[3])).should.be.equal(true);

        await this.plusCoin.removeSuperAdmin(accounts[3], { from: accounts[2] });
        (await this.plusCoin.superAdmins(accounts[3])).should.be.equal(false);
        await assertRevert( this.plusCoin.addSuperAdmin(accounts[3], { from: accounts[5] }));
    });

   it('try to drain contract from admin address', async function () {
        await assertRevert( this.plusCoin.emergencyERC20Drain(this.plusCoin.address, new BigNumber(1), {from:accounts[0]}));
    });

  });
});