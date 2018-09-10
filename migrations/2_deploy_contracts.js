var Token = artifacts.require("./PlusCoinX.sol");

var tokenContract;

module.exports = function(deployer) {
    var admin = "0xdB75d13CE958320145f3C8ede33Db917bB59A463"; 
    var totalTokenAmount = 1 * 900000000 * 1000000000000000000;

    return Token.new(admin, totalTokenAmount).then(function(result) {
        tokenContract = result;
    });
};
