var accounts, account;
var myConferenceInstance;

// Initialize
function initializeConference() {
    $.getJSON('EventTickets.json', function(data) {
    var EventTicketsArtifact = data;
    EventTickets = TruffleContract(EventTicketsArtifact);

    // Set the provider for our contract.
    EventTickets.setProvider(web3Provider);
    console.log('Here');
    console.log('Event Tickets', EventTickets);
    EventTickets.deployed().then(
    function(instance) {
        console.log('Event Tickets contract instance', instance);
        myConferenceInstance = instance;
        $("#confAddress").html(myConferenceInstance.address);
        console.log('The contract address', instance.address);
        checkValues();
    }).catch(
        function(err) {
            console.log('Contract is not deployed???');
            console.log(err);
    });
    });
}

function logContractEvents() {
    myConferenceInstance.allEvents( function(error, events) {
        console.log(events);
    });
}

// Check Values
function checkValues() {
    console.log('In check values');
	myConferenceInstance.quota.call().then(
		function(quota) {
			$("input#confQuota").val(quota);
			return myConferenceInstance.organizer.call();
	}).then(
		function(organizer) {
			$("input#confOrganizer").val(organizer);
			return myConferenceInstance.numRegistrants.call();
	}).then(
		function(num) {
			$("#numRegistrants").html(num.toNumber());
			return myConferenceInstance.organizer.call();
	});
}

// Destroy
function destroy() {
    console.log("Destroying contract");
	myConferenceInstance.destroy({from: organizer_account})
	.then(
		function() {
			return web3.eth.getBalance(myConferenceInstance.address);
		})
    .catch(
        function() {
        logContractEvents();
        console.log('Failed to self-destruct - can only be initialized by organiser!!!!!!')
        return web3.eth.getBalance(myConferenceInstance.address);
    })
	.then(
		function(contract_balance) {
			if (contract_balance == 0) {
				var msgResult;
				msgResult = "Contract destroyed";
			} else {
				msgResult = "Destroy failed: contract still has balance";
			}
			$("#destroyResults").html(msgResult);
			return
		});
}

// Change Quota
function changeQuota(val) {
    if (val > 0) {
	myConferenceInstance.changeQuota(val, {from: organizer_account})
	.then(
		function() {
			return myConferenceInstance.quota.call();
		})
    .catch(
        function() {
        logContractEvents();
        console.log('Failed change quota!!!!!!')
        return myConferenceInstance.quota.call();
    })
	.then(
		function(quota) {
			if (quota == val) {
				var msgResult;
				msgResult = "Change successful";
			} else {
				msgResult = "Change failed";
			}
			$("#changeQuotaResult").html(msgResult);
			return quota
		})
    .then(
        function(quota) {
            $("input#confQuota").val(quota);
    });
} else {
    $("#changeQuotaResult").html("Invalid Quota value");
    myConferenceInstance.quota.call()
    .then(
        function(quota) {
            $("input#confQuota").val(quota);
    });

}
}

// buyTicket
function buyTicket(buyerAddress, ticketPrice) {
    // Get initial paid amount for current buyer
    myConferenceInstance.registrantsPaid.call(buyerAddress)
    .then(
        function(initialPaid) {
            myConferenceInstance.buyTicket({ from: buyerAddress, value: ticketPrice })
            .then(
                function() {
                    console.log('Buy suceessful !!!!!!!')
                    return myConferenceInstance.numRegistrants.call();
                })
            .catch(
                function() {
                logContractEvents();
                console.log('Failed to buy - quota reached!!!!!!')
                return myConferenceInstance.numRegistrants.call();
            })
            .then(
                function(num) {
                    $("#numRegistrants").html(num.toNumber());
                    return myConferenceInstance.registrantsPaid.call(buyerAddress);
                })
            .then(
                function(newValuePaid) {
                    var msgResult;
                    console.log('Buy results', newValuePaid.toNumber(), initialPaid.toNumber(), ticketPrice)
                    if (newValuePaid.toNumber() - initialPaid.toNumber() == ticketPrice) {
                        msgResult = "Purchase successful";
                    } else {
                        msgResult = "Purchase failed";
                    }
                    $("#buyTicketResult").html(msgResult);
                });
	});
}

// refundTicket
function refundTicket(buyerAddress, refundAmount) {
		var msgResult;
        console.log('In the refund logic', refundAmount)
		myConferenceInstance.registrantsPaid.call(buyerAddress).then(
		function(initialPaid) {
		    console.log('HERE!!!!!')
            console.log(initialPaid)
			if (initialPaid.toNumber() == 0) {
				$("#refundTicketResult").html("Buyer is not registered - no refund!");
			} else {
			    console.log('Registration found')
			    console.log(initialPaid.toNumber())
				myConferenceInstance.refundTicket(
				    buyerAddress, refundAmount, {from: organizer_account})
				    .then( function() {
					    console.log('Here after contract call')
						return myConferenceInstance.numRegistrants.call();
					})
                    .catch(
                        function() {
                        logContractEvents();
                        console.log('Refund failed');
                        return myConferenceInstance.numRegistrants.call();
                    })
					.then(
					function(num) {
					    console.log('Will decrease the number of participants', num.toNumber())
						$("#numRegistrants").html(num.toNumber());
						return myConferenceInstance.registrantsPaid.call(buyerAddress);
					})
					.then(
					  function(valuePaid) {
					  logContractEvents();
					    console.log('Add message about refund', valuePaid.toNumber());
						if (initialPaid.toNumber() - valuePaid.toNumber() == refundAmount) {
							msgResult = "Refund successful";
						} else {
							msgResult = "Refund failed";
						}
						$("#refundTicketResult").html(msgResult);
					});
			}
	    });
}

window.onload = function() {
    if (typeof web3 !== 'undefined') {
        web3Provider = web3.currentProvider;
    } else {
        // If no injected web3 instance is detected, fall back to Ganache
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(web3Provider);
    console.log(web3);
    console.log('Getting development accounts');
    accounts = web3.eth.accounts;
    organizer_account = accounts[0];
    buyer_account = accounts[1];
    console.log('Organizer account: ', organizer_account);
    console.log('Buyer account: ', buyer_account)
    console.log('Initializing Event Tickets DApp')
    initializeConference();

	// Wire up the UI elements
	$("#changeQuota").click(function() {
		var val = $("#confQuota").val();
		changeQuota(val);
	});

	$("#buyTicket").click(function() {
		var val = $("#ticketPrice").val();
		var buyerAddress = $("#buyerAddress").val();
		buyTicket(buyerAddress, web3.toWei(val));
	});

	$("#refundTicket").click(function() {
		var val = $("#refundAmount").val();
		var buyerAddress = $("#refBuyerAddress").val();
		refundTicket(buyerAddress, web3.toWei(val));
	});

    $("#destroy").click(function() {
        destroy();
    });

	// Set value of wallet to accounts[1]
	$("#buyerAddress").val(buyer_account);
	$("#refBuyerAddress").val(buyer_account);

};