var ContestController = artifacts.require("./ContestController.sol");

module.exports = function(deployer) {
  deployer.deploy(ContestController);
};
