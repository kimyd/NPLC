// Lee, July 29, 2018
pragma solidity ^0.4.24;

import "./Whitelistable.sol";
import "./SafeMath.sol";

contract TimeLockable is Whitelistable{
    using SafeMath for uint256;

    mapping (address => uint) public timelockedAccount;

    event LockedFunds(address indexed target, uint timelocked);

    function getCurrentTime() public constant returns (uint) {
        return now;
    }

    modifier unlessTimeLocked( address _to) {
        if(!whitelistedTransferer[_to])
            require(now >= timelockedAccount[msg.sender]);
        _;
    }

    modifier unlessTimeLockedFrom( address _from, address _to) {
        if(!whitelistedTransferer[_to])
        {
            require(now >= timelockedAccount[msg.sender]);
            require(now >= timelockedAccount[_from]);
        }
        _;
    }

    function lockAccount(address _target, uint _releaseTime) public onlySuperAdmins {
        require(_target != address(0));
        timelockedAccount[_target] = _releaseTime;
        emit LockedFunds(_target, _releaseTime);
    }
}
