pragma solidity ^0.4.22;

contract Election {
    address public owner;
    uint candidateCount;
    uint voterCount;
    uint castVotesCount;
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

    // Candidate Model
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

    /*
        Accessor methods for candidate data
        Returns: name, party, voteCount
    */
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

    // Voter Model
    struct Voter{
        address voterAddress;
        bool hasVoted;
        bool isVerified;
    }

    mapping(address => Voter) voters;

    function addVoter(address _publicKey) public onlyAdmin {
        voterCount++;
        voters[_publicKey] = Voter({
            voterAddress : _publicKey,
            hasVoted : false,
            isVerified : true
        });
    }

    // Request to be added as a voter
    // function requestVoter(string _name) public {
    //     voters[msg.sender] = Voter({
    //         voterAddress : msg.sender,
    //         name : _name,
    //         hasVoted : false,
    //         isVerified : true
    //     });
    //     requestedVoters.push(msg.sender);
    //     voterCount += 1;
    // }

    // Addresses of voters wanting to participate 
    // function getRequestedVoters(uint _index) public view returns(address){
    //     return requestedVoters[_index];
    // }

    // Number of registered voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    // Number of cast votes
    function getCastVotesCount() public view returns (uint) {
        return castVotesCount;
    }

    // Vote for a certain candidate
    function vote(uint _candidateId) public {
        require(voters[msg.sender].hasVoted == false, "You have already cast your vote.");
        require(voters[msg.sender].isVerified == true);
        require(_candidateId > 0 && _candidateId <= candidateCount, "Please choose a valid candidate ID.");
        // require(start == true);
        // require(end == false);
        candidates[_candidateId].voteCount++;
        voters[msg.sender].hasVoted = true;
        castVotesCount++;
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