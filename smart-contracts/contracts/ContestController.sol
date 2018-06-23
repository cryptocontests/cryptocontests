pragma solidity ^0.4.18;

contract ContestController {
    
    struct Participation {
        address creator;
        uint256 votes;
        //....
    }
    
    struct Contest {
        // using imageHash for index key
        mapping (bytes32 => Participation) participations;
        
        string title;
        uint256 startContest;
        uint256 endContest;
        uint256 timeToCandidatures; // time to participate from the contest start
    }
    
    mapping (address => Contest) contests;
    address[] public contestAccounts; // array with all contests owner accounts
    
    // set new contest with owner address as key index
    function setContest(address _address, string _title, uint256 _startContest, uint256 _endContest, uint256 _timetoCandidature) public payable {
        require(contests[_address].startContest == 0);
        
        Contest storage contest = contests[_address];
        
        contest.title = _title;
        contest.startContest = _startContest;
        contest.endContest = _endContest;
        contest.timeToCandidatures = _timetoCandidature;
        
        contestAccounts.push(_address) - 1;                        
    }
    
    function countContests() view public returns (uint256) {
        return contestAccounts.length;
    }   

}