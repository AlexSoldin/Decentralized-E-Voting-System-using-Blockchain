# Decentralized E-Voting System using Blockchain
This project aimed to implement an electronic voting system using blockchain technology. The system was created by using a blockchain back-end and web application front-end. Numerous system tests were conducted to ensure that the system was performing as expected. Additionally, a timing analysis was conducted to ensure that the interaction between back-end and front-end occurred in a timely manner.

The languages, frameworks, libraries and, software used to implement the election system are listed below.
- Solidity
- Truffe 
- Ganache
- JavaScript
- React
- Web3
- MetaMask

## Smart Contract
The Ethereum blockchain was chosen for this specific application as it allows for the execution of smart contracts. The *Election.sol* smart contract was created using the Soldity language. The contract, stored on the local blockchain, was used to host and conduct the election proceedings. 

Ganache is used to host the local blockchain and the Truffle framework provides a method to migrate the election contract onto the local blockchain. This statement used to migrate the contract while resetting all its parameter values is shown below.
```TEXT
truffle migrate --reset
```

## Web Application
The web application was created using the React library which allows for the creation of multiple components that can be rendered depending on different conditions. The election web application was comprised of several components which will be discussed below. The statement to start the web application server is shown below.
```TEXT
npm run start
```

### App.js
- Connect to the local blockchain instance using Web3 and read the value of certain variable
- Determine which components to render depending on the information read from the blockchain
    - E.g. Is the Admin account acceessing the web application ? yesAdminComponent() : noAdminComponent() 
- Transmit data from blockchain to other components to use

### Navbar.js
- Render a menu bar 
- Display the status of the account 
    - Owner
    - Participant

### Jumbotron.js
- Render a welcome message and explain the nature of the system
- Display the public key address of the account accessing the election

### Admin.js
- Display the administrator functionality 
    - Start the election
    - End the election
    - Add a new candidate
    - Add a new voter

### VotingPanel.js
- Render a table with all available candidates
- Allow the voter to cast their vote using the candidates unique identification number
- Display the winner and *Pie.js* component when the election is ended

### Pie.js
- Render a responsive pie chart, within the *VotingPanel.js* component, that displayed the distribution of votes cast in the election

## System Tests
A myriad of system tests were conducted to ensure the correct features and protocols were followed. The tests can be viewed and executed using the following command.
```TEXT
truffle test
```

## Timing Analysis
To view the timing analysis of the election system, the *timing* state variable in *App.js*, *Admin.js* and, *VotingPanel.js* should be changed to *true*. The timing results of each method execution will be displayed in the console.