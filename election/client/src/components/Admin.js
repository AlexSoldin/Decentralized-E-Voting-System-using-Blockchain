import React, { Component } from 'react';
import "../App.css";
import { Segment, Container, Divider, Form, Button } from 'semantic-ui-react'


class Admin extends Component {
    state = { 
        timing: true
    };  

    updateCandidateName = event => {
        this.setState({ name: event.target.value });
    }

    updateCandidateParty = event => {
        this.setState({ party: event.target.value });
    }

    updateVoter = event => {
        this.setState({ voter: event.target.value });
    }

    addCandidate = async () => {
        if (this.state.timing === true) {
            let startTime = performance.now();
            await this.props.ElectionInstance.methods.addCandidate(
                this.state.name,
                this.state.party
            ).send({
                from: this.props.account,
                gas: 1000000
            });
            let endTime = performance.now();
            let timeTaken = endTime - startTime; 
            console.log("addCandidate(): " + timeTaken + " milliseconds");
        }
        else {
            await this.props.ElectionInstance.methods.addCandidate(
                this.state.name,
                this.state.party
            ).send({
                from: this.props.account,
                gas: 1000000
            });
            // Reload the page
            window.location.reload(false);
        }
    }

    addVoter = async () => {
        if (this.state.timing === true) {
            let startTime = performance.now();
            await this.props.ElectionInstance.methods.addVoter(
                this.state.voter
            ).send({
                from: this.props.account,
                gas: 1000000
            });
            let endTime = performance.now();
            let timeTaken = endTime - startTime; 
            console.log("addVoter(): " + timeTaken + " milliseconds");
        }
        else {
            await this.props.ElectionInstance.methods.addVoter(
                this.state.voter
            ).send({
                from: this.props.account,
                gas: 1000000
            });
            // Reload the page
            window.location.reload(false);
        }
    }

    startElection = async () => {
        if (this.state.timing === true){
            let startTime = performance.now();
            await this.props.ElectionInstance.methods.startElection().send({
                from: this.props.account,
                gas: 1000000
            });
            let endTime = performance.now();
            let timeTaken = endTime - startTime; 
            console.log("startElection(): " + timeTaken + " milliseconds");
        }
        else {
            await this.props.ElectionInstance.methods.startElection().send({
                from: this.props.account,
                gas: 1000000
            });
            // Reload the page
            window.location.reload(false);
        }
        console.log("Election has started.")
    }

    endElection = async () => {
        if (this.state.timing === true){
            let startTime = performance.now();
            await this.props.ElectionInstance.methods.endElection().send({
                from: this.props.account,
                gas: 1000000
            });
            let endTime = performance.now();
            let timeTaken = endTime - startTime; 
            console.log("endElection(): " + timeTaken + " milliseconds");
        }
        else {
            await this.props.ElectionInstance.methods.endElection().send({
                from: this.props.account,
                gas: 1000000
            });
            // Reload the page
            window.location.reload(false);
        }
        console.log("Election has ended.")
    }

    render(){
        return(
            <div className="Candidate">
                <Container>
                    <Segment>
                        <h1>Admin</h1>

                        <Button color='green' onClick={this.startElection} >Start Election</Button>
                        <Button color='red' onClick={this.endElection} >End Election</Button>

                        <Divider horizontal>Add Candidate</Divider>

                        <Form>
                            <Form.Group widths='equal'>
                            <Form.Input
                                fluid
                                id='form-subcomponent-shorthand-input-candidate-name'
                                label='Name'
                                placeholder='Name'
                                onChange={this.updateCandidateName}
                            />
                            <Form.Input
                                fluid
                                id='form-subcomponent-shorthand-input-candidate-party'
                                label='Party'
                                placeholder='Party'
                                onChange={this.updateCandidateParty}
                            />
                            </Form.Group>
                            <Button onClick={this.addCandidate}>Add Candidate</Button>
                        </Form>

                        <Divider horizontal>Add Voter</Divider>

                        <Form>
                            <Form.Input
                                fluid
                                id='form-subcomponent-shorthand-input-voter'
                                label='Public Key'
                                placeholder='Public Key'
                                onChange={this.updateVoter}
                            />
                            <Button onClick={this.addVoter} >Add Voter</Button>
                        </Form>

                    </Segment>
                </Container>
            </div>
        );
    }
}

export default Admin;