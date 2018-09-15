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
    event ContestSolved(bytes32 contestHash, address[] winnersAddresses, bytes32[] winnersCandidatures, uint256 totalVotes);

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

    struct Participant {
        bytes32[] candidatureHashes;
        uint256 amountToRefund;
        bool refunded;
    }

    /**
     * Contest Phases
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

    struct Contest {
        uint index;

        mapping (bytes32 => Candidature) candidatures;
        mapping (address => Participant) participants;
        bytes32[] candidatureList;

        mapping (address => Judge) judges;
        address[] judgeList;

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
        address[] winnersAddresses;
        bytes32[] winnersCandidatures;
    }

    mapping (bytes32  => Contest) private contests;
    bytes32[] public contestList; // array with all contests hashes

    mapping (bytes32 => bool) public existingTags;
    bytes32[] public tagsList;


    function getTime() public view returns (uint256){
        return now;
    }

    /*************************************************************
     *                          GLOBAL                           *
     *************************************************************/

    /**
     * Checks whether the given address is a valid ethereum address
     */
    modifier validAddress(address to) {
        require (to != address(0), "The provided address is invalid");
        require(to != address(this), "The provided address is invalid");
        _;
    }

    /**
     * Only the owner of the given contests can execute the transaction
     */
    modifier theOwnerOf(bytes32 contestHash){
        require(msg.sender == contests[contestHash].owner, "This transaction can only be executed by the owner of the contest");
        _;
    }

    /**
     * Checks that the given contest exists in the contract
     * @param contestHash contest hash of an existent contest
     */
    modifier contestExists(bytes32 contestHash) {
        require(contests[contestHash].owner != 0, "The given content does not exist");
        _;
    }

    /**
     * Checks that the given candidature exists in the contest
     * @param contestHash contest hash of an existent contest
     * @param candidatureHash candidature hash for the given contest
     */
    modifier candidatureExists(bytes32 contestHash, bytes32 candidatureHash) {
        require(contests[contestHash].candidatures[candidatureHash].creator != 0, "The given candidature does not exist in the given contest");
        _;
    }

    /**
     * Returns the total count of contests
     */
    function getTotalContestsCount() public view returns (uint256 contestsCount) {
        return contestList.length;
    }

    /**
     * Returns all the different tags stored
     */
    function getAllTags() public view returns (bytes32[] tags) {
        return tagsList;
    }

    /*************************************************************
     *                         CONTESTS                          *
     *************************************************************/

    /**
     * Create New contest
     * Set new contest with all its properties
     *
     * @param title title contest
     * @param tags tags for category
     * @param initialDate limit date for contest editing
     * @param candidatureLimitDate limit date for new candidatures
     * @param endDate contest end date
     * @param candidaturesStake required stake for each candidature
     * @param ipfsHash hash for additional content set in IPFS
     * @param initialJudgeAddress first required judge address
     * @param initialJudgeName first required judge common name
     * @param initialJudgeWeight first required judge weight
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

        // Add tags to global tags list if necessary
        for (uint8 i = 0; i < tags.length; i++) {
            bytes32 tag = tags[i];
            if (!existingTags[tag]) {
                tagsList.push(tag);
                existingTags[tag] = true;
            }
        }

        addJudge(contestHash, initialJudgeAddress, initialJudgeName, initialJudgeWeight);

        contestList.push(contestHash);
        emit NewContest(title, contestHash);
    }

    /**
     * Returns all properties of the given contest
     * @param contestHash contest hash
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

    /**
     * Returns the list of winner of the given contest
     * @param contestHash contest hash of an existent contest
     */
    function getContestWinners(bytes32 contestHash) public view contestExists(contestHash)
        returns (address[] winnersAddresses, bytes32[] winnersCandidatures) {
        winnersAddresses = contests[contestHash].winnersAddresses;
        winnersCandidatures = contests[contestHash].winnersCandidatures;
    }


    /*************************************************************
     *                         JUDGE MEMBERS                     *
     *************************************************************/

    /**
     * Only judges of the given contests can execute the transaction
     */
    modifier isJudgeOf(bytes32 contestHash) {
        require(bytes(contests[contestHash].judges[msg.sender].name).length != 0, "This transaction can only be executed by a judge of the contest");
        _;
    }

    /**
     * Returns the list of judges for the given contest
     * @param contestHash contest hash of an existent contest
     */
    function getContestJudges(bytes32 contestHash) public view returns (address[] judges) {
        judges = contests[contestHash].judgeList;
    }

    /**
     * Returns all of the judge's properties for the given contest
     * @param contestHash contest hash of an existent contest
     * @param judge judge address
     */
    function getJudgeDetails(bytes32 contestHash, address judge) public view returns (address judgeAddress, string judgeName, uint judgeWeight) {
        judgeAddress = judge;
        judgeName = contests[contestHash].judges[judge].name;
        judgeWeight = contests[contestHash].judges[judge].weight;
    }

    /**
     * Add judge member with the given properties
     *
     * @param contestHash contest hash of an existent contest
     * @param judgeAddress judge ethereum address
     * @param judgeName judge common name
     * @param weight judge weight
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
     * Removes judge member from the given contest
     *
     * @param contestHash contest hash of an existent contest
     * @param judgeAddress address of the judge to be removed
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

    /**
     * Returns all the properties of the given candidature in the given contest
     * @param contestHash contest hash of an existent contest
     * @param candidatureHash candidature hash
     */
    function getCandidature(bytes32 contestHash, bytes32 candidatureHash)
      public view contestExists(contestHash) candidatureExists(contestHash, candidatureHash) returns (string title, uint256 votes,
      address creator, uint256 createdDate, address cancelledByJudge, string reasonForCancellation) {
        Contest storage contest = contests[contestHash];
        title = contest.candidatures[candidatureHash].title;
        votes = contest.candidatures[candidatureHash].votes;
        createdDate = contest.candidatures[candidatureHash].createdDate;
        creator = contest.candidatures[candidatureHash].creator;
        cancelledByJudge = contest.candidatures[candidatureHash].cancelledByJudge;
        reasonForCancellation = contest.candidatures[candidatureHash].reasonForCancellation;
    }

    /**
     * Returns list of candidature hashes presented in the given contest
     * @param contestHash contest hash of an existent contest
     */
    function getCandidaturesByContest(bytes32 contestHash)
      public view contestExists(contestHash) returns (bytes32[] candidatureList) {
        return contests[contestHash].candidatureList;
    }

    /**
     * Returns the count of candidatures presented in the given contest
     * @param contestHash contest hash of an existent contest
     */
    function getTotalCandidaturesByContest(bytes32 contestHash)
      public view contestExists(contestHash) returns (uint256 candidaturesCount){
        return contests[contestHash].candidatureList.length;
    }

    /**
     * Returns the list of candidatures presented in the given contest by the sender
     * @param contestHash contest hash of an existent contest
     */
    function getOwnCandidatures(bytes32 contestHash) public view contestExists(contestHash) returns (bytes32[] candidatureList) {
        return contests[contestHash].participants[msg.sender].candidatureHashes;
    }

    /**
     * Add new candidature to the given contest
     *
     * @param contestHash contest hash of an existent contest
     * @param title title for candidature
     * @param candidatureHash hash of the content of the candidature, stored in IPFS
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

        Participant storage participant = contest.participants[msg.sender];
        participant.candidatureHashes.push(candidatureHash);
        participant.amountToRefund += msg.value;

        emit NewCandidature(contest.title, title);
    }

    /**
    * Cancel candidature by breaking of rules
    * Only judges can cancel a candidature
    *
    * @param contestHash contest hash of an existent contest
    * @param candidatureHash candidature hash
    * @param reason reason for cancellation
    */
    function cancelCandidature(bytes32 contestHash, bytes32 candidatureHash, string reason)
      external contestExists(contestHash) candidatureExists(contestHash, candidatureHash) isJudgeOf(contestHash) {
        Contest storage contest = contests[contestHash];
        require(getTime() < contest.endDate, "Candidatures can only be cancelled before the contest ends");
        Candidature storage candidature = contest.candidatures[candidatureHash];
        require(!candidature.cancelled, "The given candidature has already been cancelled");

        candidature.cancelled = true;
        candidature.cancelledByJudge = msg.sender;
        candidature.reasonForCancellation = reason;

        // Stake is burned since the candidature has been cancelled
        Participant storage participant = contests[contestHash].participants[candidature.creator];
        participant.amountToRefund -= contest.candidaturesStake;

        emit CandidatureCancellation(
            contest.judges[msg.sender].name,
            contest.title,
            candidature.title,
            reason);
    }

    /*************************************************************
     *                         VOTING                          *
     *************************************************************/

    /**
     * Sets the vote of the sending judge to the given candidature
     * Can only be executed by one of the given contest's judges
     *
     * @param contestHash contest hash of an existent contest
     * @param candidatureHash candidature hash of an existent candidature in the given contest
     */
    function setNewVote(bytes32 contestHash, bytes32 candidatureHash)
      external contestExists(contestHash) candidatureExists(contestHash, candidatureHash) isJudgeOf(contestHash) {
        Contest storage contest = contests[contestHash];
        require(getTime() > contest.candidatureLimitDate, "Candidature voting is only allowed after the candidature limit date");
        require(getTime() < contest.endDate, "Candidature voting is only allowed before the contest has ended");

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
     * Solves the contest
     * Computes the winners and sets up the refund function to participants
     *
     * @param contestHash contest hash of an existent contest
     */
    function solveContest(bytes32 contestHash) public contestExists(contestHash)
      returns (address[] winnersAddresses, bytes32[] winnerCandidature, uint256 winnerVotes) {
        Contest storage contest = contests[contestHash];
        require(getTime() > contest.endDate, "Contests can only be solved after their end date");
        require(contest.winnersCandidatures.length == 0, "The contest has already been solved");

        // There might be a draw: maintain an array of possible winners
        address[] storage addresses = contest.winnersAddresses;
        bytes32[] storage candidatures = contest.winnersCandidatures;

        for (uint256 i = 0; i < contest.judgeList.length; i++) {
            address judgeAddress = contest.judgeList[i];
            Judge storage judge = contest.judges[judgeAddress];
            Candidature storage candidature = contest.candidatures[judge.votedCandidature];

            if (!candidature.cancelled && candidature.votes >= winnerVotes) {
                if (candidature.votes > winnerVotes) { // New high number of votes: no draw possible for the previous votes
                    addresses.length = 0;
                    candidatures.length = 0;
                    winnerVotes = candidature.votes;
                }
                addresses.push(candidature.creator);
                candidatures.push(judge.votedCandidature);
            }
        }

        // Add the respective award of the winners to their refund amount
        for (uint256 j = 0; j < addresses.length; j++) {
            contest.participants[addresses[j]].amountToRefund += contest.award / addresses.length;
        }

        emit ContestSolved(contestHash, addresses, candidatures, winnerVotes);

        return (addresses, candidatures, winnerVotes);
    }

    /**
     * Withdrawal function for each participant of the contest
     * If the participant is one of the winners, they will receive their share of the award as well
     *
     * @param contestHash contest hash of an existent contest
     */
    function refundToCandidates(bytes32 contestHash) public contestExists(contestHash) {
        Contest storage contest = contests[contestHash];
        require(getTime() > contest.endDate, "Candidates can only be refunded once the contest has ended");
        require(contest.winnersAddresses.length != 0, "The contest has not been solved yet");

        Participant storage participant = contest.participants[msg.sender];
        require(participant.candidatureHashes.length != 0, "The sender of the transaction did not participate in the given contest");
        require(!participant.refunded, "The candidate has already been refunded");

        participant.refunded = true;
        msg.sender.transfer(participant.amountToRefund);
    }

}
