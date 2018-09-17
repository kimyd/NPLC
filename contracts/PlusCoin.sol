// Lee, July 29, 2018
pragma solidity 0.4.24;
// import './StandardToken.sol';
import './TimeLockable.sol';
import './Freezable.sol';
import './openzeppelin/token/ERC20/ERC20Burnable.sol';

contract XtockToken is ERC20Burnable, TimeLockable, Freezable
{
    string  public  constant name       = "PlusCoin";
    string  public  constant symbol     = "NPLC";
    uint8   public  constant decimals   = 18;
    
    event Burn(address indexed _burner, uint _value);


    constructor( address _registry, uint _totalTokenAmount ) public
    {
        _totalSupply = _totalTokenAmount;
        _balances[_registry] = _totalTokenAmount;
        addSuperAdmin(_registry);
        emit Transfer(address(0x0), _registry, _totalTokenAmount);
    }


    /**
    * @dev Transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */    
    // function transfer(address _to, uint _value) onlyWhenUnlocked unlessFrozen validDestination(_to) returns (bool) 
    function transfer(address _to, uint _value) validateAddress(_to) unlessTimeLocked(_to) isNotFrozen(_to) public returns (bool) 
    {
        return super.transfer(_to, _value);
    }

    /**
    * @dev Transfer tokens from one address to another
    * @param _from address The address which you want to send tokens from
    * @param _to address The address which you want to transfer to
    * @param _value uint256 the amount of tokens to be transferred
    */
    // function transferFrom(address _from, address _to, uint _value) onlyWhenUnlocked unlessFrozen validDestination(_to) returns (bool) 
    function transferFrom(address _from, address _to, uint _value) validateAddress(_to) unlessTimeLockedFrom(_from, _to) isNotFrozenFrom(_from, _to) public returns (bool) 
    {
        return super.transferFrom(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public validateAddress(_spender) isNotFrozen(_spender) unlessTimeLocked(_spender) returns (bool) 
    {
        return super.approve(_spender, _value);
    }

    function increaseAllowance( address _spender, uint256 _addedValue ) public validateAddress(_spender) isNotFrozen(_spender) unlessTimeLocked(_spender) returns (bool)
    {
        return super.decreaseAllowance(_spender, _addedValue);
    }

    function decreaseAllowance(address _spender, uint256 _subtractedValue) public validateAddress(_spender) isNotFrozen(_spender) unlessTimeLocked(_spender) returns (bool)
    {
        return super.decreaseAllowance(_spender, _subtractedValue);
    }

    /**
    * @dev Burns a specific amount of tokens.
    * @param value The amount of token to be burned.
    */
    function burn(uint256 value) public onlyOwner{
        return super.burn(value);
    }

    /**
    * @dev Burns a specific amount of tokens from the target address and decrements allowance
    * @param from address The address which you want to send tokens from
    * @param value uint256 The amount of token to be burned
    */
    function burnFrom(address from, uint256 value) public onlyOwner validateAddress(from){
        return super.burnFrom(from, value);
    }

    /**
    * @dev Token Contract Emergency Drain
    * @param _token - Token to drain
    * @param _amount - Amount to drain
    */
    function emergencyERC20Drain( IERC20 _token, uint _amount ) public onlyOwner {
        _token.transfer( owner(), _amount );
    }
}   

