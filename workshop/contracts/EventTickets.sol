pragma solidity ^0.5.8;

contract EventTickets {

	address payable public organizer;
	mapping (address => uint) public registrantsPaid;
	uint public numRegistrants;
	uint public quota;

	event Deposit(address payable _from, uint _amount);  // log
	event Refund(address payable _to, uint _amount); // log
	event ValidationsPassed(address payable _sender, uint _value); // log

    // constructor
	constructor() public payable {
		organizer = msg.sender;
		quota = 100;
		numRegistrants = 0;
	}

	function buyTicket() public payable {
		require(numRegistrants < quota);
		emit ValidationsPassed(msg.sender, msg.value);
		registrantsPaid[msg.sender] += msg.value;
		numRegistrants++;
		emit Deposit(msg.sender, msg.value);
	}

	function changeQuota(uint newquota) public {
	    require(msg.sender == organizer && newquota > 0);
		emit ValidationsPassed(msg.sender, newquota);
		quota = newquota;
	}

	function refundTicket(address payable recipient, uint amount) public {
	    require(msg.sender == organizer);
		emit ValidationsPassed(msg.sender, amount);
		if (registrantsPaid[recipient] >= amount) {
			if (address(this).balance >= amount) {
				recipient.transfer(amount);
				emit Refund(recipient, amount);
				registrantsPaid[recipient] -= amount;
				numRegistrants--;
			}
		}
		return;
	}

	function destroy() public {
	    require(msg.sender == organizer);
		emit ValidationsPassed(msg.sender, address(this).balance);
	    selfdestruct(organizer);
	}
}