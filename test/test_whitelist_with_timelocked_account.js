var Token = artifacts.require("./PlusCoin.sol");
var BigNumber = require('bignumber.js');
var Helpers = require('./helpers.js');

var tokenContract;
var tokenOwner;
var tokenAdmin;
var tokenOwnerAccount;
var nonOwnerAccount;
var totalSupply = web3.toWei( new BigNumber(12600000000), "ether" );
var erc20TokenContract;

contract('token contract', function(accounts) {

    // test accounts, 0 : owner, 1: admin, 
    accounts[0] = "0x81b7e5064fb7D9EBE21a051559EAdda2B82ad5c6";
    accounts[1] = "0xdf1A0db62f6Ba831b78D1bE86AcC3358621C024f";
    accounts[2] = "0x0F3b0465C8B9b2EEE1988C298c63fE222041CE37";
    accounts[3] = "0xBB0aa916772a83365383e06E2aFe54a55B71f408";
    accounts[4] = "0xc4bD4d047C844a4323b262068B62fA7376e41b38";
    accounts[5] = "0xc235914d719EfDFfd9623364B0ec3c6ec422f438";
    accounts[6] = "0xd1680c658c12c01CD9dF49D1f67EA34Cc0D12cE2";
    accounts[7] = "0x2b64bFB2A1FfB2517f6c6Bdf72065472087D7b9c";
    accounts[8] = "0x88E6dBD7561f2D1Ab8eFB3DA055E7E9D293620Ff";
    accounts[9] = "0x02BcAc22A3E54D8414a40dbA8fcD9d57Bb1C63c7";

    // var totalSupply = web3.toWei( new BigNumber(9000000000000000000000000000000000000), "ether" );

    beforeEach(function(done){
        done();
    });
    afterEach(function(done){
        done();
    });

    it("mine one block to get current time", function() {
        return Helpers.sendPromise( 'evm_mine', [] );
    });

    it("deploy token and init accounts", function() {
        tokenOwner = accounts[0];
        tokenAdmin = accounts[0];

        var currentTime = web3.eth.getBlock('latest').timestamp;

        return Token.new(tokenAdmin, totalSupply, {from: tokenOwner}).then(function(result){
            tokenContract = result;
            // check total supply
            return tokenContract.totalSupply();        
        }).then(function(result){
            assert.equal(result.valueOf(), totalSupply.valueOf(), "unexpected total supply");
        });
    });
  
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[1], value, {from:tokenOwner});
    });
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[2], value, {from:tokenOwner});
    });
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[3], value, {from:tokenOwner});
    });
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[4], value, {from:tokenOwner});
    });
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[5], value, {from:tokenOwner});
    });
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[6], value, {from:tokenOwner});
    });

    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[7], value, {from:tokenOwner});
    });
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[8], value, {from:tokenOwner});
    });


    it("1. add admin from owner", function() {
        return tokenContract.addSuperAdmin(accounts[1], {from:tokenOwner});
    });

    it("2. add admin from accounts[1]", function() {
        return tokenContract.addSuperAdmin(accounts[2], {from:tokenOwner});
    });

    it("2.1 add admin from accounts[1]", function() {
        return tokenContract.addSuperAdmin(accounts[3], {from:accounts[2]});
    });

    it("3.1 setWhitelistedTransferer, accounts[4]", function() {
        return tokenContract.setWhitelistedTransferer(accounts[4], true, {from:accounts[1]});
    });

    // it("3.2 freeze account[6]", function() {
    //     return tokenContract.freezeAccount(accounts[6], true, {from:tokenOwner});
    // });

     it("3.2 lock account[6]", function() {
        return tokenContract.lockAccount(accounts[6], 2536716194, {from:accounts[1]});
    });


    it("4.1 ttransfer to accounts[4](whitelisted), account[6], must succeed", function() {
        var value = new BigNumber(5);
        return tokenContract.transfer(accounts[4], value, {from:accounts[6]}).then(function(result){
            return tokenContract.balanceOf(accounts[6]);
        }).then(function(result) {
            // console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("4.2 approve and transfer to accounts[4](not whitelisted) test from accounts[6], must succeed", function() {
        var value = new BigNumber(5);
        return tokenContract.approve(accounts[4], value, {from:accounts[6]}).then(function(){
            tokenContract.transferFrom(accounts[6], accounts[4],value,{from:accounts[4]});
            return tokenContract.balanceOf(accounts[4]);
        }).then(function(result) {
            // console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
            return tokenContract.approve(accounts[6], new BigNumber(0), {from:accounts[2]});
        });
    });

    it("4.3 transfer to accounts[6](frozen)", function() {
        var value = new BigNumber(5);
        return tokenContract.transfer(accounts[6], value, {from:accounts[7]}).then(function(result){
            return tokenContract.balanceOf(accounts[7]);
        }).then(function(result) {
            // console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("4.4 transfer to accounts[7](not whitelisted), account[6]", function() {
        var value = new BigNumber(5);
        return tokenContract.transfer(accounts[7], value, {from:accounts[6]}).then(function(result){
            return tokenContract.balanceOf(accounts[6]);
        }).then(function(result) {
            // console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    // it("4.5 approve and transfer to accounts[7](not whitelisted) test from accounts[6]", function() {
    //     var value = new BigNumber(5);
    //     return tokenContract.approve(accounts[4], value, {from:accounts[6]}).then(function(){
    //         tokenContract.transferFrom(accounts[6], accounts[7],value,{from:accounts[4]});
    //         return tokenContract.balanceOf(accounts[5]);
    //     }).then(function(result) {
    //         // console.log("log : " + result.valueOf());
    //     }).catch(function(error) {
    //         assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
    //         // return tokenContract.approve(accounts[6], new BigNumber(0), {from:accounts[2]});
    //     });
    // });

    it("4.6 approve and transfer to accounts[8](not whitelisted) test from accounts[6]", function() {
        var value = new BigNumber(5);
        return tokenContract.approve(accounts[7], value, {from:accounts[6]}).then(function(){
            tokenContract.transferFrom(accounts[6], accounts[8],value,{from:accounts[7]});
            return tokenContract.balanceOf(accounts[8]);
        }).then(function(result) {
            // console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
            // return tokenContract.approve(accounts[6], new BigNumber(0), {from:accounts[2]});
        });
    });

});
