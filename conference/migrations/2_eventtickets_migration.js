const EventTickets = artifacts.require("EventTickets");

module.exports = function(deployer) {
  deployer.deploy(EventTickets);
};
