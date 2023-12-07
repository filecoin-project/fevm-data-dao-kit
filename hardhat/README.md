# FEVM-Data-DAO-Kit

This is a beta kit to demo how to build a basic Decentralized Autonomous Organization (DAO) on Filecoin. Currently, this kit is based on contracts from [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/governance). These contracts are used in conjunction with the Filecoin RaaS (Redundancy/Repair/Replication as a Service) pattern and work with [Lighthouse](https://lighthouse.storage).

This initial version is inspired by Patrick Collin's excellent repo and tutorial so be sure to check them out to learn more about how this DAO template works!

* [Video](https://www.youtube.com/watch?v=AhJtmUqhAqg)
* [Original Repo](https://github.com/PatrickAlphaC/dao-template)

## Cloning the Repo

Open up your terminal (or command prompt) and navigate to a directory you would like to store this code on. Once there type in the following command:


```
git clone  https://github.com/filecoin-project/fevm-data-dao-kit.git
cd fevm-data-dao-kit/hardhat
yarn install
```


This will clone the data dao kit onto your computer, switch directories into the newly installed kit, and install the dependencies the kit needs to work.

## Get a Private Key

You can get a private key from a wallet provider [such as Metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).


## Add your Private Key as an Environment Variable

Add your private key as an environment variable by running this command:

 ```
export PRIVATE_KEY='abcdef'
```

If you use a .env file, don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

## Fund the Deployer Address

Go to the [Calibration testnet faucet](https://faucet.calibration.fildev.network/), and paste in the Ethereum address from the previous step. This will send some Calibration testnet FIL to the account.

## Deploy the Contracts

Currently there are 4 contracts in this repo:

* Lighthouse Client: This is thin wrapper that calls the Lighthouse client contract from the RaaS repository. 

* Data Governance Token: This contract mints [OpenZeppelin ERC20Votes](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes) token which are used to vote on DAO proposals (or delegate another person to vote on your behalf).

* Governor Contract: This contract, based on the [OpenZeppelin Governor contract](https://docs.openzeppelin.com/contracts/4.x/api/governance#Governor), manages proposals and votes. This is the "heart" of the DAO.


Type in the following command in the terminal to deploy all contracts:

 ```
yarn hardhat deploy
```

This will compile all the contracts in the contracts folder and deploy them automatically! The deployments scripts can be found in the deploy folder. This should also generate a deployments directory which can referenced for the address and details of each deployment.

## Preparing Data for Storage

This DataDAO is intended to vote on the long term storage of an exsiting piece of data on the IPFS network.
So you should already have a piece of data uploaded to IPFS. You can use IPFS Desktop to do this, or a hosted
service such as web3.storage, Lighthouse, or Piniata. You need to have a CID of the content.

## How to use the DataDAO

This example DataDAO is set to only require 1 vote to pass a proposal, and each proposal is only open for voting for 3
minutes. This is intended to allow rapid demonstration of the features. You can adjust these parameters in `GovernorContract.sol`.

The steps to demonstrate this DataDAO are:

1. Propose a CID to be stored
```
$ yarn hardhat propose --cid bafybeiekxjtze73real6pe6n3p2ys7u4ylloq5enoeg4rzwjgujyqgnixa --reason 'Hello Bengaluru!'
yarn run v1.22.19
Proposing storeCID on 0xc2278Dbd0a87d098Dd2A97C52dBD54336FEC6790 with 0x00017012208aba67927f712017e793cddbf5897e9cc2d6e8748d710dc8e6c935138819a8b8
Proposal Description:
Hello Bengaluru!
Proposed with proposal ID:
  18325367854836360428578384737333505528127092052047626009794354786652540365561
Current Proposal State: 0
✨  Done in 68.01s.
```

2. Vote on the proposal. It only requires a single vote to become valid. This vote has to occur within the 3-minute voting
window from when the proposal was submitted. Insert the proposal ID from above into the command below:
```
% yarn hardhat vote --proposal-id 18325367854836360428578384737333505528127092052047626009794354786652540365561 --reason 'Hello Bengaluru!' --vote 1
yarn run v1.22.19
Voting 1 on 18325367854836360428578384737333505528127092052047626009794354786652540365561 because Hello Bengaluru!
Hello Bengaluru!
Current Proposal State: 1
✨  Done in 69.08s.
```

3. Execute the proposal. This can only occur *after the 3 minute voting window*. You will get an error if you try to
execute before the voting window has closed. The `cid` and `reason` have to match the proposal in step 1.
```
% yarn hardhat execute --cid bafybeiekxjtze73real6pe6n3p2ys7u4ylloq5enoeg4rzwjgujyqgnixa --reason 'Hello Bengaluru!'
yarn run v1.22.19
Executing...
Executed!
✨  Done in 75.26s.
```

Once the proposal has been executed then the CID will be passed to Lighthouse's contract to initiate storage by them. 

