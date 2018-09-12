// Lee, July 29, 2018
pragma solidity ^0.4.24;

import "./Whitelistable.sol";
import "./SafeMath.sol";

contract Freezable is Whitelistable {
  using SafeMath for uint256;

  bool public frozenToken;
  mapping (address => bool) public frozenAccount;

  event FrozenFunds(address indexed _target, bool _frozen);
  event FrozenToken(bool _frozen);

  // modifier unlessFrozen {
  //   require(!frozenToken);
  //   require(!frozenAccount[msg.sender]);
  //   _;
  // }

 modifier unlessFrozen( address _to ) {
    require(!frozenToken);
    if(!whitelistedTransferer[_to])
    {
        require(!frozenAccount[msg.sender]);
        require(!frozenAccount[_to]);
    }
    
    _;
  }

  modifier unlessFrozenFrom( address _from, address _to ) {
      if(!whitelistedTransferer[_to])
      {
          require(!frozenAccount[msg.sender]);
          require(!frozenAccount[_to]);
          require(!frozenAccount[_from]);
      }
      _;
  }

  function freezeAccount(address _target, bool _freeze) public onlySuperAdmins {
    frozenAccount[_target] = _freeze;
    emit FrozenFunds(_target, _freeze);
  }

  function freezeToken(bool _freeze) public onlySuperAdmins {
    frozenToken = _freeze;
    emit FrozenToken(frozenToken);
  }
}
