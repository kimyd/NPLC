// Lee, July 29, 2018
pragma solidity 0.4.24;

import "./Whitelistable.sol";

contract Freezable is Whitelistable {
    using SafeMath for uint256;

    bool public frozenToken;
    mapping (address => bool) public frozenAccount;

    event FrozenFunds(address indexed _target, bool _frozen);
    event FrozenToken(bool _frozen);

    modifier isNotFrozen( address _to ) {
        require(!frozenToken);
        require(whitelistedTransferer[_to] || (!whitelistedTransferer[_to] && !frozenAccount[msg.sender] && !frozenAccount[_to]));
        _;
    }

    modifier isNotFrozenFrom( address _from, address _to ) {
        require(whitelistedTransferer[_to] || (!whitelistedTransferer[_to] && !frozenAccount[msg.sender] && !frozenAccount[_from] && !frozenAccount[_to]));
        _;
    }

    function freezeAccount(address _target, bool _freeze) public onlySuperAdmins validateAddress(_target){
        require(frozenAccount[_target] != _freeze);
        frozenAccount[_target] = _freeze;
        emit FrozenFunds(_target, _freeze);
    }

    function freezeToken(bool _freeze) public onlySuperAdmins {
        require(frozenToken != _freeze);
        frozenToken = _freeze;
        emit FrozenToken(frozenToken);
    }
}
