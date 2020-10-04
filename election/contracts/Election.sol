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
        castVotesCount = 0;
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

    event addedCandidateEvent(
        string indexed _name,
        string indexed _party
    );

    event addedVoterEvent(
        address indexed _publicKey
    );

    event electionReady(
        uint indexed _ready
    );

    event votedEvent(
        uint indexed _candidateId
    );

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
        require(start == false && end == false, "Election is not ready.");
        candidateCount++;
        candidates[candidateCount] = Candidate({
            candidateId : candidateCount,
            name : _name,
            party : _party,
            voteCount : 0
        });
        emit addedCandidateEvent(_name, _party);
    }

    // Name of a certain candidate
    function getCandidateName(uint _candidateId) public view returns (string) {
        return candidates[_candidateId].name;
    }

    // Party of a certain candidate
    function getCandidateParty(uint _candidateId) public view returns (string) {
        return candidates[_candidateId].party;
    }

     // VoteCount of a certain candidate
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

    mapping(address => Voter) public voters;

    // Add a new voter object 
    function addVoter(address _publicKey) public onlyAdmin {
        require(start == false && end == false, "Election is not ready.");
        voterCount++;
        voters[_publicKey] = Voter({
            voterAddress : _publicKey,
            hasVoted : false,
            isVerified : true
        });
        emit addedVoterEvent(_publicKey);
    }

    // Number of registered voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    // Number of cast votes
    function getCastVotesCount() public view returns (uint) {
        return castVotesCount;
    }

    // Vote for a certain candidate Id
    function vote(uint _candidateId) public {
        require(start == true && end == false, "Election is not ready.");
        require(voters[msg.sender].hasVoted == false, "You have already cast your vote.");
        require(voters[msg.sender].isVerified == true, "You are not verified to vote.");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Please choose a valid candidate ID.");
        candidates[_candidateId].voteCount++;
        voters[msg.sender].hasVoted = true;
        castVotesCount++;
        emit votedEvent(_candidateId);
    }

    // Start the election
    function startElection() public onlyAdmin {
        start = true;
        end = false;
        emit electionReady(1);
    }

    // End the election
    function endElection() public onlyAdmin {
        end = true;
        start = false;
        emit electionReady(0);
    }

    // Check if the election has started
    function getStart() public view returns (bool) {
        return start;
    }

    // Check if the election has ended
    function getEnd() public view returns (bool) {
        return end;
    }

    /** 
    * @dev Iterates over candidates and determines which candidate has the higest vote count
    * @return candidate Id of the winner
    */
    function winnerIndex() public onlyAdmin view returns (uint winnerIndex_) {
        require(end == true, "Election must have ended");
        uint winningVoteCount = 0;
        for (uint i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winnerIndex_ = i;
            }
        }
    }

    /** 
    * @dev Calls winningProposal() function to find the index of the winner and returns the winners name
    * @return winnerName_ the name of the winner
    */
    function winnerName() public onlyAdmin view returns (string winnerName_) {
        require(end == true, "Election must have ended");
        winnerName_ = candidates[winnerIndex()].name;
    }
}