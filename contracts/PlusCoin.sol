// Lee, July 29, 2018
pragma solidity 0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import './Freezable.sol';

contract PlusCoin is ERC20Burnable, Freezable
{
    string  public  constant name       = "PlusCoin";
    string  public  constant symbol     = "NPLC";
    uint8   public  constant decimals   = 18;
    
    event Burn(address indexed _burner, uint _value);

    constructor( address _registry, uint _totalTokenAmount ) public
    {
        _mint(_registry, _totalTokenAmount);
        addSuperAdmin(_registry);
    }


    /**
    * @dev Transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */    
    function transfer(address _to, uint _value) public validateAddress(_to) isNotFrozen(_to) returns (bool) 
    {
        return super.transfer(_to, _value);
    }

    /**
    * @dev Transfer tokens from one address to another
    * @param _from address The address which you want to send tokens from
    * @param _to address The address which you want to transfer to
    * @param _value uint256 the amount of tokens to be transferred
    */
    function transferFrom(address _from, address _to, uint _value) public validateAddress(_to)  isNotFrozenFrom(_from, _to) returns (bool) 
    {
        return super.transferFrom(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public validateAddress(_spender) isNotFrozen(_spender)  returns (bool) 
    {
        return super.approve(_spender, _value);
    }

    function increaseAllowance( address _spender, uint256 _addedValue ) public validateAddress(_spender) isNotFrozen(_spender)  returns (bool)
    {
        return super.increaseAllowance(_spender, _addedValue);
    }

    function decreaseAllowance(address _spender, uint256 _subtractedValue) public validateAddress(_spender) isNotFrozen(_spender)  returns (bool)
    {
        return super.decreaseAllowance(_spender, _subtractedValue);
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

