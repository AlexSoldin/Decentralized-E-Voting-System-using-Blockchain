pragma solidity ^0.4.17;

contract Election {
    address public owner;
    uint candidateCount;
    uint voterCount;
    bool start;
    bool end;

    // Constructor
    function Election() public {
        owner = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    // Return the public address of the owner
    function getOwner() public view returns(address) {
        return owner;
    }

    // Only Admin
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    // Model a Candidate
    struct Candidate{
        uint candidateId;
        string name;
        string party;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;

    // Add a new candidate
    function addCandidate(string _name, string _party) public onlyAdmin {
        candidateCount++;
        candidates[candidateCount] = Candidate({
            candidateId : candidateCount,
            name : _name,
            party : _party,
            voteCount : 0
        });
    }

    function getCandidateName(uint _candidateId) public view returns (string) {
        return candidates[_candidateId].name;
    }

    function getCandidateParty(uint _candidateId) public view returns (string) {
        return candidates[_candidateId].party;
    }

    function getCandidateVoteCount(uint _candidateId) public view returns (uint) {
        return candidates[_candidateId].voteCount;
    }

    // CandidateCount accessor method
    function getCandidateCount() public view returns (uint) {
        return candidateCount;
    }

    // Model a Voter
    struct Voter{
        address voterAddress;
        string name;
        bool hasVoted;
        bool isVerified;
    }

    mapping(address => Voter) voters;
    // address[] public voters;

    // request to be added as voter
    // function requestVoter(string _name, string _aadhar) public {
    //     Voter memory newVoter = Voter({
    //         voterAddress : msg.sender,
    //         name : _name,
    //         aadhar : _aadhar,
    //         hasVoted : false,
    //         isVerified : false
    //     });
    //     voters[msg.sender] = newVoter;
    //     voters.push(msg.sender);
    //     voterCount += 1;
    // }

    // get total number of voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    // function verifyVoter(address _address) public onlyAdmin {
    //     voters[_address].isVerified = true;
    // }

    function vote(uint _candidateId) public{
        require(voters[msg.sender].hasVoted == false);
        require(voters[msg.sender].isVerified == true);
        require(_candidateId > 0 && _candidateId <= candidateCount);
        require(start == true);
        require(end == false);
        candidates[_candidateId].voteCount++;
        voters[msg.sender].hasVoted = true;
    }

    /*
        Start and End the election
    */
    function startElection() public onlyAdmin {
        start = true;
        end = false;
    }

    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}