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


    it("transfer before transfer start time", function() {
        var value = new BigNumber(1000);
        return tokenContract.transfer(accounts[2], value, {from:tokenOwner}).then(function(){
            // get balances
            return tokenContract.balanceOf(tokenOwner);
        }).then(function(result) {
            console.log("log : " + result.valueOf());
            assert.equal(result.valueOf(), totalSupply.minus(value).valueOf(), "unexpected balance");
            return tokenContract.balanceOf(accounts[2]);
        }).then(function(result){
            assert.equal(result.valueOf(), value.valueOf(), "unexpected balance");    
        });
    });


    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(1000);
        return tokenContract.transfer(accounts[2], value, {from:tokenOwner}).then(function(){
            // get balances
            return tokenContract.balanceOf(tokenOwner);
        }).then(function(result){
            assert.equal(result.valueOf(), totalSupply.minus(value.mul(2)).valueOf(), "unexpected balance");
            return tokenContract.balanceOf(accounts[2]);
        }).then(function(result){
            assert.equal(result.valueOf(), value.mul(2).valueOf(), "unexpected balance");    
        });
    });

    it("transfer from non owner when transfers started", function() {
        var value = new BigNumber(500);
        return tokenContract.transfer(accounts[1], value, {from:accounts[2]}).then(function(result){
            return tokenContract.balanceOf(accounts[1]);
        }).then(function(result) {
            console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("transfer from non owner when transfers started, account[7]", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[7], value, {from:accounts[2]}).then(function(result){
            return tokenContract.balanceOf(accounts[7]);
        }).then(function(result) {
            console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("transfer from non owner when transfers started, account[8]", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[8], value, {from:accounts[2]}).then(function(result){
            return tokenContract.balanceOf(accounts[8]);
        }).then(function(result) {
            console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("transferfrom non owner when transfers started", function() {
        var value = new BigNumber(5);
        return tokenContract.approve(accounts[5], value, {from:accounts[2]}).then(function(){
            tokenContract.transferFrom(accounts[2], accounts[3],value,{from:accounts[5]});
            return tokenContract.balanceOf(accounts[3]);
        }).then(function(result) {
            console.log("log : " + result.valueOf());
        }).catch(function(error) {
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
            return tokenContract.approve(accounts[5], new BigNumber(0), {from:accounts[2]});
        });
    });
  
    it("transfer more than balance", function() {
        var value = new BigNumber(101);
        return tokenContract.transfer(accounts[8], value, {from:accounts[7]}).then(function(){
            assert.fail("transfer should fail");                
        }).catch(function(error){
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("transfer to address 0", function() {
        var value = new BigNumber(1);
        return tokenContract.transfer("0x0000000000000000000000000000000000000000", value, {from:accounts[7]}).then(function(){
            assert.fail("transfer should fail");                
        }).catch(function(error){
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    // must be error
    it("transfer to token contract", function() {
        var value = new BigNumber(1);
        return tokenContract.transfer(tokenContract.address, value, {from:accounts[2]}).then(function(){
            assert.fail("transfer should fail");
        }).catch(function(error){
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });


    it("transfer - see that balance changes", function() {
        var value = new BigNumber(60);
        return tokenContract.transfer(accounts[8], value, {from:accounts[7]}).then(function(){
            return tokenContract.balanceOf(accounts[7]);
        }).then(function(result){
            assert.equal(result.valueOf(), new BigNumber(40).valueOf(), "unexpected balance");
            return tokenContract.balanceOf(accounts[8]);
        }).then(function(result){
            assert.equal(result.valueOf(), new BigNumber(60).valueOf(), "unexpected balance");    
        });
    });
  
    it("approve more than balance", function() {
        var value = new BigNumber(180);
        return tokenContract.approve(accounts[9], value, {from:accounts[8]}).then(function() {
            return tokenContract.allowance(accounts[8],accounts[9]);
        }).then(function(result){
            // console.log("log : " + result.valueOf());
            assert.equal(result.valueOf(), value.valueOf(), "unexpected allowance");
        });
    });

    it("transferfrom more than balance", function() {
        var value = new BigNumber(180);  
        return tokenContract.transferFrom(accounts[8], accounts[7], value, {from:accounts[9]}).then(function(){
            assert.fail("transfer should fail");
        }).catch(function(error){
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("transferfrom to address 0", function() {
        var value = new BigNumber(10);  
        return tokenContract.transferFrom(accounts[8], "0x0000000000000000000000000000000000000000", value, {from:accounts[9]}).then(function(){
            assert.fail("transfer should fail");
        }).catch(function(error){
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("transferfrom to token contract", function() {
        var value = new BigNumber(10);  
        return tokenContract.transferFrom(accounts[8], tokenContract.address, value, {from:accounts[9]}).then(function(){
            assert.fail("transfer should fail");
        }).catch(function(error){
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });

    it("transferfrom", function() {
        var value = new BigNumber(10);  
        return tokenContract.transferFrom(accounts[8], accounts[6], value, {from:accounts[9]}).then(function(){
            // check balance was changed
            return tokenContract.balanceOf(accounts[6]);
        }).then(function(result){
            assert.equal(result.valueOf(), value.valueOf(), "unexpected balance");
            return tokenContract.balanceOf(accounts[8]);
        }).then(function(result){
            assert.equal(result.valueOf(), (new BigNumber(50)).valueOf(), "unexpected balance");
            // check allwance was changed
            return tokenContract.allowance(accounts[8],accounts[9]);
        }).then(function(result){
            assert.equal(result.valueOf(), (new BigNumber(170)).valueOf(), "unexpected allowance");
        });
    });

    it("burn - see that balance and total supply changes", function() {
        var value = new BigNumber(4);
        return tokenContract.burn(value, {from:accounts[6]}).then(function(){
            return tokenContract.balanceOf(accounts[6]);
        }).then(function(result){
            assert.equal(result.valueOf(), new BigNumber(6).valueOf(), "unexpected balance");
            // check total supply
            return tokenContract.totalSupply();
        }).then(function(result) {
            assert.equal(result.valueOf(), (totalSupply.minus(value)).valueOf(), "unexpected balance");
            totalSupply = totalSupply.minus(value);    
        });
    });

    it("burn - burn more than balance should fail", function() {
        var value = new BigNumber(14);
        return tokenContract.burn(value, {from:accounts[6]}).then(function(){
            assert.fail("burn should fail");    
        }).catch(function(error){
            assert( Helpers.throwErrorMessage(error), "expected throw got " + error);    
        });
    });
  
    it("transfer from owner when transfers started", function() {
        var value = new BigNumber(100);
        return tokenContract.transfer(accounts[5], value, {from:tokenOwner});
    });

    it("burn from", function() {
        var value = new BigNumber(50);
        return tokenContract.approve(accounts[3], value, {from:accounts[5]}).then(function(){
            return tokenContract.burnFrom(accounts[5], value, {from:accounts[3]});
        }).then(function(){
            // check accounts[5] balance was reduced
            return tokenContract.balanceOf(accounts[5]);
        }).then(function(result){
            assert.equal(result.valueOf(), (new BigNumber(50)).valueOf(), "unexpected balance");
            // check total supply was reduced
            return tokenContract.totalSupply();
        }).then(function(result){
            assert.equal(result.valueOf(), totalSupply.minus(50), "unexpected total supply");
            totalSupply = totalSupply.minus(50);
        });
    });
});
