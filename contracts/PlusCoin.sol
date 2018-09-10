// Lee, July 29, 2018
pragma solidity ^0.4.24;
import './StandardToken.sol';

contract PlusCoin is StandardToken
{
    string 	public 	constant name 		= "PlusCoin";
    string 	public 	constant symbol 	= "NPLC";
    uint8 	public 	constant decimals 	= 18;
    
    event Burn(address indexed _burner, uint _value);

    constructor( address _registry, uint _totalTokenAmount ) public
    {
        totalSupply_ = _totalTokenAmount;
        balances[_registry] = _totalTokenAmount;
        addSuperAdmin(_registry);
        emit Transfer(address(0x0), _registry, _totalTokenAmount);
    }

    /**
     * @dev Token Contract Modifier
     * @param _to - Address to check if valid
     *
     *  Check if an address is valid
     *  A valid address is as follows,
     *    1. Not zero address
     *    2. Not token address
     */
    modifier validDestination( address _to )
    {
        require(_to != address(0x0));
        require(_to != address(this));
        _;
    }

    /**
    * @dev Transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */    
    // function transfer(address _to, uint _value) onlyWhenUnlocked unlessFrozen validDestination(_to) returns (bool) 
    function transfer(address _to, uint _value) unlessTimeLocked(msg.sender, _to) validDestination(_to) unlessFrozen public returns (bool) 
    {
        // require(allowTransfers || whitelistedTransferer[msg.sender]);
        // require(whitelistedTransferer[msg.sender]);
        // require(!frozenAccount[_to]);
        require(!frozenAccount[_to]);
        return super.transfer(_to, _value);
    }

    /**
    * @dev Transfer tokens from one address to another
    * @param _from address The address which you want to send tokens from
    * @param _to address The address which you want to transfer to
    * @param _value uint256 the amount of tokens to be transferred
    */
    // function transferFrom(address _from, address _to, uint _value) onlyWhenUnlocked unlessFrozen validDestination(_to) returns (bool) 
    function transferFrom(address _from, address _to, uint _value) unlessTimeLockedFrom(msg.sender, _from, _to) validDestination(_to) unlessFrozen public returns (bool) 
    {
        // require(allowTransfers);
        require(!frozenAccount[_from]);
        require(!frozenAccount[_to]);
        require(_from != msg.sender);
        // if(!whitelistedTransferer[_from])
        //     require(block.timestamp >= getLockFundsReleaseTime(_from));
        return super.transferFrom(_from, _to, _value);
    }

    /**
    * @dev Burns a specific amount of tokens.
    * @param _value The amount of token to be burned.
    */    
    function burn(uint _value) public returns (bool)
    {
        balances[msg.sender] = balances[msg.sender].sub(_value);
        totalSupply_ = totalSupply_.sub(_value);
        emit Burn(msg.sender, _value);
        emit Transfer(msg.sender, address(0x0), _value);
        return true;
    }

    /**
     * Destroy tokens from other account
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`.
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom(address _from, uint256 _value) public returns (bool) 
    {
        assert( transferFrom( _from, msg.sender, _value ) );
        return burn(_value);
    }

    /**
    * @dev Token Contract Emergency Drain
    * @param _token - Token to drain
    * @param _amount - Amount to drain
    */
    function emergencyERC20Drain( ERC20 _token, uint _amount ) public onlySuperAdmins {
        _token.transfer( owner, _amount );
    }

    /* This unnamed function is called whenever someone tries to send ether directly to the token contract */
    // function () public
    function () public payable 
    {
        revert(); // Prevents accidental sending of ether
    }

    // bool public allowTransfers;
    // function setAllowTransfers(bool _allowTransfers) public onlySuperAdmins returns (bool) {
    //     allowTransfers = _allowTransfers;
    //     return true;
    // }

}	

