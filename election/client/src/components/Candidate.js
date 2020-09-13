import React, { Component } from 'react';
import "../App.css";
import { Segment, Container, Form, Button } from 'semantic-ui-react'


class Candidate extends Component {

    updateName = event => {
        this.setState({ name: event.target.value });
    }

    updateParty = event => {
        this.setState({ party: event.target.value });
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

    render(){
        return(
            <div className="Candidate">
                <Container>
                    <Segment>
                        <h1>Add Candidate</h1>

                        <Form>
                            <Form.Group widths='equal'>
                            <Form.Input
                                fluid
                                id='form-subcomponent-shorthand-input-name'
                                label='Name'
                                placeholder='Name'
                                onChange={this.updateName}
                            />
                            <Form.Input
                                fluid
                                id='form-subcomponent-shorthand-input-party'
                                label='Party'
                                placeholder='Party'
                                onChange={this.updateParty}
                            />
                            </Form.Group>
                            <Button onClick={this.addCandidate}>Add Candidate</Button>
                        </Form>
                    </Segment>
                </Container>
            </div>
        );
    }
}

export default Candidate;