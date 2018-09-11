const ContestController = artifacts.require("ContestController");
const Contest = require("./contestBulkData.json");
contract('ContestController', function (accounts) {

  beforeEach(async function () {
    instance = await ContestController.deployed();
  });

  describe("Contest functions without errors: ", async function () {
    //setNewContest()
    it("Should set a new contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        let tx = await instance.setNewContest(
          Contest.setNewContest[i].title,
          Contest.setNewContest[i].tags,
          Contest.setNewContest[i].initialDate,
          Contest.setNewContest[i].candidatureLimitDate,
          Contest.setNewContest[i].endDate,
          Contest.setNewContest[i].taxForCandidatures,
          Contest.setNewContest[i].ipfsHash,
          Contest.setNewContest[i].initialJudge,
          Contest.setNewContest[i].judgeName,
          Contest.setNewContest[i].initialJudgeWeight,
          { from: Contest.setNewContest[i].contestOwner, value: Contest.setNewContest[i].award });
        assert.equal(tx.logs[1].args.contestHash, Contest.contestHash[i], "The result must be the contestHash");
      };

    });

    //getContest()
    it("Should get all contests by hash", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getContest(Contest.contestHash[i]);
        assert.equal(tx[1], Contest.setNewContest[i].title, "The result must be: ", Contest.setNewContest[i].title);
      };
    });
    //getTotalContestsCount()
    it("Should get total contest count", async function () {
      let tx = await instance.getTotalContestsCount();
      assert.equal(tx.c, Contest.setNewContest.length, "The result must be: ", Contest.setNewContest.length);
    });
    //FIXME:
    //getAllTags()
    it("Should get all tags", async function () {
      let tx = await instance.getAllTags();
      assert.notEqual(tx, undefined, "The result must be different from undefined");
    });
  });



  describe("Contest functions catching errors: ", async function () {
    //Not setNewContest() award is 0
    it("Should not set a new contest because award is 0", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.setNewContest(
            Contest.setNewContest[i].title,
            Contest.setNewContest[i].tags,
            Contest.setNewContest[i].initialDate,
            Contest.setNewContest[i].candidatureLimitDate,
            Contest.setNewContest[i].endDate,
            Contest.setNewContest[i].taxForCandidatures,
            Contest.setNewContest[i].ipfsHash,
            Contest.setNewContest[i].initialJudge,
            Contest.setNewContest[i].judgeName,
            { from: Contest.setNewContest[i].contestOwner, value: 0 });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        };
      };
    });
    //Not setNewContest() missing parameters
    it("Should not set a new contest because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.setNewContest(
            Contest.setNewContest[i].title,
            Contest.setNewContest[i].initialDate,
            Contest.setNewContest[i].candidatureLimitDate,
            Contest.setNewContest[i].endDate,
            Contest.setNewContest[i].taxForCandidatures,
            Contest.setNewContest[i].ipfsHash,
            Contest.setNewContest[i].initialJudge,
            Contest.setNewContest[i].judgeName,
            { from: Contest.setNewContest[i].contestOwner, value: Contest.setNewContest[i].award });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        };
      };
    });
    //Not getContest() hashcontest is wrong
    it("Should not get a contest by hash because contest hash is wrong", async function () {
      let tx = await instance.getContest(Contest.setNewContest[0].contestOwner);
      assert.notEqual(tx[1], Contest.setNewContest[0].tittle, "The result must be different");
    });
  });



  describe("Judge functions without errors: ", async function () {
    //addJudge()
    it("Should add a new judge member", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.addJudge(
          Contest.contestHash[i],
          Contest.newJudge[i].account,
          Contest.newJudge[i].name,
          Contest.setNewContest[i].initialJudgeWeight,
          { from: Contest.setNewContest[i].contestOwner });
        assert.isTrue(tx.logs[0].args.isMember);
      };
    });
    //removeJudge()
    it("Should remove a judge member from contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.removeJudge(
          Contest.contestHash[i],
          Contest.newJudge[i].account,
          { from: Contest.setNewContest[i].contestOwner });
        assert.isFalse(tx.logs[0].args.isMember);
      };
    });
    //getJudgeDetails()
    it("Should get judge details", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getJudgeDetails(
          Contest.contestHash[i],
          Contest.setNewContest[i].initialJudge);
        assert.equal(tx[1], Contest.setNewContest[i].judgeName, "The result must be: ", Contest.setNewContest[i].judgeName);
      };
    });
    //getContestJudges()
    it("Should get judge by contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getContestJudges(
          Contest.contestHash[i]);
        assert.equal(tx[0], Contest.setNewContest[i].initialJudge, "The result must be: ", Contest.setNewContest[i].initialJudge);
      };
    });
  });



  describe("Judge functions catching errors: ", async function () {
    //NOT addJudge() out of time
    it("Should not add a new judge member because out of time", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].endDate);
        try {
          let tx = await instance.addJudge(
            Contest.contestHash[i],
            Contest.newJudge[i].account,
            Contest.newJudge[i].name,
            Contest.setNewContest[i].initialJudgeWeight,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    it("Should not add a new judge member because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.addJudge(
            Contest.newJudge[i].account,
            Contest.newJudge[i].name,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT addJudge() wrong contest hash
    it("Should not add a new judge member because contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.addJudge(
            Contest.newJudge[i].account,
            Contest.newJudge[i].account,
            Contest.newJudge[i].name,
            Contest.setNewContest[i].initialJudgeWeight,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    it("Should not add a new judge member because the JudgeAddress already exists in the contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.addJudge(
            Contest.contestHash[i],
            Contest.setNewContest[i].initialJudge,
            Contest.setNewContest[i].judgeName,
            Contest.setNewContest[i].initialJudgeWeight,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT removeJudge() missing parameters
    it("Should not remove a judge member from contest because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.removeJudge(
            Contest.setNewContest[i].initialJudge,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT removeJudge() wrong contest hash
    it("Should not remove a judge member from contest because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.removeJudge(
            Contest.setNewContest[i].initialJudge,
            Contest.setNewContest[i].initialJudge,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    it("Should not remove a judge member from contest because the judge has already been eliminated", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].createdDate);
        try {
          let tx = await instance.removeJudge(
            Contest.contestHash[i],
            Contest.newJudge[i].account,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });

    //NOT removeJudge() out of time
    it("Should not remove a judge member from contest because out of time", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(Contest.setNewContest[i].endDate);
        try {
          let tx = await instance.removeJudge(
            Contest.contestHash[i],
            Contest.setNewContest[i].initialJudge,
            { from: Contest.setNewContest[i].contestOwner });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getJudgeDetails()
    it("Should not get a judge details because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.getJudgeDetails(
            Contest.setNewContest[i].initialJudge);
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getJudgeDetails()
    it("Should not get a judge details because does not exists", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getJudgeDetails(
          Contest.contestHash[i],
          Contest.newJudge[i].account);
        assert.equal(tx[2].c, 0, "The result must be: ", 0);
      };
    });
    //NOT getJudgeDetails()
    it("Should not get a judge details because contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getJudgeDetails(
          Contest.newJudge[i].account,
          Contest.setNewContest[i].initialJudge);
        assert.equal(tx[2].c, 0, "The result must be: ", 0);
      };
    });
    //NOT getContestJudges()
    it("Should not get judge by contest because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.getContestJudges();
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getContestJudges()
    it("Should not get judge by contest because contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getContestJudges(
          Contest.setNewContest[i].title);
        assert.equal(tx, "", "The result must be: ");
      };
    });
  });



  describe("Candidatures functions without errors: ", async function () {
    //setNewCandidature()
    it("Should add 10 new candidature for each contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          let txTime = await instance.setTime(1538590332);
          let tx = await instance.setNewCandidature(
            Contest.contestHash[i],
            Contest.candidature[j].title,
            Contest.candidature[j].hash,
            { from: Contest.candidature[j].account, value: 5 });
          assert.equal(tx.logs[0].args.candidatureTitle, Contest.candidature[j].title, "The result must be:'" + Contest.candidature[j].title + "'");
        };
      };
    });
    //getCandidature()
    it("Should get a candidature by hash contest and hash candidature", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          let tx = await instance.getCandidature(
            Contest.contestHash[i],
            Contest.candidature[j].hash);
          assert.equal(tx[0], Contest.candidature[j].title, "The result must be:'" + Contest.candidature[j].title + "'");
        };
      };
    });
    //getCandidaturesByContest()
    it("Should get the candidatures by contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getCandidaturesByContest(
          Contest.contestHash[i]);

        for (let j = 0; j < Contest.candidature.length; j++) {
          assert.equal(tx[j], Contest.candidature[j].hash, "The result must be:'" + Contest.candidature[j].hash + "'");
        };
      };
    });
    //getTotalCandidaturesByContest()
    it("Should get the total candidatures by contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getTotalCandidaturesByContest(
          Contest.contestHash[i]);
        assert.equal(tx.c, 10, "The result must be: 10 ");
      };
    });
    //getOwnCandidatures()
    it("Should get own candidatures by contest and candidate", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          let tx = await instance.getOwnCandidatures(
            Contest.contestHash[i],
            { from: Contest.candidature[j].account });
          assert.equal(tx[0], Contest.candidature[j].hash, "The result must be:'" + Contest.candidature[j].hash + "'");
        };
      };
    });
    //cancelCandidature()
    it("Should cancel a candidature", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.cancelCandidature(
          Contest.contestHash[i],
          Contest.candidature[0].hash,
          "Publicidad",
          { from: Contest.setNewContest[i].initialJudge }
        );
        assert.equal(tx.logs[0].args.candidatureTitle, Contest.candidature[0].title, "The result must be:'" + Contest.candidature[0].title + "'");
      };
    });
  });



  describe("Candidatures functions catching errors: ", async function () {
    //NOT setNewCandidature()
    it("Should not add 10 new candidature for each contest because missing", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let txTime = await instance.setTime(1538590332);
            let tx = await instance.setNewCandidature(
              Contest.contestHash[i],
              Contest.candidature[j].title,
              { from: Contest.candidature[j].account, value: 5 });
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT setNewCandidature()
    it("Should not add 10 new candidature for each contest because the stack is over required", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let tx = await instance.setNewCandidature(
              Contest.contestHash[i],
              Contest.candidature[j].title,
              Contest.candidature[j].hash,
              { from: Contest.candidature[j].account, value: 1 });
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT setNewCandidature()
    it("Should not add 10 new candidature for each contest because the caller is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let tx = await instance.setNewCandidature(
              Contest.contestHash[i],
              Contest.candidature[j].title,
              Contest.candidature[j].hash,
              { from: Contest.setNewContest[i].initialJudge, value: 5 });
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT setNewCandidature()
    it("Should not add 10 new candidature for each contest because the canditure already exists", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let tx = await instance.setNewCandidature(
              Contest.contestHash[i],
              Contest.candidature[j].title,
              Contest.candidature[j].hash,
              { from: Contest.candidature[j].account, value: 5 });
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT setNewCandidature()
    it("Should not add 10 new candidature for each contest because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let tx = await instance.setNewCandidature(
              Contest.candidature[j].hash,
              Contest.candidature[j].title,
              Contest.candidature[j].hash,
              { from: Contest.candidature[j].account, value: 5 });
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT setNewCandidature()
    it("Should not add 10 new candidature for each contest because the time is over", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let txTime = await instance.setTime(1999590332);
            let tx = await instance.setNewCandidature(
              Contest.contestHash[i],
              Contest.candidature[j].title,
              Contest.candidature[j].hash,
              { from: Contest.candidature[j].account, value: 5 });
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT getCandidature()
    it("Should not get a candidature by hash contest and hash candidature because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let tx = await instance.getCandidature(
              Contest.candidature[j].hash);
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT getCandidature()
    it("Should not get a candidature by hash contest and hash candidature because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        for (let j = 0; j < Contest.candidature.length; j++) {
          try {
            let tx = await instance.getCandidature(
              Contest.candidature[j].hash,
              Contest.candidature[j].hash);
            test = false;
          } catch (e) {
            test = true;
          } finally {
            assert.isTrue(test, "The result must be 'ERROR'");
          }
        };
      };
    });
    //NOT getTotalCandidaturesByContest()
    it("Should not get the total candidatures by contest because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.getTotalCandidaturesByContest(
            Contest.candidature[i].hash);
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getTotalCandidaturesByContest()
    it("Should not get the total candidatures by contest because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.getTotalCandidaturesByContest();
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });

    //NOT cancelCandidature()
    it("Should not cancel a candidature because the time is over", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.cancelCandidature(
            Contest.contestHash[i],
            Contest.candidature[0].hash,
            "Publicidad",
            { from: Contest.setNewContest[i].initialJudge }
          );
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT cancelCandidature()
    it("Should not cancel a candidature because the judge account is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1538590332);
          let tx = await instance.cancelCandidature(
            Contest.contestHash[i],
            Contest.candidature[0].hash,
            "Publicidad",
            { from: Contest.candidature[i].account }
          );
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT cancelCandidature()
    it("Should not cancel a candidature because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.cancelCandidature(
            Contest.candidature[0].hash,
            { from: Contest.setNewContest[i].initialJudge }
          );
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT cancelCandidature()
    it("Should not cancel a candidature because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.cancelCandidature(
            Contest.candidature[i].hash,
            Contest.candidature[0].hash,
            "Publicidad",
            { from: Contest.setNewContest[i].initialJudge }
          );
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getOwnCandidatures() missing parameters
    it("Should not get own candidatures by contest and candidate because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1538590332);
        try {
          let tx = await instance.getOwnCandidatures(
            { from: Contest.candidature[j].account });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getOwnCandidatures() missing parameters
    it("Should not get own candidatures by contest and candidate because caller doesn't have candidature", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getOwnCandidatures(
          Contest.contestHash[i],
          { from: Contest.setNewContest[i].initialJudge });
        assert.equal(tx, "", "The result must be: ");

      };
    });
    //NOT getOwnCandidatures() missing parameters
    it("Should not get own candidatures by contest and candidate because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let tx = await instance.getOwnCandidatures(
            Contest.setNewContest[i].initialJudge,
            { from: Contest.setNewContest[i].initialJudge });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
  });



  describe("Votation functions without errors: ", async function () {
    //setNewVote()
    it("Should add a new vote", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1539388801);
        let tx = await instance.setNewVote(
          Contest.contestHash[i],
          Contest.candidature[1].hash,
          { from: Contest.setNewContest[i].initialJudge });
        assert.equal(tx.logs[0].args.candidatureHash, Contest.candidature[1].hash, "The result must be:'" + Contest.candidature[1].hash + "'");
      };
    });
  });
  
  describe("Votation functions catching errors: ", async function () {
    //NOT setNewVote()
    it("Should not add a new vote because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try{
        let txTime = await instance.setTime(1539388801);
        let tx = await instance.setNewVote(
          Contest.contestHash[i],
          { from: Contest.setNewContest[i].initialJudge });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
        //NOT setNewVote()
        it("Should not add a new vote because the contest hash is wrong", async function () {
          for (let i = 0; i < Contest.setNewContest.length; i++) {
            try{
            let txTime = await instance.setTime(1539388801);
            let tx = await instance.setNewVote(
              Contest.contestHash[i],
              Contest.contestHash[i],
              { from: Contest.setNewContest[i].initialJudge });
              test = false;
            } catch (e) {
              test = true;
            } finally {
              assert.isTrue(test, "The result must be 'ERROR'");
            }
          };
        });
        //NOT setNewVote()
        it("Should not add a new vote because the judge does not exists", async function () {
          for (let i = 0; i < Contest.setNewContest.length; i++) {
            try{
            let txTime = await instance.setTime(1539388801);
            let tx = await instance.setNewVote(
              Contest.contestHash[i],
              Contest.candidature[2].hash,
              { from: Contest.newJudge[i].account });
              test = false;
            } catch (e) {
              test = true;
            } finally {
              assert.isTrue(test, "The result must be 'ERROR'");
            }
          };
        });
    //NOT setNewVote()
    it("Should not add a new vote because the judge has already voted", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try{
        let txTime = await instance.setTime(1539388801);
        let tx = await instance.setNewVote(
          Contest.contestHash[i],
          Contest.candidature[1].hash,
          { from: Contest.setNewContest[i].initialJudge });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
  });
  
  describe("Solve Contest and Refund functions without errors: ", async function () {
    //solveContest()
    it("Should solve all contests", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1540252801);
        let tx = await instance.solveContest(
          Contest.contestHash[i])
        assert.equal(tx.logs[0].args.winnersAddresses[0], Contest.candidature[1].account, "The result must be:'" + Contest.candidature[1].account + "'");
      };
    });
    //getWinner()
    it("Should get winner of all contests", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1540252801);
        let tx = await instance.getContestWinners(
          Contest.contestHash[i])
        assert.equal(tx[0], Contest.candidature[1].account, "The result must be:'" + Contest.candidature[1].account + "'");
      };
    });
    //getContestWinners()
    it("Should get winner of all contests", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1540252801);
        let tx = await instance.getContestWinners(
          Contest.contestHash[i])
        assert.equal(tx[0], Contest.candidature[1].account, "The result must be:'" + Contest.candidature[1].account + "'");
      };
    });
    //refuntToCandidates()
    it("Should refund award to winner of all contests", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1540252801);
        let tx = await instance.refundToCandidates(
          Contest.contestHash[i],
          { from: Contest.candidature[1].account });
        assert.equal(tx.receipt.status, "0x01", "The result must be: '0x01'");
      };
    });
    //refuntToCandidates()
    it("Should refund stake to candidates of all contests", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1540252801);
        let tx = await instance.refundToCandidates(
          Contest.contestHash[i],
          { from: Contest.candidature[3].account });
        assert.equal(tx.receipt.status, "0x01", "The result must be: '0x01'");
      };
    });
  });

  describe("Solve Contest and Refund functions catching errors: ", async function () {
    //NOT solveContest()
    it("Should not solve all contests because is not time to do", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1000252801);
          let tx = await instance.solveContest(
            Contest.contestHash[i])
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT solveContest()
    it("Should not solve all contests because missing paramaters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.solveContest()
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT solveContest()
    it("Should not solve all contests because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.solveContest(
            Contest.candidature[i].account)
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT solveContest()
    it("Should not solve all contests because the contest has already solved", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.solveContest(
            Contest.contestHash[i])
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getWinner()
    it("Should not get winner of all contests because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.getWinner()
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getWinner()
    it("Should not get winner of all contests because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.getWinner(
            Contest.candidature[i].account)
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });

    //NOT getContestWinners()
    it("Should not get winner of all contests because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.getContestWinners()
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT getContestWinners()
    it("Should not get winner of all contests because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.getContestWinners(
            Contest.candidature[i].account)
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT refundToCandidates
    it("Should not refund to candidates of all contests because missing parameters", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.refundToCandidates(
            Contest.contestHash[i],
            { from: Contest.candidature[1].account });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT refundToCandidates
    it("Should not refund to candidates of all contests because the contest hash is wrong", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.refundToCandidates(
            Contest.candidature[i].account,
            { from: Contest.candidature[1].account });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT refundToCandidates
    it("Should not refund stake to candidate of all contests because the stake has already refunded", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.refundToCandidates(
            Contest.contestHash[i],
            { from: Contest.candidature[3].account });
          console.log("TX: ", tx)
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT refundToCandidates
    it("Should not refund award to winner of all contests because the award has already refunded", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1540252801);
          let tx = await instance.refundToCandidates(
            Contest.contestHash[i],
            { from: Contest.candidature[1].account });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
    //NOT refundToCandidates
    it("Should not refund to candidates of all contests because is not time to do", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        try {
          let txTime = await instance.setTime(1000252801);
          let tx = await instance.refundToCandidates(
            Contest.contestHash[i],
            { from: Contest.candidature[1].account });
          test = false;
        } catch (e) {
          test = true;
        } finally {
          assert.isTrue(test, "The result must be 'ERROR'");
        }
      };
    });
  });
});


