import React, { Component } from 'react'
import { Router, Switch, Route } from 'react-router-dom';
import Election from "./contracts/Election.json";
import getWeb3 from "./getWeb3";

import Navbar from './components/Navbar';
import Jumbotron from './components/Jumbotron';
import VotingPanel from './components/VotingPanel';
import Admin from './components/Admin';
import history from './history';


class App extends Component {
    state = { 
        ElectionInstance: undefined, 
        web3: null, 
        account: null, 
        isOwner: false,
        timing: true
    };  
    

    componentDidMount = async () => {
        if(!window.location.hash){
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        if(this.state.timing === true){
            try {
                // Get network provider and web3 instance.
                let startTime = performance.now();
                const web3 = await getWeb3();
                let endTime = performance.now();
                let timeTaken = endTime - startTime; 
                console.log("getWeb3(): " + timeTaken + " milliseconds"); 

                // Use web3 to get the user's accounts.
                startTime = performance.now();
                const accounts = await web3.eth.getAccounts();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("web3.eth.getAccounts(): " + timeTaken + " milliseconds"); 

                // Get the contract instance.
                startTime = performance.now();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Election.networks[networkId];
                const instance = new web3.eth.Contract(
                    Election.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("Get contract instance: " + timeTaken + " milliseconds"); 

                this.setState({ ElectionInstance: instance,  web3: web3, account: accounts[0] });
                
                startTime = performance.now();
                const owner = await this.state.ElectionInstance.methods.getOwner().call();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("getOwner(): " + timeTaken + " milliseconds"); 
                if(this.state.account === owner){
                    this.setState({ isOwner: true });
                }
                
                startTime = performance.now();
                let candidateCount = await this.state.ElectionInstance.methods.getCandidateCount().call();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("getCandidateCount(): " + timeTaken + " milliseconds");
                this.setState({ candidateCount: candidateCount });
                this.parseCandidates(this.state.candidateCount);

                startTime = performance.now();
                let voterCount = await this.state.ElectionInstance.methods.getVoterCount().call();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("getVoterCount(): " + timeTaken + " milliseconds");
                this.setState({ voterCount: voterCount });

                startTime = performance.now();
                let castVoterCount = await this.state.ElectionInstance.methods.getCastVotesCount().call();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("getCastVotesCount(): " + timeTaken + " milliseconds");
                this.setState({ castVoterCount: castVoterCount });

                startTime = performance.now();
                let electionStarted = await this.state.ElectionInstance.methods.getStart().call();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("getStart(): " + timeTaken + " milliseconds");
                this.setState({ electionStarted: electionStarted });

                startTime = performance.now();
                let electionEnded = await this.state.ElectionInstance.methods.getEnd().call();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("getEnd(): " + timeTaken + " milliseconds");
                this.setState({ electionEnded: electionEnded });

                this.setState({ winnerName: '' });
                if(this.state.electionEnded === true){
                    startTime = performance.now();
                    let winnerName = await this.state.ElectionInstance.methods.winnerName().call();
                    endTime = performance.now();
                    timeTaken = endTime - startTime; 
                    console.log("winnerName(): " + timeTaken + " milliseconds");
                    this.setState({ winnerName: winnerName });
                }

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                console.error(error);
            }
        }
        else {
            try {
                // Get network provider and web3 instance.
                const web3 = await getWeb3();
                // Use web3 to get the user's accounts.
                const accounts = await web3.eth.getAccounts();

                // Get the contract instance.
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Election.networks[networkId];
                const instance = new web3.eth.Contract(
                Election.abi,
                deployedNetwork && deployedNetwork.address,
                );

                this.setState({ ElectionInstance: instance,  web3: web3, account: accounts[0] });

                const owner = await this.state.ElectionInstance.methods.getOwner().call();
                if(this.state.account === owner){
                    this.setState({ isOwner: true });
                }

                let candidateCount = await this.state.ElectionInstance.methods.getCandidateCount().call();
                this.setState({ candidateCount: candidateCount });
                this.parseCandidates(this.state.candidateCount);

                let voterCount = await this.state.ElectionInstance.methods.getVoterCount().call();
                this.setState({ voterCount: voterCount });

                let castVoterCount = await this.state.ElectionInstance.methods.getCastVotesCount().call();
                this.setState({ castVoterCount: castVoterCount });

                let electionStarted = await this.state.ElectionInstance.methods.getStart().call();
                this.setState({ electionStarted: electionStarted });

                let electionEnded = await this.state.ElectionInstance.methods.getEnd().call();
                this.setState({ electionEnded: electionEnded });

                this.setState({ winnerName: '' });
                if(this.state.electionEnded === true){
                    let winnerName = await this.state.ElectionInstance.methods.winnerName().call();
                    this.setState({ winnerName: winnerName });
                }

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
                console.error(error);
            }
        }
    };

    parseCandidates = async (candidateCount) => {
        let candidatesList = []
        let startTime, endTime, timeTaken;
        if (this.state.timing === true) {
            for (let i = 1; i <= candidateCount; i++) {
                startTime = performance.now();
                let candidateName = await this.state.ElectionInstance.methods.getCandidateName(i).call();
                let candidateParty = await this.state.ElectionInstance.methods.getCandidateParty(i).call();
                let candidateVoteCount = await this.state.ElectionInstance.methods.getCandidateVoteCount(i).call();
                endTime = performance.now();
                timeTaken = endTime - startTime; 
                console.log("getCandidateData(" + i + "):" + timeTaken + " milliseconds");
                candidatesList.push({
                    candidateId: i,
                    name: candidateName,
                    party: candidateParty,
                    voteCount: candidateVoteCount
                });
            }
        }
        else {
            for (let i = 1; i <= candidateCount; i++) {
                let candidateName = await this.state.ElectionInstance.methods.getCandidateName(i).call();
                let candidateParty = await this.state.ElectionInstance.methods.getCandidateParty(i).call();
                let candidateVoteCount = await this.state.ElectionInstance.methods.getCandidateVoteCount(i).call();
                candidatesList.push({
                    candidateId: i,
                    name: candidateName,
                    party: candidateParty,
                    voteCount: candidateVoteCount
                });
            }
        }
        
        this.setState({ candidatesToDisplay: candidatesList });
    }
        
    render(){
        return(
            <Router history={history}>
                <Navbar isOwner={this.state.isOwner}/>
                <Switch>
                    <Route exact path='/' component={() => (
                        <div>
                        <Jumbotron account={this.state.account}/>
                        {this.state.isOwner &&
                        <Admin account={this.state.account} ElectionInstance={this.state.ElectionInstance}/>}
                        <VotingPanel 
                            ElectionInstance={this.state.ElectionInstance}
                            account={this.state.account}
                            candidateCount={this.state.candidateCount} 
                            voterCount={this.state.voterCount} 
                            castVoterCount={this.state.castVoterCount} 
                            candidates={this.state.candidatesToDisplay}
                            electionStarted={this.state.electionStarted}
                            electionEnded={this.state.electionEnded}
                            winnerName={this.state.winnerName}
                        />
                        </div>
                    )}/>
                </Switch>
            </Router>
        );
    }
}

export default App;