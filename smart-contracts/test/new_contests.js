var newContest = artifacts.require("./ContestController")
contract('NewContests', function(accounts) {
  it("should assert true", function(done) {
    var new_contests = NewContests.deployed();
    assert.isTrue(true);
    done();
  });
});
