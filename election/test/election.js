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
		});
	});

	it('doesn`t allow external accounts to add candidates', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			candidateName2 = 'Steve Rogers';
			candidateParty2 = 'Captain America';
			return electionInstance.addCandidate(candidateName2, candidateParty2, {from: accounts[1]});
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getCandidateCount();
		}).then((count) => {
			assert.equal(count, 1, 'external account not allowed to add candidate');
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
		});
	});

	it('doesn`t allow external accounts to add voters', () => {
		return Election.deployed().then((instance) => {
			electionInstance = instance;
			publicKey2 = accounts[2];
			return electionInstance.addVoter(publicKey2, {from: accounts[1]});
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'contains the revert command');
			return electionInstance.getVoterCount();
		}).then((count) => {
			assert.equal(count, 1, 'external account not allowed to add voter');
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
});
