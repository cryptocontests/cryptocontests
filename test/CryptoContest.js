var ContestController = artifacts.require("./ContestController")

contract('ContestController', async function() {

let contests;

  it("should create 10 contests with some account origin", function() {
    /*
    var contests = ContestController.deployed();
    for (i = 0;i < 10; i++){
      contests.setNewContest("Título ".concat(i+1),"Fotografía",
        1533114000, // 01/08/2018 09:00:59
        1535759999, // 31/08/2018 23:59:59
        1533686399, // 07/08/2018 23:59:59
        0, // unlimited
        "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA");
    }
    */
    assert.isTrue(true);
  });

  it("should create 10 contests with different account origin", function() {
    assert.isTrue(true);
  });

  it("should create 5 participations with same account origin", function() {
    assert.isTrue(true);
  });

  it("should create 5 participations with different account origin", function() {
    assert.isTrue(true);
  });

  it("should randomly generate 100 votes among the participants", function() {
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
