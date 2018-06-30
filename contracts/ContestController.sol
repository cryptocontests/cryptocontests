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

    mapping (address  => Contest) contests;
    address[] public contestAccounts; // array with all contests owner accounts

    // set new contest with owner address as key index
    function createContest(string _title, uint256 _startContest, uint256 _endContest, uint256 _timetoCandidature) public payable {
        //bytes32 hashContest = getHashContest(msg.sender, _title, _startContest);
        require(contests[msg.sender].award == 0);

        contests[msg.sender].title = _title;
        contests[msg.sender].startContest = _startContest;
        contests[msg.sender].endContest = _endContest;
        contests[msg.sender].timeToCandidatures = _timetoCandidature;
        contests[msg.sender].award = msg.value;

        contestAccounts.push(msg.sender) - 1;
    }

    function getContest(address _contestAcc) public view
        returns (string title, uint256 startDate, uint256 endDate, uint256 timeToCandidatures, uint256 award, uint256 numParticipations) {
        title = contests[_contestAcc].title;
        startDate = contests[_contestAcc].startContest;
        endDate = contests[_contestAcc].endContest;
        timeToCandidatures = contests[_contestAcc].timeToCandidatures;
        award = contests[_contestAcc].award;
        numParticipations = contests[_contestAcc].participactionsAccounts.length;
    }

    function setNewParticipation(address _address, string _title) public {
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
