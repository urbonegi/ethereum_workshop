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
        }).then(function(num) {
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
});

