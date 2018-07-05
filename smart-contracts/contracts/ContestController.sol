pragma solidity ^0.4.23;

contract ContestController {
    
    struct Participation {
        address owner;
        string title;
        uint256 votes;
        //....
    }
    
    struct Contest {
        mapping (bytes32 => Participation) participations;
        bytes32[] participactionsAccounts;
        
        string title;
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
    bytes32[] private contestAccounts; // array with all contests owner accounts
    
    // set new contest with owner address as key index
    function setNewContest(
        string _title, 
        uint256 _startContest, 
        uint256 _endContest, 
        uint256 _timetoCandidature, 
        uint256 _limitCandidatures,
        bytes32 _ipfsHash) public payable {
        
        require(msg.value > 0);
        bytes32 contestHash = keccak256(abi.encodePacked(msg.sender,_title,_startContest));
        require(contests[contestHash].award == 0);
        assert(_endContest>_startContest);
        assert(_timetoCandidature > _startContest);
        assert(_timetoCandidature < _endContest);
        
        Contest memory contest = contests[contestHash];
        
        contest.title = _title;
        contest.ipfsHash = _ipfsHash;
        contest.startContest = _startContest;
        contest.endContest = _endContest;
        contest.timeToCandidatures = _timetoCandidature;
        contest.award = msg.value;
        contest.limitCandidatures = _limitCandidatures;
        contest.actualWinnerVotes = 0;

        contestAccounts.push(contestHash) - 1;                        
    }
    
    function getContest(bytes32 _contestHash) public view 
        returns (
            string title,
            bytes32 ipfsHash,
            uint256 startContest, 
            uint256 endContest, 
            uint256 timeToCandidatures,
            uint256 limitCandidatures, 
            uint256 award, 
            uint256 participationCount) {
        
        title = contests[_contestHash].title;
        ipfsHash = contests[_contestHash].ipfsHash;
        startContest = contests[_contestHash].startContest; 
        endContest = contests[_contestHash].endContest; 
        timeToCandidatures = contests[_contestHash].timeToCandidatures;
        limitCandidatures = contests[_contestHash].limitCandidatures; 
        award = contests[_contestHash].award; 
        participationCount = contests[_contestHash].participactionsAccounts.length;
    }

    function setNewParticipation(bytes32 _contestHash, string _title) public {
        require((contests[_contestHash].limitCandidatures == 0) || (contests[_contestHash].participactionsAccounts.length < contests[_contestHash].limitCandidatures - 1));
        require(now > contests[_contestHash].startContest); 
        require(now < contests[_contestHash].startContest + contests[_contestHash].timeToCandidatures);
        if (contests[_contestHash].limitCandidatures != 0) {
            require(contests[_contestHash].participactionsAccounts.length < contests[_contestHash].limitCandidatures);
        }

        bytes32 participationHash = keccak256(abi.encodePacked(msg.sender,_title));
        contests[_contestHash].participactionsAccounts.push(participationHash);
        contests[_contestHash].participations[participationHash].owner = msg.sender;
        contests[_contestHash].participations[participationHash].title = _title;
    }
    
    function getParticipation(bytes32 _contestHash, bytes32 _participationHash) public view returns(string title, uint256 votes){
        title = contests[_contestHash].participations[_participationHash].title;
        votes = contests[_contestHash].participations[_participationHash].votes;
    }

    function getParticipationsByContest(bytes32 _contestHash) public view returns(bytes32[] _participationsAccounts){
        return contests[_contestHash].participactionsAccounts;
    }
    
    function getTotalParticipationsByContest(bytes32 _contestHash) public view returns(uint256 participationsCount){
        return contests[_contestHash].participactionsAccounts.length;
    }
    
    function getTotalContestsCount() public view returns (uint256 contestsCount) {
        return contestAccounts.length;
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
        require(contestAccounts.length > 0);
        require(cursor < contestAccounts.length - 1);
        
        uint256 i;
        
        if (cursor + howMany < contestAccounts.length){
            values = new bytes32[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contestAccounts[i + cursor];
            }
            
        } else {
            uint256 lastPageLength = contestAccounts.length - cursor;
            values = new bytes32[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contestAccounts[cursor + i];
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
            uint256 lastPageLength = contestAccounts.length - cursor;
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