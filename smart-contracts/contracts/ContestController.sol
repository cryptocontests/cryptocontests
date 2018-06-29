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
        uint256 startContest;
        uint256 endContest;
        uint256 timeToCandidatures; // offset time to participate from the contest start
        uint256 limitCandidatures; // 0 for infinite
        uint256 award;
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
        
        Contest memory contest = contests[msg.sender];
        
        contest.title = _title;
        contest.startContest = _startContest;
        contest.endContest = _endContest;
        contest.timeToCandidatures = _timetoCandidature;
        contest.award = msg.value;

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
        
        contests[_address].participactionsAccounts.push(msg.sender);
        contests[_address].participations[msg.sender].title = _title;
        // ...
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
}