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
    event ContestSolved(bytes32 contestHash, address winnerAddress, bytes32 winnerCandidature, uint256 totalVotes);

    struct Candidature {
        uint index;
        address creator;
        string title;
        string ipfsHash;
        uint256 createdDate;
        uint votes;
        bool refunded;
        bool cancelled;
        address cancelledByMember;
        string reasonForCancellation;
    }

    struct Judge {
        uint index;
        string name;
        uint weight;
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

        mapping (address => Judge) judges;
        address[] judgeList;

        /**
        * Contest Stages
        * ==============
        *                         +-------+          +------------+   +-------+
        *                         |Initial|          |Candidatures|   |endDate|
        *                         |Date   |          |Limit Date  |   |       |
        *                         +-------+          +------------+   +-------+
        *                             |                    |              |
        *                             v                    v              v
        * CREATE  -->  [EditContest] -+->  [Candidatures] -+->  [Voting] -+->  RESOLVE --> REFUND
        * CONTEST                                                              CONTEST
        */

        address owner;
        string title;
        uint256 createdDate;
        uint256 initialDate;
        uint256 candidatureLimitDate;
        uint256 endDate;
        bytes32[] tags;
        string ipfsHash;
        uint256 candidaturesStake;

        uint256 award;
        address winnerAddress;
        bytes32 winnerCandidature;
    }

    mapping (bytes32  => Contest) private contests;
    bytes32[] public contestList; // array with all contests hashes

    mapping (bytes32 => bytes32[]) public contestsInTags;
    bytes32[] public tagsList;

    // ONLY FOR DEBUG PURPOSES
    // FIXME: SECURITY ERROR
    uint date = 0;
    function setTime (uint256 newDate) public onlyOwner {
        date = newDate;
    }

    function getTime() public view returns (uint256){
        if (date == 0)
          return now;
        else return date;
    }

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
    * @param candidaturesStake required tax for each candidature
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
        uint256 candidaturesStake,
        string ipfsHash,
        address initialJudgeAddress,
        string initialJudgeName,
        uint initialJudgeWeight) public payable returns (bytes32 contestHash) {

        // Check contests requirements
        require(msg.value > 0, "The contest must have a prize");
        require(candidaturesStake > 0, "Making a candidature must cost a stake");
        require(initialDate < candidatureLimitDate, "The initial date is not before the candidature limit date");
        require(candidatureLimitDate < endDate, "The candidature limit date is not before the end date");

        contestHash = keccak256(abi.encodePacked(msg.sender, title, initialDate));
        require(contests[contestHash].award == 0, "Contest with this owner, title and initial date already exists");

        contests[contestHash].owner = msg.sender;
        contests[contestHash].title = title;
        contests[contestHash].tags = tags;
        contests[contestHash].ipfsHash = ipfsHash;
        contests[contestHash].createdDate = getTime();
        contests[contestHash].initialDate = initialDate;
        contests[contestHash].candidatureLimitDate = candidatureLimitDate;
        contests[contestHash].endDate = endDate;
        contests[contestHash].candidaturesStake = candidaturesStake;
        contests[contestHash].award = msg.value;

        addJudge(contestHash, initialJudgeAddress, initialJudgeName, initialJudgeWeight);

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
            uint256 candidaturesStake,
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
        candidaturesStake = contests[contestHash].candidaturesStake;
        award = contests[contestHash].award;
        candidaturesCount = contests[contestHash].candidatureList.length;
    }

    function getContestJudges(bytes32 contestHash) public view returns (address[] judges) {
        judges = contests[contestHash].judgeList;
    }

    function getJudgeDetails(bytes32 contestHash, address judge) public view returns (address judgeAddress, string judgeName) {
        judgeAddress = judge;
        judgeName = contests[contestHash].judges[judge].name;
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
    function addJudge(bytes32 contestHash, address judgeAddress, string judgeName, uint weight) public theOwnerOf(contestHash) {
        require(getTime() < contests[contestHash].initialDate, "The judges cannot be changed once the contest has begun");
        require(bytes(judgeName).length > 0,"The judge must have a name");
        require(weight > 0, "The judge's weight must be bigger than 0");
        require(bytes(contests[contestHash].judges[judgeAddress].name).length == 0, "The judge already exists");

        Judge memory judge;
        judge.name = judgeName;
        judge.weight = weight;
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
        require(getTime() < contests[contestHash].initialDate, "Judges can only be removed before the initial date of the contest");
        require(contests[contestHash].judgeList.length > 1, "The contest has needs to have at least one judge at any moment");

        // Check judge exists
        Judge memory judgeToDelete = contests[contestHash].judges[judgeAddress];
        require(bytes(judgeToDelete.name).length != 0, "The judge address is not a judge in the given contest");

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
    * @param ipfsHash hash of image
    */
    function setNewCandidature(bytes32 contestHash, string title, string ipfsHash) public validAddress(msg.sender) payable {
        require(msg.value == contests[contestHash].candidaturesStake, "The stake given does not match the required candidature stake");

        require(getTime() > contests[contestHash].initialDate, "New candidatures can only be presented after the contest has begun");
        require(getTime() < contests[contestHash].candidatureLimitDate, "New candidatures can only be presented before the candidature limit date");

        bytes32 candidatureHash = keccak256(abi.encodePacked(msg.sender,title));
        contests[contestHash].candidatureList.push(candidatureHash);
        contests[contestHash].candidatures[candidatureHash].creator = msg.sender;
        contests[contestHash].candidatures[candidatureHash].title = title;
        contests[contestHash].candidatures[candidatureHash].createdDate = getTime();
        contests[contestHash].candidatures[candidatureHash].ipfsHash = ipfsHash;
        contests[contestHash].candidatures[candidatureHash].cancelled = false;

        emit NewCandidature(contests[contestHash].title, title);
    }

    function getCandidature(bytes32 contestHash, bytes32 candidatureHash) public view returns(string title, uint256 votes) {
        title = contests[contestHash].candidatures[candidatureHash].title;

        for (uint256 i = 0; i < contests[contestHash].judgeList.length; i++) {
            Judge storage judge = contests[contestHash].judges[contests[contestHash].judgeList[i]];
            if (judge.votedCandidature == candidatureHash) {
                votes += judge.weight;
            }
        }
    }

    function getCandidaturesByContest(bytes32 contestHash) public view returns(bytes32[] candidatureList) {
        return contests[contestHash].candidatureList;
    }

    function getTotalCandidaturesByContest(bytes32 contestHash) public view returns(uint256 candidaturesCount){
        return contests[contestHash].candidatureList.length;
    }

    /**
    *
    * Cancel candidature by breach of rules
    *
    * @param contestHash contest hash
    * @param candidatureHash candidature hash
    * @param reason reason for cancellation
    */
    function cancelCandidature(bytes32 contestHash, bytes32 candidatureHash, string reason) external isJudgeOf(contestHash) {
        // Only judges can cancel a candidature
        require(getTime() < contests[contestHash].endDate, "Candidatures can only be cancelled before the contest ends");
        require(!contests[contestHash].candidatures[candidatureHash].cancelled, "The given candidature has already been cancelled");

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
        Contest storage contest = contests[contestHash];
        require(getTime() > contest.candidatureLimitDate, "Candidature voting is only allowed after the candidature limit date");
        require(getTime() < contest.endDate, "Candidature voting is only allowed before the contest has ended");
        require(contest.candidatures[candidatureHash].creator != 0, "The candidature does not exist in this contest");

        Judge storage judge = contest.judges[msg.sender];

        require(judge.votedCandidature == 0, "The given judge has already voted");
        judge.votedCandidature = candidatureHash;
        contest.candidatures[candidatureHash].votes += judge.weight;

        emit NewVote(
            contest.judges[msg.sender].name,
            contestHash,
            candidatureHash);
    }

    /*************************************************************
     *                 SOLVE CONTEST & REFUND                    *
     *************************************************************/

    /**
    *
    * Solve the contest
    *
    * @param contestHash contest hash
    */
    function solveContest(bytes32 contestHash) public theOwnerOf(contestHash) 
      returns (address winnerAddress, bytes32 winnerCandidature, uint256 totalVotes) {
        Contest storage contest = contests[contestHash];
        require(contest.owner != 0, "The given contest does not exist");
        require(getTime() > contest.endDate, "Contests can only be solved after their end date");
        require(contest.winnerCandidature == 0, "The contest has already been solved");

        uint winnerVotes;

        for (uint256 i = 0; i < contest.judgeList.length; i++) {
            address judgeAddress = contest.judgeList[i];
            Judge storage judge = contest.judges[judgeAddress];

            if (contest.candidatures[judge.votedCandidature].votes > winnerVotes) {
                winnerCandidature = judge.votedCandidature;
                winnerVotes = contest.candidatures[judge.votedCandidature].votes;
            }
        }

        contest.winnerCandidature = winnerCandidature;
        winnerAddress = contest.candidatures[winnerCandidature].creator;
        contest.winnerAddress = winnerAddress;

        emit ContestSolved(contestHash, winnerAddress, winnerCandidature, winnerVotes);

        return (winnerAddress, winnerCandidature, winnerVotes);
    }

    function refundToCandidates(bytes32 contestHash, bytes32 candidatureHash) public {
        require(getTime() >= contests[contestHash].endDate, "Candidates can only be refunded once the contest has ended");
        require(msg.sender == contests[contestHash].candidatures[candidatureHash].creator,
          "The sender of the transaction is not the creator of the candidature");
        require(!contests[contestHash].candidatures[candidatureHash].cancelled, "The candidature was cancelled by a judge");
        require(!contests[contestHash].candidatures[candidatureHash].refunded, "The candidature has already been refunded");

        uint256 amount = contests[contestHash].candidaturesStake;
        if (msg.sender == contests[contestHash].winnerAddress) {
            amount += contests[contestHash].award;
        }

        contests[contestHash].candidatures[candidatureHash].refunded = true;
        msg.sender.transfer(amount);
    }

    function getWinner(bytes32 contestHash) public view returns (address winnerAddress, bytes32 winnerCandidature) {
        require(contests[contestHash].winnerCandidature != 0, "The contest has not been resolved yet");
        return (contests[contestHash].winnerAddress, contests[contestHash].winnerCandidature);
    }

     /************************************************************
     *                       PAGINATION                          *
     *************************************************************/

    function fetchContestsPage(uint256 cursor, uint256 howMany) public view returns (bytes32[] values) {
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

    function fetchCandidaturesPage(bytes32 contestHash, uint256 cursor, uint256 howMany) public view returns (bytes32[] values) {
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
}
