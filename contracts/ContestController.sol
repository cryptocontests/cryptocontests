pragma solidity ^0.4.23;

contract ContestController {

    struct Participation {
        address owner;
        string title;
        uint256 votes;
        uint256 creationDate;
        //....
    }

    struct Contest {
        mapping (bytes32 => Participation) participations;
        bytes32[] participactionsAccounts;

        string title;
        bytes32[] tags;
        bytes32 ipfsHash;
        uint256 startContest; // date
        uint256 endContest;  // date
        uint256 timeToCandidatures; // date
        uint256 limitCandidatures; // 0 for infinite
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
    function setNewContest(
        string _title,
        bytes32[] _tags,
        uint256 _startContest,
        uint256 _endContest,
        uint256 _timetoCandidature,
        uint256 _limitCandidatures,
        bytes32 _ipfsHash) public payable {

        require(msg.value > 0);
        require(_tags.length < 5);
        bytes32 contestHash = keccak256(abi.encodePacked(msg.sender,_title,_startContest));
        require(contests[contestHash].award == 0);
        assert(_endContest > _startContest);
        assert(_timetoCandidature > _startContest);
        assert(_timetoCandidature < _endContest);

        contests[contestHash].title = _title;
        contests[contestHash].tags = _tags;
        contests[contestHash].ipfsHash = _ipfsHash;
        contests[contestHash].startContest = _startContest;
        contests[contestHash].endContest = _endContest;
        contests[contestHash].timeToCandidatures = _timetoCandidature;
        contests[contestHash].award = msg.value;
        contests[contestHash].limitCandidatures = _limitCandidatures;
        contests[contestHash].actualWinnerVotes = 0;

        contestHashes.push(contestHash);

        // Manage the creation of new tags
        for (uint8 i = 0; i < _tags.length; i++) {
            if (contestsInTags[_tags[i]].length == 0) {
                allTags.push(_tags[i]);
            }
            contestsInTags[_tags[i]].push(contestHash);
        }
    }

    function getContest(bytes32 _contestHash) public view
        returns (
            bytes32 contestHash,
            string title,
            bytes32[] tags,
            bytes32 ipfsHash,
            uint256 startContest,
            uint256 endContest,
            uint256 timeToCandidatures,
            uint256 limitCandidatures,
            uint256 award,
            uint256 participationCount) {

        contestHash = _contestHash;
        title = contests[_contestHash].title;
        tags = contests[_contestHash].tags;
        ipfsHash = contests[_contestHash].ipfsHash;
        startContest = contests[_contestHash].startContest;
        endContest = contests[_contestHash].endContest;
        timeToCandidatures = contests[_contestHash].timeToCandidatures;
        limitCandidatures = contests[_contestHash].limitCandidatures;
        award = contests[_contestHash].award;
        participationCount = contests[_contestHash].participactionsAccounts.length;
    }

    function setNewParticipation(bytes32 _contestHash, string _title, bytes32 participationContent) public {
        require((contests[_contestHash].limitCandidatures == 0) || (contests[_contestHash].participactionsAccounts.length < contests[_contestHash].limitCandidatures - 1));
        require(block.timestamp > contests[_contestHash].startContest);
        require(block.timestamp < contests[_contestHash].timeToCandidatures);
        if (contests[_contestHash].limitCandidatures != 0) {
            require(contests[_contestHash].participactionsAccounts.length < contests[_contestHash].limitCandidatures);
        }

        contests[_contestHash].participactionsAccounts.push(participationContent);
        contests[_contestHash].participations[participationContent].owner = msg.sender;
        contests[_contestHash].participations[participationContent].title = _title;
        contests[_contestHash].participations[participationContent].creationDate = block.timestamp;
    }

    function getParticipation(bytes32 _contestHash, bytes32 _participationHash) public view returns(bytes32 content, address owner, string title, uint256 creationDate, uint256 votes){
        title = contests[_contestHash].participations[_participationHash].title;
        votes = contests[_contestHash].participations[_participationHash].votes;
        return (
          _participationHash,
          contests[_contestHash].participations[_participationHash].owner,
          contests[_contestHash].participations[_participationHash].title,
          contests[_contestHash].participations[_participationHash].creationDate,
          contests[_contestHash].participations[_participationHash].votes
        );
    }

    function getParticipationsByContest(bytes32 _contestHash) public view returns(bytes32[]){
        return contests[_contestHash].participactionsAccounts;
    }

    function getTotalParticipationsByContest(bytes32 _contestHash) public view returns(uint256 participationsCount){
        return contests[_contestHash].participactionsAccounts.length;
    }

    function getTotalContestsCount() public view returns (uint256) {
        return contestHashes.length;
    }

    function getAllTags() public view returns (bytes32[]) {
        return allTags;
    }

    function setNewVote(bytes32 _contestHash,bytes32 _participationHash) public {
        require(now > contests[_contestHash].timeToCandidatures);
        require(now < contests[_contestHash].endContest);

        contests[_contestHash].participations[_participationHash].votes += 1;

        // refresh actual winner status
        if (contests[_contestHash].participations[_participationHash].votes >= contests[_contestHash].actualWinnerVotes){
            contests[_contestHash].actualWinnerVotes = contests[_contestHash].participations[_participationHash].votes;
            contests[_contestHash].actualWinnerAccount = _participationHash;
        }
    }

    function resolveContest(bytes32 _contestHash) public view returns (address _addressWinner, uint256 totalVotes) {
        require(contests[_contestHash].award > 0);
        require(now > contests[_contestHash].endContest);

        return (
            contests[_contestHash].participations[contests[_contestHash].actualWinnerAccount].owner,
            contests[_contestHash].actualWinnerVotes);
    }

    function payToWinner(bytes32 _contestHash) public {
        assert(now >= contests[_contestHash].endContest);
        assert(msg.sender == contests[_contestHash].participations[contests[_contestHash].actualWinnerAccount].owner);
        assert(contests[_contestHash].award > 0);

        uint256 amount = contests[_contestHash].award;
        contests[_contestHash].award = 0;
        msg.sender.transfer(amount);
    }

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

    function fetchParticipationsPage(bytes32 _contestHash, uint256 cursor, uint256 howMany) public view returns (bytes32[] values)
    {
        require(contests[_contestHash].award > 0);
        require(contests[_contestHash].participactionsAccounts.length > 0);
        require(cursor < contests[_contestHash].participactionsAccounts.length - 1);

        uint256 i;

        if (cursor + howMany < contests[_contestHash].participactionsAccounts.length){
            values = new bytes32[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contests[_contestHash].participactionsAccounts[i + cursor];
            }

        } else {
            uint256 lastPageLength = contestHashes.length - cursor;
            values = new bytes32[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contests[_contestHash].participactionsAccounts[cursor + i];
            }
        }

        return (values);
    }

    // only for date testing purposes
    function getTimeNow() public view returns(uint256){
        return now;
    }
}
