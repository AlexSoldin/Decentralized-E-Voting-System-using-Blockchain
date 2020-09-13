import React, { Component } from 'react'
import { Router, Switch, Route } from 'react-router-dom';
import Election from "./contracts/Election.json";
import getWeb3 from "./getWeb3";

import Navbar from './components/Navbar';
import Jumbotron from './components/Jumbotron';
import VotingPanel from './components/VotingPanel';
import Candidate from './components/Candidate';
import history from './history';


class App extends Component {
    state = { 
        ElectionInstance: undefined, 
        web3: null, 
        account: null, 
        isOwner: false
    };  
    

    componentDidMount = async () => {
        if(!window.location.hash){
            window.location = window.location + '#loaded';
            window.location.reload();
        }

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

            let start = await this.state.ElectionInstance.methods.getStart().call();
            let end = await this.state.ElectionInstance.methods.getEnd().call();

            this.setState({ start: start, end: end });

            // this.addCandidate();

            let candidateCount = await this.state.ElectionInstance.methods.getCandidateCount().call();
            this.setState({ candidateCount: candidateCount });
            console.log(candidateCount);
            this.parseCandidates(candidateCount);

        } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
        }
    };

    parseCandidates = async (candidateCount) => {
        let candidatesList = []
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
        this.setState({ candidatesToDisplay: candidatesList });
        // console.log(this.state.candidatesToDisplay);
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
                        <Candidate account={this.state.account} ElectionInstance={this.state.ElectionInstance}/>}
                        <VotingPanel candidates={this.state.candidatesToDisplay}/>
                        </div>
                    )}/>
                </Switch>
            </Router>
        );
    }
}

export default App;