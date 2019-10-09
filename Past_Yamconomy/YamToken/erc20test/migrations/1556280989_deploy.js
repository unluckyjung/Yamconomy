var YamToken = artifacts.require("YamToken.sol");

module.exports = function(deployer) {
  deployer.deploy(YamToken);
};