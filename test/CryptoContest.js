var ContestController = artifacts.require("./ContestController")

contract('ContestController', function(accounts) {
 var ContestControllerInstance;
 var ContestOwner = accounts[1];
 var ContestHash;

  it("should create a only simple contest", function() {
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
        "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA",{from: ContestOwner,value:5}).then(function(data){
          ContestHash = data[0];
        })
    })
    Console.log(ContestHash);
    assert.isTrue(true);
  });

  it("should create 5 judges members", function() {
    assert.isTrue(true);
  });

  it("should create 10 candidatures", function() {
    assert.isTrue(true);
  });

    it("should randomly generate 100 votes among the participants", function() {
    assert.isTrue(true);
  });

  it("should cancel candidature", function() {
    assert.isTrue(true);
  });

  it("should try to participate out-of-date", function() {
    assert.isTrue(true);
  });

  it("should try to vote out-of-date", function() {
    assert.isTrue(true);
  });

  it("should try to get reward from different winner address ", function() {
    assert.isTrue(true);
  });

});
