import React, { Component } from 'react'
import { Menu, Segment, Container, Icon } from 'semantic-ui-react'
import '../App.css'

export default class Navbar extends Component {
  state = { activeItem: 'VoteChain' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    
    const { isOwner } = this.props;
    let ownerString;
    if(isOwner){
        ownerString="Logged in as Owner";
    }
    else{
        ownerString="Logged in as Participant";
    }

    return (
      <div className="Navbar"> 
        <Segment inverted>
        <Container>
        <Menu inverted pointing secondary>
            <Menu.Item style={{  display: "inline-block" }}> 
                <Icon name='code' size='large'/>
            </Menu.Item>
            <Menu.Item header disabled
                name='VoteChain'
                active={activeItem === 'VoteChain'}
                // onClick={this.handleItemClick}
            />
            {/* <Menu.Item
                name='messages'
                active={activeItem === 'messages'}
                onClick={this.handleItemClick}
            />
            <Menu.Item
                name='friends'
                active={activeItem === 'friends'}
                onClick={this.handleItemClick}
            /> */}
            <Menu.Menu position='right'>
                <Menu.Item
                name={ownerString}
                />
            </Menu.Menu>
        </Menu>
        </Container>
        </Segment>
        {/* <Segment>
          <img src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
        </Segment> */}
      </div>
    )
  }
}