var ContestController = artifacts.require("./ContestController")

contract('ContestController', function(accounts) {
 var ContestControllerInstance;
 var ContestOwner = accounts[1];
 var ContestHash;

  it("should create a only simple contest", async function() {
    return ContestController.deployed().then(function(instance){
      ContestControllerInstance = instance;
      return ContestControllerInstance.setNewContest(
        "Concurso Fotográfico Cartel Fiestas Barcelona",
        "Popular",
        1533081600, // 01/08/2018 00:00:00
        1534291200, // 15/08/2018 00:00:00
        1535759999, // 31/08/2018 23:59:59
        0, // unlimited
        5, // tax for candidature
        "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA",{from: ContestOwner,value:5000000}).then(function(data){
          ContestHash = data[0];
        })
    })
    Console.log(ContestHash);
    assert.isTrue(true);
  });

  
});
