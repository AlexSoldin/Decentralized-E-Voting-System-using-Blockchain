import React, { Component } from "react";
import "../App.css";
import { Segment, Container, Table, Header, Divider, Form, Button } from 'semantic-ui-react';
import Pie from './Pie';

class VotingPanel extends Component {

    updateCandidate = event => {
        this.setState({ candidateId: event.target.value });
    }

    displayTableCandidatesResults = (candidates) =>
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
            <Table.Cell></Table.Cell>
            </Table.Row>
    ));

    castVote = async () => {
        const result =  await this.props.ElectionInstance.methods.vote(
            this.state.candidateId
        ).send({
            from: this.props.account,
            gas: 1000000
        });
        console.log(result);
        
        // Reload the page
        window.location.reload(false);
    }

    render() {
        const { candidates, winnerName } = this.props;

        // Pie chart data
        const labels = [];
        const data = {
            series: []
        };

        if(candidates !== undefined){
            for(let i = 0; i < this.props.candidateCount; i++){
                let index = candidates[i].name.indexOf(' ', 0);
                labels.push(candidates[i].name.substring(index+1));
                data.series.push(parseInt(candidates[i].voteCount, 10));
            }
        }
        
        return (
            <div className="VotingPanel">
                <Container>
                <Segment>
                    <h1>Election</h1>

                    {
                        this.props.electionStarted === true ?
                        <h3>Election has started</h3> :
                        <p></p>
                    }

                    {
                        this.props.electionEnded === true ?
                        <h3>Election has ended</h3> :
                        <p></p>
                    }

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
                            
                            this.props.electionEnded===true ?
                            this.displayTableCandidatesResults(candidates) :
                            this.displayTableCandidates(candidates)
                        }
                        </Table.Body>
                    </Table>

                    {
                        winnerName !== '' ?
                        <h3 className="winner">The winner is {winnerName}</h3> :
                        <p></p>
                    }

                    {
                        candidates === undefined ?
                        <p></p> :
                        this.props.electionEnded===true ?
                        <Pie data={data} labels={labels} /> : <p></p>
                    }
                    
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