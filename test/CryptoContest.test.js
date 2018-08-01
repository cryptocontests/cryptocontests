const ContestController = artifacts.require("ContestController")
const truffleAssert = require('truffle-assertions');
const BigNumber = web3.BigNumber;

contract('ContestController', function(accounts) {
  //Accounts of the ganache
  const ContestOwner = accounts[0];
  const JudgeAccount = accounts[1];
  const NewJudgeMember = accounts[2];
  const CandidatureAddress = accounts[3];
  //Contest constants
  //If you change these parameters: Title, InitialDate or ContestOwner; the ContestHash will change
  const Title = "Concurso Fotográfico Cartel Fiestas Barcelona";
  const Tags = [];
  const InitialDate = 1534291200;
  const CandidatureLimitDate = 1535759999;
  const EndDate = 1999959999;
  const TaxForCandidatures = 5;
  const IpfsHash = "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA"
  const JudgeName = "Jordi";
  //Candidatures constants
  const TitleCandidature = "Foto Torre Agbar"
  const Reason = "Publicidad";
  const CandidatureHash = "dasdsad" //TODO
  //Contest Hash generated
  const ContestHash = "0xcd16f2c50828278523dfbf709e89b1ead583acba9e6673d6243aace421b55545";
  
  let instance;
  console.log('**************************');
  console.log('Owner address: "'+ContestOwner+'"');
  console.log('Judge address: "'+JudgeAccount+'"');
  console.log('Judge use to addJudge test: "'+NewJudgeMember+'"');
  console.log('Initial data: Wednesday, 15 August 2018 0:00:00');
  console.log('**************************');
 
  beforeEach(async function(){
    instance = await ContestController.deployed();
  });

  describe("Contest functions: ", async function() {
    //setNewContest()
    it("Should set a new contest", async function() { 
      let tx = await instance.setNewContest( 
        Title, 
        Tags,                                               
        InitialDate, 
        CandidatureLimitDate, 
        EndDate, 
        TaxForCandidatures,
        IpfsHash,                                          
        JudgeAccount,                                     
        JudgeName,                                         
        {from: ContestOwner,value:5000000});
      assert.equal(tx.logs[0].args.member,JudgeAccount,"The result must be the JudgeAccount");
    });
    //getContest()
    it("Should get a contest by hash", async function(){
        let tx = await instance.getContest(ContestHash);
        assert.equal(tx[1], Title,"The result must be: ",Title);
    });
    //getTotalContestsCount()
    it("Should get total contest count", async function(){
      let tx = await instance.getTotalContestsCount();
      assert.equal(tx.s, 1,"The result must be: 1 ");
    });
    //getAllTags()
    //FIXME: Ahora mismo no le paso tags asi que devuelve undefined
    it("Should get all tags", async function(){
      let tx = await instance.getAllTags()
      console.log(tx.log[0].args)
      assert.notEqual(tx,undefined,"The result must be different from undefined");
    });
  });

  describe("Judge functions: ", async function() {
    //addJudge()
    it("Should add a new judge member", async function() { 
      let tx = await instance.addJudge( 
        ContestHash, 
        NewJudgeMember,                                               
        JudgeName);
      assert.isTrue(tx.logs[0].args.isMember);
    });
    //removeJudge()
    it("Should remove a judge member from contest", async function() { 
      let tx = await instance.removeJudge( 
        ContestHash, 
        NewJudgeMember);
      assert.isFalse(tx.logs[0].args.isMember);
    });
  });


  //FIXME: No se puede crear candidatura por el tiempo
  describe("Candidatures functions: ", async function() {
    //setNewCandidature()
    it("Should add a new candidature", async function() { 
      let tx = await instance.setNewCandidature( 
        ContestHash, 
        TitleCandidature,                                               
        IpfsHash,
        {from: CandidatureAddress,value:5});
      assert.equal(tx,undefined);
    });
    //getCandidature()
    it("Should get a candidature by hash contest and hash candidature", async function() { 
      let tx = await instance.getCandidature( 
        ContestHash, 
        CandidatureHash);                                               
      assert.notEqual(tx,undefined);
    });
    //getCandidaturesByContest()
    it("Should get candidatures by contest", async function() { 
      let tx = await instance.getCandidaturesByContest( 
        ContestHash);
      assert.notEqual(tx,undefined);
    });
    //getTotalCandidaturesByContest()
    it("Should get total candidatures by contest", async function() { 
      let tx = await instance.getTotalCandidaturesByContest( 
        ContestHash);
      assert.notEqual(tx,undefined);
    });
    //cancelCandidature()
    it("Should cancel a candidature", async function() { 
      let tx = await instance.cancelCandidature( 
        ContestHash, 
        CandidatureHash,                                               
        Reason);
      assert.equal(tx,undefined);
    });
  });
  // FIXME
  describe("Votation functions: ", async function() {
    //setNewVote()
    it("Should add a new vote", async function() { 
      let tx = await instance.setNewVote( 
        ContestHash, 
        CandidatureHash,                                               
        {from: JudgeAccount});
      assert.equal(tx,undefined);
    });
  });

  //FIXME: Problemas con las fechas de candidaturas
});
