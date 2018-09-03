const ContestController = artifacts.require("ContestController");
const Contest = require("./contestBulkData.json");
contract('ContestController', function (accounts) {
  //Accounts of the ganache

  /*
   const ContestOwner = accounts[0];
  const JudgeAccount = accounts[1];
  const NewJudgeMember = accounts[2];
  const CandidatureAddress = accounts[3];
  //Contest constants
  //If you change these parameters: Title, InitialDate or ContestOwner; the ContestHash will change
  const Title = "Concurso Fotográfico Cartel Fiestas Barcelona";
  const Tags = ["6e6174757265"];
  const InitialDate = 1530784800;  // Thu, 05 Jul 2018 10:00:00 GMT
  const CandidatureLimitDate = 1535759999; //Fri, 31 Aug 2018 23:59:59 GMT
  const EndDate = 1538438399; // Mon, 01 Oct 2018 23:59:59 GMT
  const TaxForCandidatures = 5;
  const IpfsHash = "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA"
  const JudgeName = "Jordi";
  //Candidatures constants
  //If you change these parameters: TitleCandidature; the CandidatureHash will change
  const TitleCandidature = "Foto Torre Agbar"
  const Reason = "Publicidad";
  const CandidatureHash = "0xf00406f81d437b8fbc4cb66d328e1eec9b14572bcb00f629122be50f511c2b07";
  //Contest Hash generated
  const ContestHash = "0x9ecb1aea907659d8c4af62093cacbb0a2e02a6f9f1e7b279c38220ef1cf9ffc7";
  //Created date
  const CreatedDate = 1530403200;  // Sun, 01 Jul 2018 00:00:00 GMT
  //Present candidatures time
  const CandidaturesTime = 1535758999;
  //Vote time
  const VoteTime = 1538437399;
  //Out time
  const OutTimeJudge = 1530784801;
  const OutTimeCandidatures = 1535760000;

  //Check address
  let instance;
  let test = true;
  console.log('**************************');
  
 
  console.log('Judge use to addJudge test: "'+NewJudgeMember+'"');
  console.log('Participant address: "'+CandidatureAddress+'"');
  console.log('contest: ',Contest.setNewContest[1].judgeName)
  console.log('**************************');
 */

  beforeEach(async function () {
    instance = await ContestController.deployed();
  });

  describe("Contest functions without errors: ", async function () {
    //setNewContest()
    it("Should set 10 new contest", async function () {
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
    //FIXME: Ahora mismo no le paso tags asi que devuelve undefined
     //getAllTags()
    it("Should get all tags", async function(){
      let tx = await instance.getAllTags();
      assert.notEqual(tx,undefined,"The result must be different from undefined");
    });
  });
    
  describe("Contest functions catching errors: ", async function() {
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
            Contest.setNewContest[i].ipfsHash,
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
    it("Should get candidatures by contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getCandidaturesByContest(
          Contest.contestHash[i]);
        for (let j = 0; j < Contest.candidature.length; j++) {
          assert.equal(tx[j], Contest.candidature[j].hash, "The result must be:'" + Contest.candidature[j].hash + "'");
        };
      };
    });
    //getTotalCandidaturesByContest()
    it("Should get total candidatures by contest", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.getTotalCandidaturesByContest(
          Contest.contestHash[i]);
        assert.equal(tx.c, 10, "The result must be: 10 ");
      };
    });
    //cancelCandidature()
    it("Should cancel a candidature", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let tx = await instance.cancelCandidature(
          Contest.contestHash[i],
          Contest.candidature[0].hash,
          "Publicidad",
          true,
          { from: Contest.setNewContest[i].initialJudge }
        );
        assert.equal(tx.logs[0].args.candidatureTitle, Contest.candidature[0].title, "The result must be:'" + Contest.candidature[0].title + "'");
      };
    });
  });


  describe("Votation functions catching errors: ", async function () {
    //setNewVote()
    it("Should add a new vote", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1539454332);
        let tx = await instance.setNewVote(
          Contest.contestHash[i],
          Contest.candidature[1].hash,
          { from: Contest.setNewContest[i].initialJudge });
          console.log("HASH : ",Contest.candidature[1].hash);
          console.log("TX : ",tx.logs[0].args);
        assert.equal(tx.logs[0].args.candidatureHash, Contest.candidature[1].hash, "The result must be:'" + Contest.candidature[1].hash + "'");
      };
    });
  });

  describe("Solve Contest and Refund functions without errores: ", async function () {
    //setNewVote()
    it("Should add a new vote", async function () {
      for (let i = 0; i < Contest.setNewContest.length; i++) {
        let txTime = await instance.setTime(1540318332);
        let tx = await instance.solveContest(
          Contest.contestHash[i],
          { from: Contest.setNewContest[i].contestOwner });
          console.log("TX : ",tx.logs[0].args);
        assert.equal(tx.logs[0].args.winner, Contest.candidature[1].account, "The result must be:'" + Contest.candidature[1].account + "'");
      };
    });
  });

});
/*
  describe("Candidatures functions catching errors: ", async function() {
    //NOT setNewCandidature() out of time
    it("Should not add a new candidature because out of time", async function() { 
      let txTime = await instance.setTime(OutTimeCandidatures);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash, 
          TitleCandidature,                                               
          IpfsHash,
          {from: CandidatureAddress,value:5});
          test = false;
        }catch(e){
          test = true;
        }finally{
          assert.isTrue(test,"The result must be 'ERROR'");
        }
    });
    //NOT setNewCandidature() missing parameters
    it("Should not add a new candidature because missing parameters", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash,                                               
          IpfsHash,
          {from: CandidatureAddress,value:5});
        test = false;
      }catch(e){
        test = true;
      }finally{
        assert.isTrue(test,"The result must be 'ERROR'");
      }
    });
    //NOT setNewCandidature() contest hash is wrong
    it("Should not add a new candidature because contest hash is wrong", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          IpfsHash,
          TitleCandidature,                                             
          IpfsHash,
          {from: CandidatureAddress,value:5});
        test = false;
      }catch(e){
        test = true;
      }finally{
        assert.isTrue(test,"The result must be 'ERROR'");
      }
    });
    //NOT setNewCandidature() tax it is less than required
    it("Should not add a new candidature because tax it is less than required", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash,
          TitleCandidature,                                             
          IpfsHash,
          {from: CandidatureAddress,value:3});
          test = false;
        }catch(e){
          test = true;
        }finally{
          assert.isTrue(test,"The result must be 'ERROR'");
        }
    });
    //NOT setNewCandidature() tax it is more than required
    it("Should not add a new candidature because tax it is more than required", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash,
          TitleCandidature,                                             
          IpfsHash,
          {from: CandidatureAddress,value:8});
          test = false;
        }catch(e){
          test = true;
        }finally{
          assert.isTrue(test,"The result must be 'ERROR'");
        }
    });
  
  });


     */

  
