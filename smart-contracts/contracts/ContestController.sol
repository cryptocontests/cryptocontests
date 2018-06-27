pragma solidity ^0.4.23;

contract ContestController {
    
    struct Participation {
        address owner;
        string title;
        uint256 votes;
        //....
    }
    
    struct Contest {
        // using imageHash for index key
        mapping (address => Participation) participations;
        address[] participactionsAccounts;

        string title;
        uint256 startContest;
        uint256 endContest;
        uint256 timeToCandidatures; // offset time to participate from the contest start
        uint256 award;
    }
    
    mapping (address => mapping(bytes32  => Contest)) contests;
    address[] public contestAccounts; // array with all contests owner accounts
    
    // set new contest with owner address as key index
    function setNewContest(string _title, uint256 _startContest, uint256 _endContest, uint256 _timetoCandidature) public payable {
        bytes32 hashContest = getHashContest(msg.sender, _title, _startContest);
        require(contests[msg.sender][hashContest].award == 0);
        
        Contest storage contest = contests[msg.sender][hashContest];
        
        contest.title = _title;
        contest.startContest = _startContest;
        contest.endContest = _endContest;
        contest.timeToCandidatures = _timetoCandidature;
        contest.award = msg.value;

        contestAccounts.push(msg.sender) - 1;                        
    }

    function setNewParticipation(address _address, bytes32 _hashContest, string _title) public {
        contests[_address][_hashContest].participations[msg.sender].owner = msg.sender;
        contests[_address][_hashContest].participations[msg.sender].title = _title;
        contests[_address][_hashContest].participactionsAccounts.push(msg.sender) - 1;
    }
    
    function countContests() view public returns (uint256) {
        return contestAccounts.length;
    }

    function getHashContest (address _address, string _title, uint256 _startContest) public pure returns (bytes32){
        return keccak256(_address, _title, _startContest);
    }   

    function getBalance(address _address, bytes32 _hashContest) public view returns (uint256){
        return contests[_address][_hashContest].award;
    }

}