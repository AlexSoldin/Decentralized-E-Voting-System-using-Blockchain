import React, { Component } from "react";
import "../App.css";
import { Segment, Container } from 'semantic-ui-react'

class Jumbotron extends Component {
  render() {
    return (
      <div className="Jumbotron">
        <Container>
          <Segment>
            <h1>Welcome to VoteChain!</h1>
            <h3>An electronic voting system that uses blockchain technology.</h3>
            <h5>Your address is: {this.props.account}</h5>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default Jumbotron;