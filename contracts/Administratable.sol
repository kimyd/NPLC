// Lee, July 29, 2018
pragma solidity ^0.4.24;

// August 21, 2018
// remove all admin code.


import "./Ownable.sol";
import "./SafeMath.sol";

contract Administratable is Ownable {
  using SafeMath for uint256;
  mapping (address => bool) public superAdmins;

  event AddSuperAdmin(address indexed admin);
  event RemoveSuperAdmin(address indexed admin);

  modifier onlySuperAdmins {
    if (msg.sender != owner && !superAdmins[msg.sender]) revert();
    _;
  }

  function addSuperAdmin(address admin) public onlySuperAdmins {
    require(admin != address(0));
    superAdmins[admin] = true;
    emit AddSuperAdmin(admin);
  }

  function removeSuperAdmin(address admin) public onlySuperAdmins {
    require(admin != address(0));
    superAdmins[admin] = false;
    emit RemoveSuperAdmin(admin);
  }
}
