import React, { Component } from 'react';
import "../App.css";
import { Segment, Container, Divider, Form, Button } from 'semantic-ui-react'


class Admin extends Component {

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

    addVoter = async () => {
        await this.props.ElectionInstance.methods.addVoter(
            this.state.voter
        ).send({
            from: this.props.account,
            gas: 1000000
        });
        // Reload the page
        window.location.reload(false);
    }

    render(){
        return(
            <div className="Candidate">
                <Container>
                    <Segment>
                        <h1>Admin</h1>

                        {/* <Divider /> */}
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