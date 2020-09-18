import React, { Component } from "react";
import "../App.css";
import { Segment, Container, Table, Header, Divider, Form, Button } from 'semantic-ui-react'

class VotingPanel extends Component {

    updateCandidate = event => {
        // event.preventDefault();
        this.setState({ candidateId: event.target.value });
    }

    displayTableCandidates = (candidates) =>   
        candidates.map((candidate) => (
                <Table.Row key={candidate.candidateId}>
                <Table.Cell>
                    {candidate.candidateId}
                </Table.Cell>
                <Table.Cell>
                    {candidate.name}
                </Table.Cell>
                <Table.Cell>
                    {candidate.party}
                </Table.Cell>
                <Table.Cell>{candidate.voteCount}</Table.Cell>
              </Table.Row>
        ));
    
    displayFormCandidates = (candidates) =>   
        candidates.map((candidate) => (
                <option 
                    key={candidate.candidateId} 
                    value={candidate.name}>
                        [{candidate.candidateId}] {candidate.name}
                </option>
        ));

    castVote = async () => {
        await this.props.ElectionInstance.methods.vote(
            this.state.candidateId
        ).send({
            from: this.props.account,
            gas: 1000000
        });
        // Reload the page
        window.location.reload(false);
    }

    render() {
        const { candidates } = this.props;
        return (
            <div className="VotingPanel">
                <Container>
                <Segment>
                    <h1>Election</h1>

                    <div>
                        Number of Candidates: {this.props.candidateCount}
                    </div>
                    <div>
                        Number of Registered Voters: {this.props.voterCount}
                    </div>
                    <div>
                        Number of Cast Votes: {this.props.castVoterCount}
                    </div>

                    <Divider horizontal>Candidates</Divider>

                    <Table basic='very' celled collapsing>
                        <Table.Header>
                        <Table.Row key="headings">
                            <Table.HeaderCell>Candidate ID</Table.HeaderCell>
                            <Table.HeaderCell>Candidate</Table.HeaderCell>
                            <Table.HeaderCell>Political Party</Table.HeaderCell>
                            <Table.HeaderCell>Vote Count</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {
                        candidates === undefined ?
                        <Table.Row>
                            <Table.Cell>
                                <Header as='h4' image>
                                    <Header.Content>
                                        Loading...
                                        <Header.Subheader>Please be patient</Header.Subheader>
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>0</Table.Cell>
                        </Table.Row> :
                        this.displayTableCandidates(candidates)
                        }
                        </Table.Body>
                    </Table>
                    
                    <Divider horizontal>Select Candidate</Divider>

                    <Form>
                        <Form.Input
                            fluid
                            id='form-subcomponent-shorthand-input-candidate-id'
                            label='Candidate ID'
                            placeholder='Candidate ID'
                            onChange={this.updateCandidate}
                        />
                        <Button onClick={this.castVote} >Vote</Button>
                    </Form>

                </Segment>
                </Container>
            </div>
        );
    }
}

export default VotingPanel;