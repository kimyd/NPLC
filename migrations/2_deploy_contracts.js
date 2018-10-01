var Token = artifacts.require("./PlusCoin.sol");

var tokenContract;

module.exports = function(deployer) {
    var admin = "0x81b7e5064fb7D9EBE21a051559EAdda2B82ad5c6"; 
    var totalTokenAmount = 1 * 900000000 * 1000000000000000000;
    return Token.new(admin, totalTokenAmount).then(function(result) {
        tokenContract = result;
    });
};
