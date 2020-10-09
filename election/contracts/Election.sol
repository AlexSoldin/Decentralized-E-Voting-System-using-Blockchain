pragma solidity ^0.4.22;

contract Election {
    address public owner;
    uint candidateCount;
    uint voterCount;
    uint castVotesCount;
    bool start;
    bool end;

    /**
    * @dev Set contract deployer as owner, set counters as zero and set booleans as false
    */
    constructor() public {
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

    // Only Admin modifier to check if caller is the owner
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    // Event for adding a new candidate
    event addedCandidateEvent(
        string indexed _name,
        string indexed _party
    );

    // Event for adding a new voter
    event addedVoterEvent(
        address indexed _publicKey
    );

    // Event for the election being ready
    event electionReady(
        uint indexed _ready
    );

    // Event for a vote being cast
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

    /** 
    * @dev Add a candidate to the election
    * @param _name of the candidate to be added
    * @param _party that the candidate belongs to
    */
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

    /** 
    * @dev Gets the name of a specific candidate
    * @param _candidateId used to locate the candidate in the candidates mapping
    * @return tring that stores the name associated with the candidate
    */
    function getCandidateName(uint _candidateId) public view returns (string) {
        return candidates[_candidateId].name;
    }

    /** 
    * @dev Gets the party of a specific candidate
    * @param _candidateId used to locate the candidate in the candidates mapping
    * @return string that stores the party associated with the candidate
    */
    function getCandidateParty(uint _candidateId) public view returns (string) {
        return candidates[_candidateId].party;
    }

    /** 
    * @dev Gets the vote count of a specific candidate
    * @param _candidateId used to locate the candidate in the candidates mapping
    * @return uint that stores the number of votes relating to the candidate
    */
    function getCandidateVoteCount(uint _candidateId) public view returns (uint) {
        return candidates[_candidateId].voteCount;
    }

    /** 
    * @dev Checks the number of candidates that have been added to the election
    * @return uint that stores the number of candidates
    */
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

    /** 
    * @dev Add a voter to the election
    * @param _publicKey is the public key of the voter that is being added to the election
    */
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

    /** 
    * @dev Checks the number of voters that are registered
    * @return uint that stores the number of registered voters
    */
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    /** 
    * @dev Checks the number of votes that have been cast
    * @return uint that stores the number of cast votes 
    */
    function getCastVotesCount() public view returns (uint) {
        return castVotesCount;
    }

    /** 
    * @dev Vote for a certain candidate Id
    * @param _candidateId is the index of the candidate in the candidates mapping
    */
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

    /** 
    * @dev Starts the election by changing the value of the start boolean
    */
    function startElection() public onlyAdmin {
        start = true;
        end = false;
        emit electionReady(1);
    }

    /** 
    * @dev Ends the election by changing the value of the end boolean
    */
    function endElection() public onlyAdmin {
        end = true;
        start = false;
        emit electionReady(0);
    }

    /** 
    * @dev Checks if the election has started
    * @return boolean that stores the election started value
    */
    function getStart() public view returns (bool) {
        return start;
    }

    /** 
    * @dev Checks if the election has ended
    * @return boolean that stores the election ended value
    */
    function getEnd() public view returns (bool) {
        return end;
    }

    /** 
    * @dev Iterates over candidates and determines which candidate has the higest vote count
    * @return candidate Id of the winner
    */
    function winnerIndex() public view returns (uint winnerIndex_) {
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
    function winnerName() public view returns (string winnerName_) {
        require(end == true, "Election must have ended");
        winnerName_ = candidates[winnerIndex()].name;
    }
}