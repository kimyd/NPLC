# NPLC

Deployment Config
In /migrations/2_deploy_contracts.js, 
we may specify the admin account address and total number of tokens. E.g.

 var admin = "0x123";
 var totalTokenAmount = 210;


1. compile solidity source code
   output is located at build/contracts
   
   $ truffle compile

2. deploy contracts to rinkeby network ethereum
   please refer to truffle.js for configuration

   $ truffle migrate --network rinkeby
