pragma solidity ^0.4.23;

contract owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnerShip(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}
contract ContestController is owned {
    
    event NewContest(string title, bytes32 contestHash);
    event MembershipChanged(string memberName, address member, bool isMember);
    event NewCandidature(string contestTitle, string candidatureTitle);
    event NewVote(string member, string contestTitle, string candidatureTitle);
    event CandidatureCancellation(string member, string contestTitle, string candidatureTitle, string reason);

    struct Candidature {
        address owner;
        string title;
        uint256 votes;
        string ipfsHash;
        uint256 taxBalance;
        bool cancelled;
        address cancelledByMember;
        string reasonForCancellation;
    }

    struct Member {
        address member;
        string name;
        bytes32 candidatureHash;
    }

    struct Multihash {
        bytes32 hash_tail;
        uint8 hash_function;
        uint8 hash_size;
    }
    
    struct Contest {
        mapping (bytes32 => Candidature) candidatures;
        bytes32[] candidaturesAccounts;
        
        mapping(address => uint) memberId;
        Member[] members;
        /**
         * Contest Stages
         * | New Contest | Member Revision | New Candidatures | Voting time | End Contest |
         */
        address owner;
        string title;
        uint256 dateLimitForMemberRevision;
        uint256 dateLimitForCandidatures;
        uint256 dateEndContest;
        bytes32[] tags;
        uint256 limitCandidatures; // 0 for infinite
        string ipfsHash; 
        uint256 taxForCandidatures;
        uint256 award;

        // Actual winner status after each vote
        uint256 actualWinnerVotes;
        bytes32 actualWinnerAccount;
    }

    mapping (bytes32  => Contest) private contests;
    bytes32[] public contestHashes; // array with all contests owner accounts

    mapping (bytes32 => bytes32[]) public contestsInTags;
    bytes32[] public allTags;

    // set new contest with owner address as key index
    bytes32[] contestAccounts; // array with all contests owner accounts
    
    /*************************************************************
     *                         CONTESTS                          *
     *************************************************************/

    /**
    *
    * Create New contest
    * 
    * Set new contest with settings
    *
    * @param title title contest
    * @param tags tags for category
    * @param dateLimitForMemberRevision limit date for member revision
    * @param dateLimitForCandidatures limit date for new candidatures 
    * @param dateEndContest contest end date
    * @param limitCandidatures limit candidatures for contest. 0 = unlimited
    * @param taxForCandidatures required tax for each candidature
    * @param ipfsHash hash for photo set in ipfs
    *
    * itself specifies the hash function and length of the hash in the first two bytes of the multihash. 
    * In the examples above the first two bytes in hex is 1220, where 12 denotes that this is the 
    * SHA256 hash function and 20 is the length of the hash in bytes - 32 bytes.
    */
    function setNewContest(
        string title, 
        string tags,
        uint256 dateLimitForMemberRevision, 
        uint256 dateLimitForCandidatures, 
        uint256 dateEndContest, 
        uint256 limitCandidatures,
        uint256 taxForCandidatures,
        string ipfsHash) public payable returns (bytes32 _contestHash) {
        
        require(msg.value > 0);
        bytes32 contestHash = keccak256(abi.encodePacked(msg.sender,title,dateEndContest));
        require(contests[contestHash].award == 0);
        require(dateLimitForMemberRevision < dateLimitForCandidatures);
        require(dateLimitForCandidatures < dateEndContest);
        
        Contest memory contest = contests[contestHash];
        contest.owner = msg.sender;
        contest.title = title;
        contest.tags = tags;
        contest.ipfsHash = ipfsHash;
        contest.dateLimitForMemberRevision = dateLimitForMemberRevision;
        contest.dateLimitForCandidatures = dateLimitForCandidatures;
        contest.dateEndContest = dateEndContest;
        contest.limitCandidatures = limitCandidatures;
        contest.taxForCandidatures = taxForCandidatures;
        contest.award = msg.value;
        
        contest.actualWinnerVotes = 0;
        // it's necessary to add an empty first member
        addMember(contestHash,0,"");
        // and let's add the founder, to save a step later
        addMember(contestHash,owner,"founder");

        contestAccounts.push(contestHash) - 1;  
        emit NewContest(title, contestHash);  
        return contestHash;                    
    }

    /**
    *
    * Return contest based in '_contestHash' param
    *
    * @param contestHash contest hash to return
    */
    function getContest(bytes32 contestHash) public view 
        returns (
            address owner,
            string title, 
            string tags,
            uint256 dateLimitForMemberRevision, 
            uint256 dateLimitForCandidatures, 
            uint256 dateEndContest, 
            uint256 limitCandidatures,
            string ipfsHash,
            uint256 taxForCandidatures,
            uint256 award, 
            uint256 candidaturesCount) {

        owner = contests[contestHash].owner;
        title = contests[contestHash].title;
        tags = contests[contestHash].tags;
        dateLimitForMemberRevision = contests[contestHash].dateLimitForMemberRevision; 
        dateLimitForCandidatures = contests[contestHash].dateLimitForCandidatures; 
        dateEndContest = contests[contestHash].dateEndContest;
        limitCandidatures = contests[contestHash].limitCandidatures;
        ipfsHash = contests[contestHash].ipfsHash;
        taxForCandidatures = contests[contestHash].taxForCandidatures;
        award = contests[contestHash].award; 
        candidaturesCount = contests[contestHash].candidaturesAccounts.length;
    }

    function getTotalContestsCount() public view returns (uint256 contestsCount) {
        return contestAccounts.length;
    }

    /*************************************************************
     *                         JUDGE MEMBERS                     *
     *************************************************************/
    modifier theOwnerOf(bytes32 contestHash){
        require(msg.sender == contests[contestHash].owner);
        _;
    }

    /**
    *
    * Add judge member
    * 
    * Make 'targetMember' a member named 'memberName'
    * 
    * @param contestHash contest hash
    * @param targetMember judge ethereum address
    * @param memberName judge name
    */
    function addMember(bytes32 contestHash, address targetMember, string memberName) public theOwnerOf(contestHash){
        require(now < contests[contestHash].dateLimitForMemberRevision);

        uint id = contests[contestHash].memberId[targetMember];
        // check new member not exists
        if (id==0) {
            contests[contestHash].memberId[targetMember] = contests[contestHash].members.length;
            id = contests[contestHash].members.length++;
        }

        Member memory judge = contests[contestHash].members[id];
        judge.member = targetMember;
        judge.name = memberName;

        contests[contestHash].members[id] = judge;
        emit MembershipChanged(memberName, targetMember, true);
    }
    
    /**
    *
    * Remove judge member
    *
    * @notice Remove membership from 'targetMember'
    *
    * @param contestHash contest hash
    * @param targetMember judge ethereum address to be removed 
    */
    function removeMember(bytes32 contestHash, address targetMember) public theOwnerOf(contestHash){
        require(now < contests[contestHash].dateLimitForMemberRevision);
        require(contests[contestHash].memberId[targetMember] != 0);
        
        string memory memberName = contests[contestHash].members[contests[contestHash].memberId[targetMember]].name;

        for (uint i = contests[contestHash].memberId[targetMember]; i < contests[contestHash].members.length - 1; i++){
            contests[contestHash].members[i] = contests[contestHash].members[i + 1];
        }
        
        delete contests[contestHash].members[contests[contestHash].members.length - 1];
        contests[contestHash].members.length--;
        emit MembershipChanged(memberName, targetMember, false);
    }

    /*************************************************************
     *                        CANDIDATURES                       *
     *************************************************************/

    modifier validAddress(address to) {
        require (to != address(0));
        require(to != address(this));
        _;
    }

    /**
    *
    * Add new candidature
    *
    * @param contestHash contest hash for candidature
    * @param title title for candidature
    */
    function setNewCandidature(bytes32 contestHash, string title, string ipfsHash) public validAddress(msg.sender) payable{
        require(msg.value >= contests[contestHash].taxForCandidatures);
        
        // checking limit candidatures
        require((contests[contestHash].limitCandidatures == 0) || (contests[contestHash].candidaturesAccounts.length < contests[contestHash].limitCandidatures - 1));
        
        require(now > contests[contestHash].dateLimitForMemberRevision); 
        require(now < contests[contestHash].dateLimitForCandidatures);

        bytes32 candidatureHash = keccak256(abi.encodePacked(msg.sender,title));
        contests[contestHash].candidaturesAccounts.push(candidatureHash);
        contests[contestHash].candidatures[candidatureHash].owner = msg.sender;
        contests[contestHash].candidatures[candidatureHash].title = title;
        contests[contestHash].candidatures[candidatureHash].ipfsHash = ipfsHash;
        contests[contestHash].candidatures[candidatureHash].taxBalance = msg.value;
        contests[contestHash].candidatures[candidatureHash].cancelled = false;

        emit NewCandidature(contests[contestHash].title, title);
    }
    
    function getCandidature(bytes32 contestHash, bytes32 candidatureHash) public view returns(string title, uint256 votes){
        title = contests[contestHash].candidatures[candidatureHash].title;
        votes = contests[contestHash].candidatures[candidatureHash].votes;
    }

    function getCandidaturesByContest(bytes32 contestHash) public view returns(bytes32[] candidaturesAccounts){
        return contests[contestHash].candidaturesAccounts;
    }
    
    function getTotalCandidaturesByContest(bytes32 contestHash) public view returns(uint256 candidaturesCount){
        return contests[contestHash].candidaturesAccounts.length;
    }

    function cancelCandidature(bytes32 contestHash, bytes32 candidatureHash, string reason) external {
        // only judge member for cancellations
        uint id = contests[contestHash].memberId[msg.sender];
        require(id != 0);
        require(!contests[contestHash].candidatures[candidatureHash].cancelled);

        contests[contestHash].candidatures[candidatureHash].taxBalance = 0;
        contests[contestHash].candidatures[candidatureHash].cancelled = true;
        contests[contestHash].candidatures[candidatureHash].cancelledByMember = contests[contestHash].members[id].member;
        contests[contestHash].candidatures[candidatureHash].reasonForCancellation = reason;
        
        emit CandidatureCancellation(
            contests[contestHash].members[id].name,
            contests[contestHash].title,
            contests[contestHash].candidatures[candidatureHash].title,
            reason);
    }

    /*************************************************************
     *                         VOTATION                          *
     *************************************************************/

    function setNewVote(bytes32 contestHash,bytes32 candidatureHash) external {
        require(now > contests[contestHash].dateLimitForCandidatures); 
        require(now < contests[contestHash].dateEndContest);
        uint id = contests[contestHash].memberId[msg.sender];
        require(id != 0);
        require(contests[contestHash].members[id].candidatureHash[0] != 0);

        contests[contestHash].members[id].candidatureHash = candidatureHash;
        contests[contestHash].candidatures[candidatureHash].votes += 1;
        
        // refresh actual winner status
        if (contests[contestHash].candidatures[candidatureHash].votes >= contests[contestHash].actualWinnerVotes){
            contests[contestHash].actualWinnerVotes = contests[contestHash].candidatures[candidatureHash].votes;
            contests[contestHash].actualWinnerAccount = candidatureHash;
        }

        emit NewVote(
            contests[contestHash].members[id].name, 
            contests[contestHash].title,
            contests[contestHash].candidatures[candidatureHash].title);
    }

    /*************************************************************
     *                 SOLVE CONTEST & REFUND                    *
     *************************************************************/

    function solveContest(bytes32 contestHash) public theOwnerOf(contestHash) returns (address _addressWinner, uint256 totalVotes){
        require(contests[contestHash].award > 0);
        require(now > contests[contestHash].dateEndContest);
        
        uint256 maxVotes = 0;
        bytes32 winnerHash;

        for (uint256 i = 0; i < contests[contestHash].candidaturesAccounts.length - 1; i++){
            bytes32 candidatureHash = contests[contestHash].candidaturesAccounts[i];
            
            if (
                (!contests[contestHash].candidatures[candidatureHash].cancelled) && 
                (contests[contestHash].candidatures[candidatureHash].votes > contests[contestHash].actualWinnerVotes)){
                maxVotes = contests[contestHash].candidatures[candidatureHash].votes;
                winnerHash = candidatureHash;
            }
        }

        contests[contestHash].actualWinnerVotes = maxVotes;
        contests[contestHash].actualWinnerAccount = candidatureHash;


        uint256 prize = contests[contestHash].award;
        contests[contestHash].award = 0;
        contests[contestHash].candidatures[candidatureHash].taxBalance = prize;
        
        return (
            contests[contestHash].candidatures[contests[contestHash].actualWinnerAccount].owner, 
            contests[contestHash].actualWinnerVotes);
    }
    
    function refundToCandidates(bytes32 contestHash, bytes32 candidatureHash) public {
        require(now >= contests[contestHash].dateEndContest);
        assert(msg.sender == contests[contestHash].candidatures[candidatureHash].owner);
        require(contests[contestHash].award == 0);
        
        uint256 amount = contests[contestHash].candidatures[candidatureHash].taxBalance;
        contests[contestHash].candidatures[candidatureHash].taxBalance = 0;
        msg.sender.transfer(amount);
    }
    

     /************************************************************
     *                       PAGINATION                          *
     *************************************************************/

    function fetchContestsPage(uint256 cursor, uint256 howMany) public view returns (bytes32[] values)
    {
        require(contestHashes.length > 0);
        require(cursor < contestHashes.length - 1);

        uint256 i;

        if (cursor + howMany < contestHashes.length){
            values = new bytes32[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contestHashes[i + cursor];
            }

        } else {
            uint256 lastPageLength = contestHashes.length - cursor;
            values = new bytes32[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contestHashes[cursor + i];
            }
        }

        return (values);
    }
    
    function fetchCandidaturesPage(bytes32 contestHash, uint256 cursor, uint256 howMany) public view returns (bytes32[] values)
    {
        require(contests[contestHash].award > 0);
        require(contests[contestHash].candidaturesAccounts.length > 0);
        require(cursor < contests[contestHash].candidaturesAccounts.length - 1);
        
        uint256 i;
        
        if (cursor + howMany < contests[contestHash].candidaturesAccounts.length){
            values = new bytes32[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contests[contestHash].candidaturesAccounts[i + cursor];
            }

        } else {
            uint256 lastPageLength = contestHashes.length - cursor;
            values = new bytes32[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contests[contestHash].candidaturesAccounts[cursor + i];
            }
        }

        return (values);
    }

    // only for date testing purposes
    function getTimeNow() public view returns(uint256){
        return now;
    }
}
