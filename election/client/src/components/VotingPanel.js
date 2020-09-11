import React, { Component } from "react";
import "../App.css";
import { Segment, Container, Table, Header, Divider, Form, Button } from 'semantic-ui-react'

class VotingPanel extends Component {

    displayTableCandidates = (candidates) =>   
        candidates.map((candidate) => (
                <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Header.Content>
                            [{candidate.candidateId}] {candidate.name}
                            <Header.Subheader>Party: {candidate.party}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>{candidate.voteCount}</Table.Cell>
              </Table.Row>
        ));
    
    displayFormCandidates = (candidates) =>   
        candidates.map((candidate) => (
                <option value={candidate.name}>[{candidate.candidateId}] {candidate.name}</option>
        ));

    render() {
        const { candidates } = this.props;
        console.log(candidates);
        return (
            <div className="VotingPanel">
                <Container>
                <Segment>
                    <h1>Election</h1>

                    <Divider horizontal>Candidates</Divider>

                    <Table basic='very' celled collapsing>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Candidate</Table.HeaderCell>
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
                    
                    <Divider horizontal>Select a Candidate</Divider>

                    <Form>
                        <Form.Field control='select'>
                            {
                                candidates === undefined ?
                                <option value="Loading">Loading...</option> :
                                this.displayFormCandidates(candidates)
                            }
                        </Form.Field>
                        <Button>Vote</Button>
                    </Form>

                </Segment>
                </Container>
            </div>
        );
    }
}

export default VotingPanel;