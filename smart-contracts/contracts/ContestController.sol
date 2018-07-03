pragma solidity ^0.4.23;

contract ContestController {
    
    struct Participation {
        address owner;
        string title;
        uint256 votes;
        //....
    }
    
    struct Contest {
        mapping (address => Participation) participations;
        address[] participactionsAccounts;
        
        string title;
        uint256 startContest; // date
        uint256 endContest;  // date
        uint256 timeToCandidatures; // date
        uint256 limitCandidatures; // 0 for infinite
        uint256 award;

        // Actual winner status after each vote
        uint256 actualWinnerVotes;
        address actualWinnerAccount;
    }
    
    mapping (address  => Contest) contests;
    address[] public contestAccounts; // array with all contests owner accounts
    
    // set new contest with owner address as key index
    function setNewContest(
        string _title, 
        uint256 _startContest, 
        uint256 _endContest, 
        uint256 _timetoCandidature, 
        uint256 _limitCandidatures) public payable {
        
        require(msg.value > 0);
        require(contests[msg.sender].award == 0);
        assert(_endContest>_startContest);
        assert(_timetoCandidature >_startContest);
        assert(_timetoCandidature < _endContest);
        
        Contest memory contest = contests[msg.sender];
        
        contest.title = _title;
        contest.startContest = _startContest;
        contest.endContest = _endContest;
        contest.timeToCandidatures = _timetoCandidature;
        contest.award = msg.value;
        contest.limitCandidatures = _limitCandidatures;
        contest.actualWinnerVotes = 0;

        contestAccounts.push(msg.sender) - 1;                        
    }
    
    function getContest(address _contestAcc) public view 
        returns (
            string _title, 
            uint256 _startContest, 
            uint256 _endContest, 
            uint256 _timeToCandidatures,
            uint256 _limitCandidatures, 
            uint256 _award, 
            uint256 participationCount) {
        return (
            contests[_contestAcc].title, 
            contests[_contestAcc].startContest, 
            contests[_contestAcc].endContest, 
            contests[_contestAcc].timeToCandidatures,
            contests[_contestAcc].limitCandidatures, 
            contests[_contestAcc].award, 
            contests[_contestAcc].participactionsAccounts.length);
    }

    function setNewParticipation(address _address, string _title) public {
        require((contests[_address].limitCandidatures == 0) || (contests[_address].participactionsAccounts.length < contests[_address].limitCandidatures - 1));
        require(now > contests[_address].startContest); 
        require(now < contests[_address].startContest + contests[_address].timeToCandidatures);
        if (contests[_address].limitCandidatures != 0) {
            require(contests[_address].participactionsAccounts.length < contests[_address].limitCandidatures);
        }
        contests[_address].participactionsAccounts.push(msg.sender);
        contests[_address].participations[msg.sender].title = _title;
    }
    
    function getParticipation(address _contestAcc, address _partAcc) public view returns(string _title, uint256 _votes){
        return (
            contests[_contestAcc].participations[_partAcc].title,
            contests[_contestAcc].participations[_partAcc].votes);
    }
    
    function getTotalParticipationsByContest(address _contestAcc) public view returns(uint256 participationsCount){
        return contests[_contestAcc].participactionsAccounts.length;
    }
    
    function getContestsCount() public view returns (uint256 contestsCount) {
        return contestAccounts.length;
    }

    function setVote(address _contestAcc,address _partiAcc) public {
        require(now > contests[_contestAcc].timeToCandidatures); 
        require(now < contests[_contestAcc].endContest);
        
        contests[_contestAcc].participations[_partiAcc].votes += 1;
        
        // refresh actual winner status
        if (contests[_contestAcc].participations[_partiAcc].votes >= contests[_contestAcc].actualWinnerVotes){
            contests[_contestAcc].actualWinnerVotes = contests[_contestAcc].participations[_partiAcc].votes;
            contests[_contestAcc].actualWinnerAccount = _partiAcc;
        }
    }

    function resolveContest(address _contestAcc) public view returns (address _addressWinner, uint256 totalVotes) {
        require(contests[_contestAcc].award > 0);
        require(now > contests[_contestAcc].endContest);
        
        return (contests[_contestAcc].actualWinnerAccount, contests[_contestAcc].actualWinnerVotes);
    }
    
    function payToWinner(address _contestAcc) public {
        assert(now >= contests[_contestAcc].endContest);
        assert(contests[_contestAcc].award > 0);

        uint256 amount = contests[_contestAcc].award;
        contests[_contestAcc].award = 0;
        msg.sender.transfer(amount);
    }
    
    function fetchContestsPage(uint256 cursor, uint256 howMany) public view returns (address[] values)
    {
        require(contestAccounts.length > 0);
        require(cursor < contestAccounts.length - 1);
        
        uint256 i;
        
        if (cursor + howMany < contestAccounts.length){
            values = new address[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contestAccounts[i + cursor];
            }
            
        } else {
            uint256 lastPageLength = contestAccounts.length - cursor;
            values = new address[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contestAccounts[cursor + i];
            }
        }
        
        return (values);
    }
    
    function fetchParticipationsPage(address _contestAcc, uint256 cursor, uint256 howMany) public view returns (address[] values)
    {
        require(contests[_contestAcc].award > 0);
        require(contests[_contestAcc].participactionsAccounts.length > 0);
        require(cursor < contests[_contestAcc].participactionsAccounts.length - 1);
        
        uint256 i;
        
        if (cursor + howMany < contests[_contestAcc].participactionsAccounts.length){
            values = new address[](howMany);
            for (i = 0; i < howMany; i++) {
                values[i] = contests[_contestAcc].participactionsAccounts[i + cursor];
            }
            
        } else {
            uint256 lastPageLength = contestAccounts.length - cursor;
            values = new address[](lastPageLength);
            for (i = 0; i < lastPageLength; i++) {
                values[i] = contests[_contestAcc].participactionsAccounts[cursor + i];
            }
        }
        
        return (values);
    }
    
    // only for date testing purposes
    function getTimeNow() public view returns(uint256){
        return now;
    }
} 