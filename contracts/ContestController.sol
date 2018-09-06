pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can execute this function");
        _;
    }

    function transferOwnerShip(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}
contract ContestController is owned {
    
    using SafeMath for uint256;

    event NewContest(string title, bytes32 contestHash);
    event MembershipChanged(string memberName, address member, bool isMember);
    event NewCandidature(string contestTitle, string candidatureTitle);
    event NewVote(string member, bytes32 contestHash, bytes32 candidatureHash);
    event CandidatureCancellation(string member, string contestTitle, string candidatureTitle, string reason);
    event ContestSolved(bytes32 contestHash, address winnerAddress, bytes32 winnerCandidature, uint256 totalVotes);

    struct Candidature {
        uint index;
        bytes32 hash;
        address creator;
        string title;
        uint256 createdDate;
        uint votes;
        bool cancelled;
        address cancelledByJudge;
        string reasonForCancellation;
    }

    struct Judge {
        uint index;
        string name;
        uint weight;
        bytes32 votedCandidature;
    }

    struct Creations {
        bytes32[] candidatureHashes;
        bool refunded;
    }

    struct Contest {
        uint index;

        mapping (bytes32 => Candidature) candidatures;
        mapping (address => Creations) creators;
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
        bytes32 ipfsHash;
        uint256 candidaturesStake;

        uint256 award;
        address winnerAddress;
        bytes32 winnerCandidature;
    }

    mapping (bytes32  => Contest) private contests;
    bytes32[] public contestList; // array with all contests hashes

    mapping (bytes32 => bool) public existingTags;
    bytes32[] public tagsList;

    // ONLY FOR TESTING PURPOSES
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
    * @param candidaturesStake //required tax for each candidature
    * @param ipfsHash hash for photo set in ipfs
    * @param initialJudgeAddress first required judge address
    * @param initialJudgeName first required judge common name
    * @param initialJudgeWeight first required judge weighing
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
        bytes32 ipfsHash,
        address initialJudgeAddress,
        string initialJudgeName,
        uint initialJudgeWeight) public payable returns (bytes32 contestHash) {

        // Check contests requirements
        require(msg.value > 0, "The contest must have an award");
        require(candidaturesStake > 0, "Making a candidature must cost a stake");
        require(initialDate < candidatureLimitDate, "The initial date is not before the candidature limit date");
        require(candidatureLimitDate < endDate, "The candidature limit date is not before the end date");
        require(tags.length < 5, "The contest must have less than 5 tags");

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

        for (uint8 i = 0; i < tags.length; i++) {
            if (!existingTags[tags[i]]) {
                tagsList.push(tags[i]);
                existingTags[tags[i]] = true;
            }
        }

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
            bytes32 ipfsHash,
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

    function getContestWinner(bytes32 contestHash) public view contestExists(contestHash)
        returns (address winnerAddress, bytes32 winnerCandidature) {
        winnerAddress = contests[contestHash].winnerAddress;
        winnerCandidature = contests[contestHash].winnerCandidature;
    }

    function getContestJudges(bytes32 contestHash) public view returns (address[] judges) {
        judges = contests[contestHash].judgeList;
    }

    function getJudgeDetails(bytes32 contestHash, address judge) public view returns (address judgeAddress, string judgeName, uint judgeWeight) {
        judgeAddress = judge;
        judgeName = contests[contestHash].judges[judge].name;
        judgeWeight = contests[contestHash].judges[judge].weight;
    }

    function getTotalContestsCount() public view returns (uint256 contestsCount) {
        return contestList.length;
    }

    function getAllTags() public view returns (bytes32[] tags) {
        return tagsList;
    }

    modifier contestExists(bytes32 contestHash) {
        require(contests[contestHash].owner != 0, "The given content does not exist");
        _;
    }

    modifier candidatureExists(bytes32 contestHash, bytes32 candidatureHash) {
        require(contests[contestHash].candidatures[candidatureHash].creator != 0, "The given candidature does not exist in the given contest");
        _;
    }

    /*************************************************************
     *                         JUDGE MEMBERS                     *
     *************************************************************/
    modifier theOwnerOf(bytes32 contestHash){
        require(msg.sender == contests[contestHash].owner, "This transaction can only be executed by the owner of the contest");
        _;
    }

    modifier isJudgeOf(bytes32 contestHash) {
        require(bytes(contests[contestHash].judges[msg.sender].name).length != 0, "This transaction can only be executed by a judge of the contest");
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
    * @param judgeName judge common name
    * @param weight judge weighing
    */
    function addJudge(bytes32 contestHash, address judgeAddress, string judgeName, uint weight)
      public contestExists(contestHash) theOwnerOf(contestHash) {
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
    function removeJudge(bytes32 contestHash, address judgeAddress) public
      contestExists(contestHash) theOwnerOf(contestHash) {
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
    * @param candidatureHash hash of image
    */
    function setNewCandidature(bytes32 contestHash, string title, bytes32 candidatureHash)
      public validAddress(msg.sender) contestExists(contestHash) payable {
        Contest storage contest = contests[contestHash];
        require(msg.value == contest.candidaturesStake, "The stake given does not match the required candidature stake");

        require(getTime() > contest.initialDate, "New candidatures can only be presented after the contest has begun");
        require(getTime() < contest.candidatureLimitDate, "New candidatures can only be presented before the candidature limit date");
        require(contest.candidatures[candidatureHash].creator == 0, "The given candidature has already been presented");

        contest.candidatureList.push(candidatureHash);
        contest.candidatures[candidatureHash].creator = msg.sender;
        contest.candidatures[candidatureHash].hash = candidatureHash;
        contest.candidatures[candidatureHash].title = title;
        contest.candidatures[candidatureHash].createdDate = getTime();
        contest.candidatures[candidatureHash].cancelled = false;

        Creations storage creations = contest.creators[msg.sender];
        creations.candidatureHashes.push(candidatureHash);

        emit NewCandidature(contest.title, title);
    }

    function getCandidature(bytes32 contestHash, bytes32 candidatureHash)
      public view contestExists(contestHash) candidatureExists(contestHash, candidatureHash) returns (string title, uint256 votes,
      address creator, uint256 createdDate, address cancelledByJudge, string reasonForCancellation) {
        Contest storage contest = contests[contestHash];
        title = contest.candidatures[candidatureHash].title;
        createdDate = contest.candidatures[candidatureHash].createdDate;
        creator = contest.candidatures[candidatureHash].creator;
        cancelledByJudge = contest.candidatures[candidatureHash].cancelledByJudge;
        reasonForCancellation = contest.candidatures[candidatureHash].reasonForCancellation;

        for (uint256 i = 0; i < contest.judgeList.length; i++) {
            Judge storage judge = contest.judges[contest.judgeList[i]];
            if (judge.votedCandidature == candidatureHash) {
                // removed for using SafeMath
                // votes += judge.weight;
                votes.add(judge.weight);
            }
        }
    }

    function getCandidaturesByContest(bytes32 contestHash)
      public view contestExists(contestHash) returns (bytes32[] candidatureList) {
        return contests[contestHash].candidatureList;
    }

    function getTotalCandidaturesByContest(bytes32 contestHash)
      public view contestExists(contestHash) returns (uint256 candidaturesCount){
        return contests[contestHash].candidatureList.length;
    }

    function getOwnCandidatures(bytes32 contestHash) public view contestExists(contestHash) returns (bytes32[] candidatureList) {
        return contests[contestHash].creators[msg.sender].candidatureHashes;
    }

    /**
    *
    * Cancel candidature by breach of rules
    *
    * @param contestHash contest hash
    * @param candidatureHash candidature hash
    * @param reason reason for cancellation
    */
    function cancelCandidature(bytes32 contestHash, bytes32 candidatureHash, string reason)
      external contestExists(contestHash) candidatureExists(contestHash, candidatureHash) isJudgeOf(contestHash) {
        // Only judges can cancel a candidature
        require(getTime() < contests[contestHash].endDate, "Candidatures can only be cancelled before the contest ends");
        require(!contests[contestHash].candidatures[candidatureHash].cancelled, "The given candidature has already been cancelled");

        contests[contestHash].candidatures[candidatureHash].cancelled = true;
        contests[contestHash].candidatures[candidatureHash].cancelledByJudge = msg.sender;
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

    function setNewVote(bytes32 contestHash, bytes32 candidatureHash)
      external contestExists(contestHash) candidatureExists(contestHash, candidatureHash) isJudgeOf(contestHash) {
        Contest storage contest = contests[contestHash];
        require(getTime() > contest.candidatureLimitDate, "Candidature voting is only allowed after the candidature limit date");
        require(getTime() < contest.endDate, "Candidature voting is only allowed before the contest has ended");

        Judge storage judge = contest.judges[msg.sender];

        require(judge.votedCandidature == 0, "The given judge has already voted");
        judge.votedCandidature = candidatureHash;
        // removed for using SafeMath
        //contest.candidatures[candidatureHash].votes += judge.weight;
        contest.candidatures[candidatureHash].votes.add(judge.weight);

        emit NewVote(
            contest.judges[msg.sender].name,
            contestHash,
            candidatureHash);
    }

    /*************************************************************
     *                 SOLVE CONTEST & REFUND   )                 *
     *************************************************************/

    /**
    *
    * Solve the contest
    *
    * @param contestHash contest hash
    */
    function solveContest(bytes32 contestHash) public contestExists(contestHash)
      returns (address winnerAddress, bytes32 winnerCandidature, uint256 winnerVotes) {
        Contest storage contest = contests[contestHash];
        require(getTime() > contest.endDate, "Contests can only be solved after their end date");
        require(contest.winnerCandidature == 0, "The contest has already been solved");

        for (uint256 i = 0; i < contest.judgeList.length; i++) {
            address judgeAddress = contest.judgeList[i];
            Judge storage judge = contest.judges[judgeAddress];
            Candidature storage candidature = contest.candidatures[judge.votedCandidature];

            if (!candidature.cancelled && candidature.votes > winnerVotes) {
                winnerCandidature = judge.votedCandidature;
                winnerVotes = candidature.votes;
            }
        }

        contest.winnerCandidature = winnerCandidature;
        winnerAddress = contest.candidatures[winnerCandidature].creator;
        contest.winnerAddress = winnerAddress;

        emit ContestSolved(contestHash, winnerAddress, winnerCandidature, winnerVotes);

        return (winnerAddress, winnerCandidature, winnerVotes);
    }

    function refundToCandidates(bytes32 contestHash) public contestExists(contestHash) {
        Contest storage contest = contests[contestHash];
        require(getTime() > contest.endDate, "Candidates can only be refunded once the contest has ended");
        require(contest.winnerAddress != 0, "The contest has not been solved yet");

        Creations storage creations = contest.creators[msg.sender];
        require(creations.candidatureHashes.length != 0, "The sender of the transaction did not participate in the given contest");
        require(!creations.refunded, "The candidate has already been refunded");

        uint256 amount = 0;
        for (uint256 i = 0; i < creations.candidatureHashes.length; i++) {
            if (!contest.candidatures[creations.candidatureHashes[i]].cancelled) {
                // removed for using SafeMath
                //amount += contest.candidaturesStake;
                amount.add(contest.candidaturesStake);
            }
        }

        if (msg.sender == contest.winnerAddress) {
            // removed for using SafeMath
            //amount += contest.award;
            amount.add(contest.award);
        }

        creations.refunded = true;
        msg.sender.transfer(amount);
    }

    function getWinner(bytes32 contestHash) public view contestExists(contestHash)
      returns (address winnerAddress, bytes32 winnerCandidature) {
        require(contests[contestHash].winnerCandidature != 0, "The contest has not been resolved yet");
        return (contests[contestHash].winnerAddress, contests[contestHash].winnerCandidature);
    }

     /************************************************************
     *                       PAGINATION                          *
     *************************************************************/

/*    function fetchContestsPage(uint256 cursor, uint256 howMany) public view returns (bytes32[] values) {
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

    function fetchCandidaturesPage(bytes32 contestHash, uint256 cursor, uint256 howMany)
      public view contestExists(contestHash) returns (bytes32[] values) {
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
    } */
}
