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


    it("1. add admin from owner", function() {
        return tokenContract.addSuperAdmin(accounts[1], {from:tokenOwner});
    });

    it("2. add admin from accounts[1]", function() {
        return tokenContract.addSuperAdmin(accounts[2], {from:tokenOwner});
    });

    it("3. freeze token", function() {
        return tokenContract.freezeToken(true, {from:accounts[1]});
    });

    it("4. unfreeze token", function() {
        return tokenContract.freezeToken(false, {from:accounts[2]});
    });

    // it("transfer from owner when transfers started", function() {
    //     var value = new BigNumber(100);
    //     return tokenContract.transfer(accounts[7], value, {from:tokenOwner});
    // });


    // it("4. transfer from owner when transfers started", function() {
    //     var value = new BigNumber(100);
    //     return tokenContract.transfer(accounts[7], value, {from:tokenOwner});
    // });
    
    it("5. unfreeze token", function() {
        return tokenContract.freezeToken(false, {from:accounts[1]});
    });

    it("6. transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[7], value, {from:tokenOwner});
    });

    it("7. freeze account[7]", function() {
        var value = new BigNumber(100);
        return tokenContract.freezeAccount(accounts[7], true, {from:tokenOwner});
    });


    // it("transfer from froze account to unfroze account", function() {
    //     var value = new BigNumber(500);
    //     return tokenContract.transfer(accounts[2], value, {from:accounts[7]}).then(function(result){
    //         return tokenContract.balanceOf(accounts[1]);
    //     }).then(function(result) {
    //         console.log("log : " + result.valueOf());
    //     }).catch(function(error) {
    //         assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
    //     });
    // });

    // it("transfer from unfroze account to froze account", function() {
    //     var value = new BigNumber(500);
    //     return tokenContract.transfer(accounts[7], value, {from:accounts[2]}).then(function(result){
    //         return tokenContract.balanceOf(accounts[1]);
    //     }).then(function(result) {
    //         console.log("log : " + result.valueOf());
    //     }).catch(function(error) {
    //         assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
    //     });
    // });


    it("approve from frozen account to unfrozen account.", function() {
        var value = new BigNumber(5);
        return tokenContract.approve(accounts[5], value, {from:accounts[7]}).then(function(){
            tokenContract.transferFrom(accounts[7], accounts[3],value,{from:accounts[5]});
            return tokenContract.balanceOf(accounts[3]);
        }).then(function(result) {
            console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
            return tokenContract.approve(accounts[5], new BigNumber(0), {from:accounts[2]});
        });
    });


    it("approve from unfrozen account to frozen account.", function() {
        var value = new BigNumber(5);
        return tokenContract.approve(accounts[7], value, {from:accounts[2]}).then(function(){
            tokenContract.transferFrom(accounts[2], accounts[3],value,{from:accounts[7]});
            return tokenContract.balanceOf(accounts[3]);
        }).then(function(result) {
            console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
            return tokenContract.approve(accounts[5], new BigNumber(0), {from:accounts[2]});
        });
    });


});
