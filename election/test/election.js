const Election = artifacts.require("./Election.sol");

contract("Election", accounts => {
	let electionInstance;

	it('initialises the contract with zero candidates', () => {
        return Election.deployed().then((instance) => {
            return instance.getCandidateCount();
        }).then((count) => {
            assert.equal(count, 0);
        });
    });

	it('initialises the contract with zero voters', () => {
        return Election.deployed().then((instance) => {
            return instance.getVoterCount();
        }).then((count) => {
            assert.equal(count, 0);
        });
	});
	
	it('allows the administrator to add candidates', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			candidateName1 = 'Anthony Stark';
			candidateParty1 = 'Iron Man';
			return electionInstance.addCandidate(candidateName1, candidateParty1, {from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'addedCandidateEvent', 'the event type is correct');
			return electionInstance.candidates(1);
		}).then((candidate) => {
			assert.equal(candidate[0], 1, 'initialised with the correct id');
			assert.equal(candidate[1], 'Anthony Stark', 'contains the correct name');
			assert.equal(candidate[2], 'Iron Man', 'contains the correct name');
			assert.equal(candidate[3], 0, 'initialised with the correct vote count');
			return electionInstance.getCandidateCount();
		}).then((count) => {
			assert.equal(count, 1, 'contract account was allowed to add candidate');
			candidateName2 = 'Peter Parker';
			candidateParty2 = 'Spider-Man';
			return electionInstance.addCandidate(candidateName2, candidateParty2, {from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'addedCandidateEvent', 'the event type is correct');
			return electionInstance.candidates(2);
		}).then((candidate) => {
			assert.equal(candidate[0], 2, 'initialised with the correct id');
			assert.equal(candidate[1], 'Peter Parker', 'contains the correct name');
			assert.equal(candidate[2], 'Spider-Man', 'contains the correct name');
			assert.equal(candidate[3], 0, 'initialised with the correct vote count');
			return electionInstance.getCandidateCount();
		}).then((count) => {
			assert.equal(count, 2, 'contract account was allowed to add candidate'); 
		});
	});

	it('doesn`t allow external accounts to add candidates', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			candidateName3 = 'Obadiah Stane';
			candidateParty3 = 'Iron Monger';
			return electionInstance.addCandidate(candidateName3, candidateParty3, {from: accounts[1]});
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getCandidateCount();
		}).then((count) => {
			assert.equal(count, 2, 'external account not allowed to add candidate');
		});
	});

	it('allows the administrator to add voters', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			publicKey1 = accounts[1];
			return electionInstance.addVoter(publicKey1, {from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'addedVoterEvent', 'the event type is correct');
			return electionInstance.getVoterCount();
		}).then((count) => {
			assert.equal(count, 1, 'contract account was allowed to add voter');
			publicKey2 = accounts[2];
			return electionInstance.addVoter(publicKey2, {from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'addedVoterEvent', 'the event type is correct');
			return electionInstance.getVoterCount();
		}).then((count) => {
			assert.equal(count, 2, 'contract account was allowed to add voter');
			publicKey3 = accounts[3];
			return electionInstance.addVoter(publicKey3, {from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'addedVoterEvent', 'the event type is correct');
			return electionInstance.getVoterCount();
		}).then((count) => {
			assert.equal(count, 3, 'contract account was allowed to add voter');
		});
	});

	it('doesn`t allow external accounts to add voters', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			publicKey = accounts[4];
			return electionInstance.addVoter(publicKey, {from: accounts[1]});
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getVoterCount();
		}).then((count) => {
			assert.equal(count, 3, 'external account not allowed to add voter');
		});
	});

	it('doesn`t allow external accounts to start the election', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			return electionInstance.startElection({from: accounts[2]});
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getStart();
		}).then((started) => {
			assert.equal(started, false, 'external account not allowed to start the election');
		});
	});

	it('allows the administrator to start the election', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			return electionInstance.startElection({from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'electionReady', 'the event type is correct');
			assert.equal(receipt.logs[0].args._ready.toNumber(), 1, 'the election is ready');
			return electionInstance.getStart();
		}).then((started) => {
			assert.equal(started, true, 'contract account was allowed to start the election');
		});
	});

	it('doesn`t allow external accounts to end the election', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			return electionInstance.endElection({from: accounts[2]});
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getEnd();
		}).then((ended) => {
			assert.equal(ended, false, 'external account not allowed to end the election');
		});
	});

	it('allows the administrator to end the election', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			return electionInstance.endElection({from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'electionReady', 'the event type is correct');
			assert.equal(receipt.logs[0].args._ready.toNumber(), 0, 'the election is not ready');
			return electionInstance.getEnd();
		}).then((ended) => {
			assert.equal(ended, true, 'contract account was allowed to end the election');
		});
	});

	it('doesn`t allow external accounts to vote if the election hasn`t started', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, {from: accounts[1]});
		}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
			const voteCount = candidate[3];
            assert.equal(voteCount, 0, 'candidate has expected number of votes and voter was too early');
		});
	});

	it('allows registered voters to cast their vote', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			// Need to start the election to check that the voter can cast their vote
			return electionInstance.startElection({from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'electionReady', 'the event type is correct');
			assert.equal(receipt.logs[0].args._ready.toNumber(), 1, 'the election is ready');
            candidateId = 1;
            return electionInstance.vote(candidateId, {from: accounts[1]});
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'votedEvent', 'the event type is correct');
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, 'the candidate id is correct');
            return electionInstance.voters(accounts[1]);
        }).then((voter) => {
            assert(voter.hasVoted, true, 'the voter was marked as voted');
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
            const voteCount = candidate[3];
            assert.equal(voteCount, 1, 'increments the vote count of the candidate');
        });
	});

	it('doesn`t allow unregistered voters to cast their vote', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, { from: accounts[9] });
		}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.candidates(candidateId);
		}).then((candidate) => {
			const voteCount = candidate[3];
            assert.equal(voteCount, 1, 'candidate has expected number of votes as unregistered voter was unable to vote');
		});
	});

	it('doesn`t allow external accounts to vote more than once', () => {
        return Election.deployed().then((instance) => {
            electionInstance = instance;
            candidateId = 2;
			return electionInstance.vote(candidateId, { from: accounts[2] });
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'votedEvent', 'the event type is correct');
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, 'the candidate id is correct');
            return electionInstance.candidates(candidateId);
        }).then((candidate2) => {
			const voteCount = candidate2[3];
            assert.equal(voteCount, 1, 'first vote is accepted');
            return electionInstance.vote(candidateId, { from: accounts[2] });
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
            return electionInstance.candidates(1);
        }).then((candidate1) => {
			const voteCount = candidate1[3];
            assert.equal(voteCount, 1, 'candidate has expected number of votes');
            return electionInstance.candidates(candidateId);
        }).then((candidate2) => {
			const voteCount = candidate2[3];
            assert.equal(voteCount, 1, 'candidate has expected number of votes as double voting was reverted');
        });
	});

	it('doesn`t allow voters to vote for invalid candidates', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			candidateId = 69;
			return electionInstance.vote(candidateId, { from: accounts[3] });
		}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.candidates(1);
		}).then((candidate1) => {
			const voteCount = candidate1[3];
			assert.equal(voteCount, 1, 'candidate has expected number of votes');
			return electionInstance.candidates(2);
		}).then((candidate2) => {
			const voteCount = candidate2[3];
			assert.equal(voteCount, 1, 'candidate has expected number of votes');
		});
	});

	it('doesn`t allow the administrator to add candidates once the election has started', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			candidateName1 = 'Adrian Toomes';
			candidateParty1 = 'Vulture';
			return electionInstance.addCandidate(candidateName1, candidateParty1, {from: accounts[0]});
		}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getCandidateCount();
		}).then((count) => {
			assert.equal(count, 2, 'administrator was not allowed to add candidate during election');
		});
	});

	it('doesn`t allow the administrator to add voters once the election has started', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			publicKey = accounts[4];
			return electionInstance.addVoter(publicKey, {from: accounts[0]});
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getVoterCount();
		}).then((count) => {
			assert.equal(count, 3, 'administrator was not allowed to add voter during election');
		});
	});
	
	it('doesn`t allow external accounts to vote if the election has ended', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			// Need to end the election to check that the voter can't cast their vote
			return electionInstance.endElection({from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'an event was triggered');
            assert.equal(receipt.logs[0].event, 'electionReady', 'the event type is correct');
			assert.equal(receipt.logs[0].args._ready.toNumber(), 0, 'the election is not ready');
			candidateId = 1;
			return electionInstance.vote(candidateId, {from: accounts[1]});
		}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
            return electionInstance.candidates(candidateId);
        }).then((candidate) => {
			const voteCount = candidate[3];
            assert.equal(voteCount, 1, 'candidate has expected number of votes and voter was too late');
		});
	});
});
