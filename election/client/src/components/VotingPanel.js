import React, { Component } from "react";
import "../App.css";
import { Segment, Container, List, Form, Button } from 'semantic-ui-react'

class VotingPanel extends Component {

    render() {
        console.log(this.state);
        return (
            <div className="VotingPanel">
                <Container>
                <Segment>
                    <h1>Election</h1>
                    <h4>Candidates</h4>
                    <List>
                    {/* {this.props.candidates.map((candidate) => {
                        return(
                            <List.Item>
                            <List.Header>{candidate.candidateId.toNumber()}: {candidate.name}</List.Header>
                            {candidate.party.toNumber()}
                            </List.Item>
                        );
                    })} */}

                    </List>

                    <h4>Select a Candidate</h4>
                    <Form>
                        <Form.Field control='select'>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
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