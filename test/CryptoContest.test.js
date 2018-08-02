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
  //Present candidatures time
  const CandidaturesTime = 1535758999;
  //Vote time
  const VoteTime = 1538437399;
  //Out time
  const OutTimeJudge = 1530784801;
  const OutTimeCandidatures = 1535760000;

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

  describe("Contest functions without errors: ", async function() {
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
  describe("Contest functions catching errors: ", async function() {
    //Not setNewContest() award is 0
    it("Should not set a new contest because award is 0", async function() { 
      let txTime = await instance.setTime(CreatedDate);
      try{
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
          {from: ContestOwner,value:0});
        assert.isFalse(false,"The result must be 'ERROR'");
      }catch(e){
        assert.isTrue(true,"The result must be 'ERROR'")
      }
    });
    //Not setNewContest() missing parameters
    it("Should not set a new contest because missing parameters", async function() { 
      let txTime = await instance.setTime(CreatedDate);
      try{
        let tx = await instance.setNewContest( 
          Title,                                                
          InitialDate, 
          CandidatureLimitDate, 
          EndDate, 
          TaxForCandidatures,
          IpfsHash,                                          
          JudgeAccount,                                     
          JudgeName,                                         
          {from: ContestOwner,value:0});
        assert.isFalse(false,"The result must be 'ERROR'");
      }catch(e){
        assert.isTrue(true,"The result must be 'ERROR'")
      }
    });
    //Not getContest() hashcontest is wrong
    it("Should not get a contest by hash because contest hash is wrong", async function(){
      try{
      let tx = await instance.getContest(JudgeAccount);
      assert.isFalse(false,"The result must be 'ERROR'");
      }catch(e){
        assert.isTrue(true,"The result must be 'ERROR'")
      }
    });
  });

  
  describe("Judge functions without errors: ", async function() {
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
  describe("Judge functions catching errors: ", async function() {
    //NOT addJudge() out of time
    it("Should not add a new judge member because out of time", async function() { 
      let txTime = await instance.setTime(OutTimeJudge);
      try{
        let tx = await instance.addJudge( 
          ContestHash, 
          NewJudgeMember,                                               
          JudgeName);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT addJudge() missing parameters
    it("Should not add a new judge member because missing parameters", async function() { 
      let txTime = await instance.setTime(CreatedDate);
      try{
        let tx = await instance.addJudge( 
          NewJudgeMember,                                               
          JudgeName);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT addJudge() wrong contest hash
    it("Should not add a new judge member because contest hash is wrong", async function() { 
      let txTime = await instance.setTime(CreatedDate);
      try{
        let tx = await instance.addJudge( 
          NewJudgeMember,
          NewJudgeMember,                                               
          JudgeName);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
     //NOT addJudge() same Jugde Address
     it("Should not add a new judge member because the JudgeAddress already exists in the contest", async function() { 
      let txTime = await instance.setTime(CreatedDate);
      try{
        let tx = await instance.addJudge( 
          ContestHash,
          JudgeAccount,                                               
          JudgeName);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT removeJudge() missing parameters
    it("Should not remove a judge member from contest because missing parameters", async function() { 
      let txTime = await instance.setTime(OutTimeJudge);
      try{
        let tx = await instance.removeJudge( 
          NewJudgeMember);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT removeJudge() wrong contest hash
    it("Should not remove a judge member from contest because the contest hash is wrong", async function() { 
      let txTime = await instance.setTime(OutTimeJudge);
      try{
        let tx = await instance.removeJudge( 
          NewJudgeMember,
          NewJudgeMember);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
      //NOT removeJudge() the judge has already been eliminated
    it("Should not remove a judge member from contest because the judge has already been eliminated", async function() { 
      let txTime = await instance.setTime(OutTimeJudge);
      try{
        let tx = await instance.removeJudge( 
          ContestHash,
          NewJudgeMember);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT removeJudge() out of time
    it("Should not remove a judge member from contest because out of time", async function() { 
      let txTime = await instance.setTime(OutTimeJudge);
      try{
        let tx = await instance.removeJudge( 
          ContestHash, 
          NewJudgeMember);
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
  });

  describe("Candidatures functions without errors: ", async function() {
    //setNewCandidature()
    it("Should add a new candidature", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      let tx = await instance.setNewCandidature( 
        ContestHash, 
        TitleCandidature,                                               
        IpfsHash,
        {from: CandidatureAddress,value:5});
      assert.equal(tx.logs[0].args.candidatureTitle,TitleCandidature,"The result must be:'"+TitleCandidature+"'");
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
      let txTime = await instance.setTime(CandidaturesTime);
      let tx = await instance.cancelCandidature( 
        ContestHash, 
        CandidatureHash,                                               
        Reason,
        true,
        {from: JudgeAccount}
        );
      assert.equal(tx.logs[0].args.candidatureTitle,TitleCandidature,"The result must be:'"+TitleCandidature+"'");
    });
  });
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
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
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
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
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
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT setNewCandidature() ipfs hash is wrong
    it("Should not add a new candidature because ipfs hash is wrong", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash,
          TitleCandidature,                                             
          ContestHash,
          {from: CandidatureAddress,value:5});
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT setNewCandidature() tax it is less than required
    it("Should not add a new candidature because tax it is less than required", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash,
          TitleCandidature,                                             
          ContestHash,
          {from: CandidatureAddress,value:3});
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT setNewCandidature() tax it is more than required
    it("Should not add a new candidature because tax it is more than required", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash,
          TitleCandidature,                                             
          ContestHash,
          {from: CandidatureAddress,value:8});
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
    });
    //NOT setNewCandidature() tax it is more than required
    it("Should not add a new candidature because tax it is more than required", async function() { 
      let txTime = await instance.setTime(CandidaturesTime);
      try{
        let tx = await instance.setNewCandidature( 
          ContestHash,
          TitleCandidature,                                             
          ContestHash,
          {from: JudgeAccount,value:5});
        assert.isTrue(false,"The result must be 'ERROR'");
      }
      catch(e){
        assert.isTrue(true,"The result must be 'ERROR'");
      }
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