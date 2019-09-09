# Ethereum Smart Contract workshop

## Workshop Overview

## Before you begin
TBC

## Prerequisites
TBC

## Environment setup
Installation guides bellow will assume Mac OS system. Guides for other OSs
can be found online.

### Install nodejs

Download and install latest node.js from [here](https://nodejs.org/en/download/). 
Install nodejs by unpacking it and adding to the `PATH`.
```bash
$ sudo mkdir -p /usr/local/lib/nodejs
$ sudo tar -xJvf node-v10.16.3-darwin-x64.tar -C /usr/local/lib/nodejs
$ export PATH=/usr/local/lib/nodejs/node-v10.16.3-darwin-x64/bin:$PATH
```
Check that has sucessfully installed and is ready to be used.
```bash
$ node -v
$ npm version
```

### Setup Ganache
Ganache is a personal blockchain for Ethereum development you can use to 
deploy contracts, develop your applications, and run tests.
Download Ganache from [here](https://www.trufflesuite.com/ganache)
Start Ganache and create a new workspace (or use Quickstart option).
One started Ganache run on address `127.0.0.1:7545`. 

## Setup Truffle
Truffle is a world class development environment, testing framework and asset 
pipeline for blockchains using the Ethereum Virtual Machine (EVM).
Install truffle using npm:
```bash
$ npm install -g truffle
```
Start truffle with default contracts and tests:
```bash
$ truffle init
```

## Install MetaMask
MetaMask is a self-hosted wallet to store, send and receive ETH and ERC20.
Download MetaMask Chrome extension [here](https://metamask.io/).
When installed, press `Get Started` and select `Import Wallet` option.
Import an account by entering the mnemonic that is displayed in Ganache and
password.
Once in the MetaMask wallet change `Main Network` at the drop down at the 
top right corner: select `Custom RPC`. Then create new network by entering
Ganache RPC: `http://127.0.0.1:7545`. Once saved - local testing account index 0 
should be visible in the dashboard.

## OpenZeppelin contracts
OpenZeppelin is an open source example Ethereum smart contracts 
[library](https://github.com/OpenZeppelin/openzeppelin-contracts)
  
## Smart Contract code walkthrough

Voting: 
http://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial

Token:
https://www.trufflesuite.com/tutorials/robust-smart-contracts-with-openzeppelin

Good intro:
https://medium.com/@ConsenSys/a-101-noob-intro-to-programming-smart-contracts-on-ethereum-695d15c1dab4

Windows OS:
https://codeburst.io/build-your-first-ethereum-smart-contract-with-solidity-tutorial-94171d6b1c4b

