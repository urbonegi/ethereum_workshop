const EventTickets = artifacts.require("EventTickets");

module.exports = function(deployer, network, accounts) {
  // Change accounts id if want to set organiser as some other account
  deployer.deploy(EventTickets, {from: accounts[0]});
};
