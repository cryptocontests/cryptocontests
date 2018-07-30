# Cryptocontests

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Test ⚙️

### Smart Contracts

The smartcontract tests will be executed with truffle in the ganache network and we will verify that the smartcontract methods work and give the expected results. The tests are in /test/CryptoContest.test.js where we can modify the parameters used.

To start the tests we will execute the following script that starts the ganache network with personalized accounts to use them in the tests:

```
./scripts/run_ganache.sh
```
Once the network is up we will execute the tests with the following command:

```
./scripts/truffle_test.sh
```

