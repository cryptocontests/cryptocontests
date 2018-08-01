const ContestController = artifacts.require("ContestController");

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
  //Vote time
  const VoteTime = 1535999999;

  //Check address
  let instance;
  console.log('**************************');
  console.log('Owner Contest address: "'+ContestOwner+'"');
  console.log('Judge address: "'+JudgeAccount+'"');
  console.log('Judge use to addJudge test: "'+NewJudgeMember+'"');
  console.log('Participant address: "'+CandidatureAddress+'"');
  console.log('**************************');
 
  beforeEach(async function(){
    instance = await ContestController.deployed();
  });

  describe("Contest functions: ", async function() {
    //setNewContest()
    it("Should set a new contest", async function() { 
      let txTime = await instance.setTime(CreatedDate);
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
      let tx = await instance.getAllTags();
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
    
    it("Should not add a new judge member Out of Time", async function() { 
      let txTime = await instance.setTime(1530784801);
      let tx = await instance.addJudge( 
        ContestHash, 
        NewJudgeMember,                                               
        JudgeName);
      assert.isTrue(tx.logs[0].args.isMember);
    });
    //removeJudge()
    it("Should not remove a judge member from contest Out of Time", async function() { 
      let txTime = await instance.setTime(1530784801);
      let tx = await instance.removeJudge( 
        ContestHash, 
        NewJudgeMember);
      assert.isFalse(tx.logs[0].args.isMember);
    });
  });

  describe("Candidatures functions: ", async function() {
    //setNewCandidature()
    it("Should add a new candidature", async function() { 
      let txTime = await instance.setTime(1535759998);
      let tx = await instance.setNewCandidature( 
        ContestHash, 
        TitleCandidature,                                               
        IpfsHash,
        {from: CandidatureAddress,value:5});
      assert.equal(tx.logs[0].args.candidatureHash,CandidatureHash,"The result must be:'"+CandidatureHash+"'");
    });

    //setNewCandidature()
    it("Should not add a new candidature Out of Time", async function() { 
      let txTime = await instance.setTime(1535760000);
      let tx = await instance.setNewCandidature( 
        ContestHash, 
        TitleCandidature,                                               
        IpfsHash,
        {from: CandidatureAddress,value:5});
      assert.equal(tx.logs[0].args.candidatureHash,CandidatureHash,"The result must be:'"+CandidatureHash+"'");
    });
    //getCandidature()
    it("Should get a candidature by hash contest and hash candidature", async function() { 
      let tx = await instance.getCandidature( 
        ContestHash, 
        CandidatureHash);                                              
      assert.equal(tx[0],TitleCandidature,"The result must be:'"+TitleCandidature+"'");
    });
    //getCandidaturesByContest()
    it("Should get candidatures by contest", async function() { 
      let tx = await instance.getCandidaturesByContest( 
        ContestHash);
      assert.equal(tx[0],CandidatureHash,"The result must be:'"+CandidatureHash+"'");
    });
    //getTotalCandidaturesByContest()
    it("Should get total candidatures by contest", async function() { 
      let tx = await instance.getTotalCandidaturesByContest( 
        ContestHash);
      assert.equal(tx.s,1,"The result must be: 1 ");
    });
    //cancelCandidature()
    it("Should cancel a candidature", async function() { 
      let txTime = await instance.setTime(1535759999);
      let tx = await instance.cancelCandidature( 
        ContestHash, 
        CandidatureHash,                                               
        Reason,
        {from: JudgeAccount},
        true);
      assert.equal(tx.logs[0].args.candidatureTitle,TitleCandidature,"The result must be:'"+TitleCandidature+"'");
    });
  });

  describe("Votation functions: ", async function() {
    //setNewVote()
    it("Should add a new vote", async function() { 
      let txTime = await instance.setTime(VoteTime);
      let tx = await instance.setNewVote( 
        ContestHash, 
        CandidatureHash,                                               
        {from: JudgeAccount});
      assert.equal(tx.logs[0].args.candidatureHash,CandidatureHash,"The result must be:'"+CandidatureHash+"'");
    });
  });

});
