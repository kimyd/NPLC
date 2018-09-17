// Lee, July 29, 2018
pragma solidity 0.4.24;
import "./Whitelistable.sol";

contract TimeLockable is Whitelistable{
    using SafeMath for uint256;
    mapping (address => uint256) public timelockedAccount;
    event LockedFunds(address indexed target, uint256 timelocked);

    modifier unlessTimeLocked( address _to ) {
        require( whitelistedTransferer[_to] || (!whitelistedTransferer[_to] && now >= timelockedAccount[msg.sender]));
        _;
    }

    modifier unlessTimeLockedFrom( address _from, address _to) {
        require( whitelistedTransferer[_to] || (!whitelistedTransferer[_to] && (now >= timelockedAccount[_from]) && now >= timelockedAccount[msg.sender]));
        _;
    }

    function lockAccount(address _target, uint256 _releaseTime) public onlySuperAdmins validateAddress(_target) {
        require(timelockedAccount[_target] != _releaseTime);
        timelockedAccount[_target] = _releaseTime;
        emit LockedFunds(_target, _releaseTime);
    }
}
