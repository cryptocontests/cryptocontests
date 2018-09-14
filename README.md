# Cryptocontests

Cryptocontests is a dApp for the creation of uncorruptible contests by utilizing blockchain
technology in the Ethereum network.

Ropsten live system:
[http://cryptocontests.rf.gd](http://cryptocontests.rf.gd)

Funcionalities available to the system:

* Create contests, configuring its award, rules and dates.
* Add and remove judges from the contest
* Participate freely in the contest, presenting a stake
* Vote candidatures
* Transfer award automatically to the winner

Each contest goes through these phases:

* Upcoming contest: contest not yet started, judges can be modified
* Ongoing contest: new candidatures are presented to the contest
* Contest on revision: judges are revising and voting the candidatures 
* Ended contest: retrieve the stake presented with the candidatures, plus the award if you have won!

This project was part of the "Postgrau en Tecnologies Blockchain" of the 
"Univesitat Politècnica de Catalunya" (Barcelona, September 2018).

## Development

The dApp is divided in frontend (based in Angular 6) and Ethereum's smart-contracts.

Frontend is stored in `src` (source code for the frontend) and `projects` (component libraries).

Smart-contracts are stored in `contracts/`.

To install the dependencies, run `npm install`. Also run `npm i -g truffle ganache-cli` if 
not installed globally.

To boot up the local development server, run `npm run dev`. Frontend changes should be reloaded to
the application directly, smart-contract changes require a restart of the command.

### Build

Run `truffle compile` to build the smart-contracts. The build artifacts, including ABI, will
be stored in the `build/` folder.

Run `ng build` to build the frontend project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Deploy

To deploy the smart contract to Ethereum's Ropsten testnet, run `truffle migrate --network ropsten`.
This requires gas on your account on the Ropsten network.

To deploy the frontend, copy the content of the `dist/cryptocontests` folder
 to the root of folder of your usual server, that should be able capable of serving static files.

### Test 

#### Smart Contracts

The smart-contract tests will be executed with truffle in the ganache network and we will verify that the smart-contract methods work and give the expected results. The tests are in /test/CryptoContest.test.js where we can modify the parameters used.

To start the tests we will execute the following script that starts the ganache network with personalized accounts to use them in the tests:

```
./scripts/run_ganache.sh
```
Once the network is up we will execute the tests with the following command:

```
./scripts/truffle_test.sh
```

