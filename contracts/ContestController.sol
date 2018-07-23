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
    event NewVote(string member, bytes32 contestHash, bytes32 candidatureHash);
    event CandidatureCancellation(string member, string contestTitle, string candidatureTitle, string reason);

    struct Candidature {
        uint index;
        address owner;
        string title;
        string ipfsHash;
        uint votes;
        uint256 createdDate;
        bool refunded;
        bool cancelled;
        address cancelledByMember;
        string reasonForCancellation;
    }

    struct Judge {
        uint index;
        string name;
        bytes32 votedCandidature;
    }

    struct Multihash {
        bytes32 hash_tail;
        uint8 hash_function;
        uint8 hash_size;
    }

    struct Contest {
        uint index;

        mapping (bytes32 => Candidature) candidatures;
        bytes32[] candidatureList;

        mapping(address => Judge) judges;
        address[] judgeList;
        /**
         * Contest Stages
         * | Edit Contest | New Candidatures | Voting time | End Contest |
         */
        address owner;
        string title;
        uint256 createdDate;
        uint256 initialDate;
        uint256 candidatureLimitDate;
        uint256 endDate;
        bytes32[] tags;
        string ipfsHash;
        uint256 taxForCandidatures;
        uint256 award;

        // Actual winner status after each vote
//        uint256 actualWinnerVotes;
//        bytes32 actualWinnerAccount;
    }

    mapping (bytes32  => Contest) private contests;
    bytes32[] public contestList; // array with all contests hashes

    mapping (bytes32 => bytes32[]) public contestsInTags;
    bytes32[] public tagsList;

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
    * @param initialDate limit date for contest editing
    * @param candidatureLimitDate limit date for new candidatures
    * @param endDate contest end date
    * @param taxForCandidatures required tax for each candidature
    * @param ipfsHash hash for photo set in ipfs
    *
    * itself specifies the hash function and length of the hash in the first two bytes of the multihash.
    * In the examples above the first two bytes in hex is 1220, where 12 denotes that this is the
    * SHA256 hash function and 20 is the length of the hash in bytes - 32 bytes.
    */
    function setNewContest(
        string title,
        bytes32[] tags,
        uint256 initialDate,
        uint256 candidatureLimitDate,
        uint256 endDate,
        uint256 taxForCandidatures,
        string ipfsHash,
        address initialJudge,
        string judgeName) public payable returns (bytes32 contestHash) {

        require(msg.value > 0, "The contest must have a prize");
        require(taxForCandidatures > 0, "Making a candidature must cost a stake");
        bytes32 contestHash = keccak256(abi.encodePacked(msg.sender, title, initialDate));
        require(contests[contestHash].award == 0, "Contest with this owner, title and initial date already exists");
        require(initialDate < candidatureLimitDate, "The initial date is not before the candidature limit date");
        require(candidatureLimitDate < endDate, "The candidature limit date is not before the end date");

        contests[contestHash].owner = msg.sender;
        contests[contestHash].title = title;
        contests[contestHash].tags = tags;
        contests[contestHash].ipfsHash = ipfsHash;
        contests[contestHash].createdDate = now;
        contests[contestHash].initialDate = initialDate;
        contests[contestHash].candidatureLimitDate = candidatureLimitDate;
        contests[contestHash].endDate = endDate;
        contests[contestHash].taxForCandidatures = taxForCandidatures;
        contests[contestHash].award = msg.value;

        // contests[contestHash].actualWinnerVotes = 0;
        // it's necessary to add an empty first member
        //addMember(contestHash,0,"");
        // and let's add the founder, to save a step later
        addJudge(contestHash, initialJudge, judgeName);

        contestList.push(contestHash);
        emit NewContest(title, contestHash);
    }

    /**
    *
    * Return contest based in 'contestHash' param
    *
    * @param contestHash contest hash to return
    */
    function getContest(bytes32 contestHash) public view
        returns (
            address owner,
            string title,
            bytes32[] tags,
            uint256 createdDate,
            uint256 initialDate,
            uint256 candidatureLimitDate,
            uint256 endDate,
            string ipfsHash,
            uint256 taxForCandidatures,
            uint256 award,
            uint256 candidaturesCount) {

        owner = contests[contestHash].owner;
        title = contests[contestHash].title;
        tags = contests[contestHash].tags;
        createdDate = contests[contestHash].createdDate;
        initialDate = contests[contestHash].initialDate;
        candidatureLimitDate = contests[contestHash].candidatureLimitDate;
        endDate = contests[contestHash].endDate;
        ipfsHash = contests[contestHash].ipfsHash;
        taxForCandidatures = contests[contestHash].taxForCandidatures;
        award = contests[contestHash].award;
        candidaturesCount = contests[contestHash].candidatureList.length;
    }

    function getTotalContestsCount() public view returns (uint256 contestsCount) {
        return contestList.length;
    }

    function getAllTags() public view returns (bytes32[] tags) {
        return tagsList;
    }

    /*************************************************************
     *                         JUDGE MEMBERS                     *
     *************************************************************/
    modifier theOwnerOf(bytes32 contestHash){
        require(msg.sender == contests[contestHash].owner);
        _;
    }

    modifier isJudgeOf(bytes32 contestHash) {
        require(bytes(contests[contestHash].judges[msg.sender].name).length != 0);
        _;
    }

    /**
    *
    * Add judge member
    *
    * Make 'memberAddress' a member named 'memberName'
    *
    * @param contestHash contest hash
    * @param judgeAddress judge ethereum address
    * @param judgeName judge name
    */
    function addJudge(bytes32 contestHash, address judgeAddress, string judgeName) public theOwnerOf(contestHash) {
        require(now < contests[contestHash].initialDate, "The judges cannot be changed once the contest has begun");

        require(bytes(contests[contestHash].judges[judgeAddress].name).length == 0, "The judge already exists");

        Judge memory judge;
        judge.name = judgeName;
        judge.index = contests[contestHash].judgeList.length;

        contests[contestHash].judges[judgeAddress] = judge;
        contests[contestHash].judgeList.push(judgeAddress);
        emit MembershipChanged(judgeName, judgeAddress, true);
    }

    /**
    *
    * Remove judge member
    *
    * @notice Remove membership from 'memberAddress'
    *
    * @param contestHash contest hash
    * @param judgeAddress judge ethereum address to be removed
    */
    function removeJudge(bytes32 contestHash, address judgeAddress) public theOwnerOf(contestHash){
        require(now < contests[contestHash].initialDate);

        // Check judge exists
        Judge memory judgeToDelete = contests[contestHash].judges[judgeAddress];
        require(bytes(judgeToDelete.name).length != 0);

        // If it is not the last list entry, copy the last list entry to the position of the judge to be deleted
        uint judgesCount = contests[contestHash].judgeList.length;
        if (judgeToDelete.index != judgesCount - 1) {
            address lastAddress = contests[contestHash].judgeList[judgesCount - 1];
            contests[contestHash].judgeList[judgeToDelete.index] = lastAddress;
            contests[contestHash].judges[lastAddress].index = judgeToDelete.index;
        }

        delete contests[contestHash].judges[judgeAddress];
        contests[contestHash].judgeList.length--;

        emit MembershipChanged(judgeToDelete.name, judgeAddress, false);
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
    function setNewCandidature(bytes32 contestHash, string title, string ipfsHash) public validAddress(msg.sender) payable {
        require(msg.value == contests[contestHash].taxForCandidatures);

        require(now > contests[contestHash].initialDate);
        require(now < contests[contestHash].candidatureLimitDate);

        bytes32 candidatureHash = keccak256(abi.encodePacked(msg.sender,title));
        contests[contestHash].candidatureList.push(candidatureHash);
        contests[contestHash].candidatures[candidatureHash].owner = msg.sender;
        contests[contestHash].candidatures[candidatureHash].title = title;
        contests[contestHash].candidatures[candidatureHash].createdDate = now;
        contests[contestHash].candidatures[candidatureHash].ipfsHash = ipfsHash;
        contests[contestHash].candidatures[candidatureHash].cancelled = false;

        emit NewCandidature(contests[contestHash].title, title);
    }

    function getCandidature(bytes32 contestHash, bytes32 candidatureHash) public view returns(string title, uint256 votes) {
        title = contests[contestHash].candidatures[candidatureHash].title;
        votes = contests[contestHash].candidatures[candidatureHash].votes;
    }

    function getCandidaturesByContest(bytes32 contestHash) public view returns(bytes32[] candidatureList) {
        return contests[contestHash].candidatureList;
    }

    function getTotalCandidaturesByContest(bytes32 contestHash) public view returns(uint256 candidaturesCount){
        return contests[contestHash].candidatureList.length;
    }

    function cancelCandidature(bytes32 contestHash, bytes32 candidatureHash, string reason) external isJudgeOf(contestHash) {
        // Only judges can cancel a candidature
        require(!contests[contestHash].candidatures[candidatureHash].cancelled);

        contests[contestHash].candidatures[candidatureHash].cancelled = true;
        contests[contestHash].candidatures[candidatureHash].cancelledByMember = msg.sender;
        contests[contestHash].candidatures[candidatureHash].reasonForCancellation = reason;

        emit CandidatureCancellation(
            contests[contestHash].judges[msg.sender].name,
            contests[contestHash].title,
            contests[contestHash].candidatures[candidatureHash].title,
            reason);
    }

    /*************************************************************
     *                         VOTATION                          *
     *************************************************************/

    function setNewVote(bytes32 contestHash, bytes32 candidatureHash) external isJudgeOf(contestHash) {
        require(now > contests[contestHash].candidatureLimitDate);
        require(now < contests[contestHash].endDate);

        require(contests[contestHash].judges[msg.sender].votedCandidature == 0);
        contests[contestHash].judges[msg.sender].votedCandidature = candidatureHash;

        emit NewVote(
            contests[contestHash].judges[msg.sender].name,
            contestHash,
            candidatureHash);
    }

    /*************************************************************
     *                 SOLVE CONTEST & REFUND                    *
     *************************************************************/

/*     function solveContest(bytes32 contestHash) public theOwnerOf(contestHash) returns (address _addressWinner, uint256 totalVotes){
        require(contests[contestHash].award > 0);
        require(now > contests[contestHash].dateEndContest);

        uint256 maxVotes = 0;
        bytes32 winnerHash;

        for (uint256 i = 0; i < contests[contestHash].candidatureList.length - 1; i++){
            bytes32 candidatureHash = contests[contestHash].candidatureList[i];

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
 */
    function refundToCandidates(bytes32 contestHash, bytes32 candidatureHash) public {
        require(now >= contests[contestHash].endDate);
        require(msg.sender == contests[contestHash].candidatures[candidatureHash].owner);
        require(contests[contestHash].award == 0);
        require(!contests[contestHash].candidatures[candidatureHash].refunded);

        //uint256 amount = contests[contestHash].candidatures[candidatureHash].taxBalance;
        //contests[contestHash].candidatures[candidatureHash].taxBalance = 0;
        contests[contestHash].candidatures[candidatureHash].refunded = true;

        msg.sender.transfer(contests[contestHash].taxForCandidatures);
    }


     /************************************************************
     *                       PAGINATION                          *
     *************************************************************/

    function fetchContestsPage(uint256 cursor, uint256 howMany) public view returns (bytes32[] values)
    {
        require(contestList.length > 0);
        require(cursor < contestList.length - 1);

        uint256 i;

        if (cursor + howMany < contestList.length){
            values = new bytes32[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contestList[i + cursor];
            }

        } else {
            uint256 lastPageLength = contestList.length - cursor;
            values = new bytes32[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contestList[cursor + i];
            }
        }

        return (values);
    }

    function fetchCandidaturesPage(bytes32 contestHash, uint256 cursor, uint256 howMany) public view returns (bytes32[] values)
    {
        require(contests[contestHash].award > 0);
        require(contests[contestHash].candidatureList.length > 0);
        require(cursor < contests[contestHash].candidatureList.length - 1);

        uint256 i;

        if (cursor + howMany < contests[contestHash].candidatureList.length){
            values = new bytes32[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contests[contestHash].candidatureList[i + cursor];
            }

        } else {
            uint256 lastPageLength = contestList.length - cursor;
            values = new bytes32[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contests[contestHash].candidatureList[cursor + i];
            }
        }

        return (values);
    }

    // only for date testing purposes
    function getTimeNow() public view returns(uint256){
        return now;
    }
}
