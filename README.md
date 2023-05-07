# Submintr

Submintr is a React-based web application that allows users to manage, explore, and mint Ethereum Name Service (ENS) subdomains. The application leverages the ENS Name Wrapper to enable new use cases and monetization possibilities for ENS subdomains.

## Features

- Wallet connection using MetaMask
- Display a list of owned ENS domains
- Display information about a selected owned ENS domain
- Mint subdomains for owned ENS domains
- Wrap ENS domains and send them to the Explore Domains contract
- Explore ENS domains available for subdomain minting in the Explore Domains contract
- Display information about a selected available ENS domain
- Mint subdomains for ENS domains in the Explore Domains contract
- Monetize ENS domains by setting a price for subdomain minting

## Components

- **App**: The main component that wraps around the entire application. It includes the router, header, and button to connect or disconnect a wallet.
- **HomePage**: The landing page component that displays a welcome message, an image, and a button to navigate to the /domains route.
- **MainPage**: The main page component that displays two main sections: DomainsList and ExploreDomains.
- **DomainsList**: A component that displays a list of ENS domains owned by the user. Users can select a domain to view more information about it and perform actions like minting subdomains or sending the domain to the Explore Domains contract.
- **SelectedDomainLeft**: A component that displays information about a selected ENS domain and provides options to mint a subdomain or wrap and send the domain to the Explore Domains contract.
- **ExploreDomains**: A component that displays a list of ENS domains available for exploration and subdomain minting in the Explore Domains contract. Users can select a domain to explore and view more information about it.
- **ExploreDomainsRight**: A component that displays information about a selected ENS domain available for exploration and provides options to mint a subdomain or withdraw the domain (if the user is the owner).

## Installation

1. Clone the repository:

git clone https://github.com/0xgeeb/eth_denver.git

2. Change directory to the project folder:

cd eth_denver

3. Install the required dependencies:

npm install

4. Start the development server:

npm start


The application should now be running on http://localhost:3000/.

## Dependencies

- React
- web3-react
- ethers.js
- Alchemy SDK
- react-router-dom

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to report bugs or suggest new features.

## License

This project is licensed under the MIT License.
