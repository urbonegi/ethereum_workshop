const EventTickets = artifacts.require("EventTickets");

contract("EventTickets", accounts => {
  it("Testing initial contract variables", function(done) {
    EventTickets.deployed()  // accessing deployed EventTickets contract
    .then(function(instance){
        instance.quota.call()
        .then(quota => {
            assert.equal(
              quota,
              100,
              "Initial tickets quota has to be 100!"
            );
        })
        .then(function() {
          return instance.numRegistrants.call();
        })
        .then(function(num) {
            assert.equal(
                num,
                0,
                "Initial number of registrants should be zero!"
            );
          return instance.organizer.call();
        })
        .then(function(organizer) {
            assert.equal(
                organizer,
                accounts[0],
                "Organiser doesn't match!");
            done();
        })
        .catch(done);
    });
  });

it("Should issue a refund by owner only", function(done) {
  EventTickets.deployed()  // accessing deployed EventTickets contract
  .then(function(instance) {
      var ticketPrice = web3.utils.toWei('0.05', 'ether');
      web3.eth.getBalance(instance.address)
      .then(
        function(initialBalance) {
          instance.buyTicket({ from: accounts[1], value: ticketPrice })
             .then(
               function() {
                 return web3.eth.getBalance(instance.address)
             })
             .then(
               function(newBalance) {
                 var difference = newBalance - initialBalance;
                 assert.equal(difference, ticketPrice, "Difference should be what was sent");

                 // Now try to issue refund as second user - should fail
                 return instance.refundTicket(accounts[1], ticketPrice, {from: accounts[1]});
             })
             .then(
                function() {
                 assert.fail('Should never reach this code here: refundTicket should only allow owners access.');
             })
             .catch(
                function() {
                 return web3.eth.getBalance(instance.address)
             })
             .then(
               function(balance) {
                   assert.equal(balance, ticketPrice, "Balance should be unchanged");

                   // Now try to issue refund as organizer/owner - should work
                   return instance.refundTicket(accounts[1], ticketPrice, {from: accounts[0]});
             })
             .then(
                function() {
                  return web3.eth.getBalance(instance.address)
             })
             .then(
                function(postRefundBalance) {
                    assert.equal(postRefundBalance, initialBalance, "Balance should be initial balance");
                    done();
             })
             .catch(done);
    });
  }).catch(done);
});


it("Allow buy multiple times, refund one by one", function(done) {
  EventTickets.deployed()  // accessing deployed EventTickets contract
  .then(function(instance) {
      var ticketPrice = web3.utils.toWei('0.05', 'ether');
      web3.eth.getBalance(instance.address)
      .then(
        function(initialBalance) {
          instance.buyTicket({ from: accounts[1], value: ticketPrice })
             .then(
               function() {
                 return web3.eth.getBalance(instance.address)
             })
             .then(
               function(balanceAfterFirstPurchase) {
                 assert.equal(balanceAfterFirstPurchase, ticketPrice, "Balance should be 1 ticket price");

                 // Buy ticket second time
                 return instance.buyTicket({ from: accounts[1], value: ticketPrice });
             })
             .then(
                function() {
                  return web3.eth.getBalance(instance.address)
             })
             .then(
               function(balanceAfterSecondPurchase) {
                 assert.equal(balanceAfterSecondPurchase, 2*ticketPrice, "Balance should be what was sent twice");

                 // Registrants paid should be 2 ticket prices
                 return instance.registrantsPaid.call(accounts[1])
             })
             .then(
                 function(registrantsPaid) {
                   assert.equal(registrantsPaid, 2*ticketPrice, "Difference should be what was sent twice");

                   // Now try to issue refund as organizer/owner - should refund 1 price
                   return instance.refundTicket(accounts[1], ticketPrice, {from: accounts[0]});
             })
             .then(
                function() {
                  return web3.eth.getBalance(instance.address)
             })
             .then(
                function(postRefundBalance) {
                    assert.equal(postRefundBalance, ticketPrice, "Balance should be 1 ticketPrice");
                    return instance.registrantsPaid.call(accounts[1])
             })
             .then(
                function(registrantsPaid) {
                    assert.equal(registrantsPaid, ticketPrice, "The amount registrants paid should only decrease per 1 refund");
                    done();
             })
             .catch(done);
    });
  }).catch(done);
});

});

