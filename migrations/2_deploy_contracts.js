var Token = artifacts.require("./PlusCoin.sol");

var tokenContract;

module.exports = function(deployer) {
    var admin = "0x5c4F70f5a617aE2afbCE9B127934b0573c2E1b9D"; 
    var totalTokenAmount = 1 * 900000000 * 1000000000000000000;
    return Token.new(admin, totalTokenAmount).then(function(result) {
        tokenContract = result;
    });
};
