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
    EventTickets.new({from: organizer_account, gas: 3141592}).then(
    function(conf) {
        console.log('Event Tickets contract instance', conf);
        myConferenceInstance = conf;
        $("#confAddress").html(myConferenceInstance.address);
        console.log('The contract address', conf.address);
        checkValues();
    });

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

// Change Quota
function changeQuota(val) {
	myConferenceInstance.changeQuota(val, {from: organizer_account}).then(
		function() {
			return myConferenceInstance.quota.call();
		}).then(
		function(quota) {
			if (quota == val) {
				var msgResult;
				msgResult = "Change successful";
			} else {
				msgResult = "Change failed";
			}
			$("#changeQuotaResult").html(msgResult);
		});
}

// buyTicket
function buyTicket(buyerAddress, ticketPrice) {

	myConferenceInstance.buyTicket({ from: buyerAddress, value: ticketPrice }).then(
		function() {
			return myConferenceInstance.numRegistrants.call();
		}).then(
		function(num) {
			$("#numRegistrants").html(num.toNumber());
			return myConferenceInstance.registrantsPaid.call(buyerAddress);
		}).then(
		function(valuePaid) {
			var msgResult;
			if (valuePaid.toNumber() == ticketPrice) {
				msgResult = "Purchase successful";
			} else {
				msgResult = "Purchase failed";
			}
			$("#buyTicketResult").html(msgResult);
		});
}

// refundTicket
function refundTicket(buyerAddress, refundAmount) {

		var msgResult;

		myConferenceInstance.registrantsPaid.call(buyerAddress).then(
		function(result) {
			if (result.toNumber() == 0) {
				$("#refundTicketResult").html("Buyer is not registered - no refund!");
			} else {
				myConferenceInstance.refundTicket(buyerAddress,
					refundAmount, {from: organizer_account}).then(
					function() {
						return myConferenceInstance.numRegistrants.call();
					}).then(
					function(num) {
						$("#numRegistrants").html(num.toNumber());
						return myConferenceInstance.registrantsPaid.call(buyerAddress);
					}).then(
					function(valuePaid) {
						if (valuePaid.toNumber() == 0) {
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
		var val = $("#ticketPrice").val();
		var buyerAddress = $("#refBuyerAddress").val();
		refundTicket(buyerAddress, web3.toWei(val));
	});

	// Set value of wallet to accounts[1]
	$("#buyerAddress").val(buyer_account);
	$("#refBuyerAddress").val(buyer_account);

};